package clients

import (
	"github.com/gorilla/websocket"
)

type Client struct {
    ID string
    Conn *websocket.Conn
}

var Clients = make(map[string]*Client)

func AddClient(client *Client) {
    Clients[client.ID] = client
}

func RemoveClient(clientID string) {
    delete(Clients, clientID)
}