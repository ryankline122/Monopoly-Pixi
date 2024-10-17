package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
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

    defer func() {
        log.Println("closing connection")
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
        i := 1
        
        for {
            response := fmt.Sprintf("Message count: %d", i)
            err = conn.WriteMessage(websocket.TextMessage, []byte(response))
            if err != nil {
                log.Printf("Error %s when sending message to client", err)
                return
            }
            i += 1
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
