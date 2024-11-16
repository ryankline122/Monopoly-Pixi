package main

import (
	"fmt"
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
	resp, client := monopoly.AddPlayer(conn, playerNumber)

	err = conn.WriteJSON(resp)
	if err != nil {
		log.Printf("Error %s when sending message to client", err)
		return
	}

	defer func() {
		log.Println("closing connection")
		clients.RemoveClient(client.ID)
		monopoly.RemovePlayer(playerNumber)
		alertAllClients()
		conn.Close()
	}()

	// Tell other clients a new player has joined
	alertAllClients()

	// Request/Response loop
	for {
		var req dto.ClientRequest = dto.ClientRequest{}
		err = conn.ReadJSON(&req)

		if err != nil {
			log.Printf("Error %s when reading client request", err)
		}
		log.Print("Recieved request: ", req)

		// Handle different actions
		active := true
		switch req.Action {
		case dto.Ready:
			monopoly.UpdatePlayerReadyStatus(playerNumber)
			active = false
		case dto.Start:
			active = true
		case dto.Roll:
			log.Printf("Rolling")
			monopoly.Roll(playerNumber)
		default:
			log.Printf("Unknown action: %d", req.Action)
		}
		alertAllClients()

		resp = monopoly.Response{
			Initial:      false,
			Active:       active,
			PlayerNumber: playerNumber,
			Gamestate:    monopoly.State,
		}

		err = conn.WriteJSON(resp)
		if err != nil {
			log.Printf("Error %s when sending message to client", err)
			return
		}
		time.Sleep(2 * time.Second)
	}
}

func alertAllClients() {
	for _, client := range clients.Clients {
		playerNum, err := strconv.Atoi(client.ID)

		if err != nil {
			log.Printf("Error retrieving player number")
			playerNum = -1
		}

		fmt.Printf("alerting client %s\n", client.ID)
		msg := monopoly.Response{
			Initial:      false,
			PlayerNumber: playerNum,
			Gamestate:    monopoly.State,
		}
		err = client.Conn.WriteJSON(msg)
		if err != nil {
			log.Printf("Error %s when sending message to client", err)
			return
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
