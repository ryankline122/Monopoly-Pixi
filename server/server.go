package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type webSocketHandler struct {
    upgrader websocket.Upgrader
}

func (wsh webSocketHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    //TODO
}

func main() {
    webSocketHandler := webSocketHandler{
        upgrader: websocket.Upgrader{},
    }
    http.Handle("/", webSocketHandler)
    log.Print("Starting server...")
    log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
