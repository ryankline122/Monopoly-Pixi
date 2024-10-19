package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/ryankline122/monopoly-pixi/internal/clients"
	"github.com/ryankline122/monopoly-pixi/internal/monopoly"
)

type webSocketHandler struct {
    upgrader websocket.Upgrader
}

func (wsh webSocketHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    conn, err := wsh.upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Printf("error %s when upgrading connection to websocket", err)
        return
    }

    playerNumber := len(clients.Clients) + 1
    client := clients.Client{ID: strconv.Itoa(playerNumber), Conn: conn}
    newPlayer := monopoly.Player{Number: playerNumber}

    clients.AddClient(&client)
    monopoly.State.Players = append(monopoly.State.Players, newPlayer)

    defer func() {
        log.Println("closing connection")
        clients.RemoveClient(client.ID)
        conn.Close()
    }()

    for {
        messageType, message, err := conn.ReadMessage()

        if err != nil {
            log.Printf("Error %s when reading message from client", err)
            return
        }

        if messageType == websocket.BinaryMessage {
            err = conn.WriteMessage(websocket.TextMessage, []byte("server doesn't support binary messages")) 
            if err != nil {
                log.Printf("Error %s when sending message to client", err)
            }
            
            return
        }

        log.Printf("Recieved message %s", string(message))
        
        for {
            log.Printf("sending %s to client", monopoly.State)
            err = conn.WriteJSON(monopoly.State)
            if err != nil {
                log.Printf("Error %s when sending message to client", err)
                return
            }
            time.Sleep(2 * time.Second)
        }
    }
}

func main() {
    webSocketHandler := webSocketHandler{
        upgrader: websocket.Upgrader{
            CheckOrigin: func(r *http.Request) bool {
                return true
            },
        },
    }
    http.Handle("/", webSocketHandler)
    log.Print("Starting server...")
    log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
