package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/ryankline122/monopoly-pixi/internal/clients"
	"github.com/ryankline122/monopoly-pixi/internal/dto"
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
    newPlayer := monopoly.PlayerInfo {
        PlayerNumber: playerNumber,
        Color: "purple",
        X: 0,
        Y: 0,
    }

    client := clients.Client{ID: strconv.Itoa(playerNumber), Conn: conn}
    clients.AddClient(&client)

    if monopoly.State.CurrentPlayer == (monopoly.PlayerInfo{}) {
        monopoly.State.CurrentPlayer = newPlayer
    }

    monopoly.State.Players = append(monopoly.State.Players, newPlayer)
    
    resp := dto.Response{
        Initial: true,
        PlayerNumber: playerNumber,
        Gamestate: monopoly.State,
    }

    err = conn.WriteJSON(resp)
    if err != nil {
        log.Printf("Error %s when sending message to client", err)
        return
    }

    defer func() {
        log.Println("closing connection")
        clients.RemoveClient(client.ID)
        conn.Close()
    }()

    for {
        messageType, _, err := conn.ReadMessage()

        if err != nil {
            log.Printf("Error %s when reading message from client", err)
            return
        }

        if messageType != 1 {
            err = conn.WriteMessage(websocket.TextMessage, []byte("Unsupported message type")) 
            if err != nil {
                log.Printf("Error %s when sending message to client", err)
            }
            
            return
        }
        // log.Printf("Recieved message %s, message type: %d", string(message), messageType)

        
        for {
            var req dto.ClientResponse = dto.ClientResponse{};
            err = conn.ReadJSON(&req)

            if err != nil {
                log.Printf("Error %s when reading client request", err)
            }
            log.Printf("Recieved request: %s", req)

            if req == (dto.ClientResponse{}) {
                // Handle requests
                switch req.Action {
                case dto.Roll:
                    monopoly.Roll(playerNumber)
                default:
                    log.Printf("Unknown action: %d", req.Action)
                }

            }
            resp = dto.Response{
                Initial: false,
                PlayerNumber: playerNumber,
                Gamestate: monopoly.State,
            }
            // log.Printf("sending %s to client", resp)
            err = conn.WriteJSON(resp)
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
