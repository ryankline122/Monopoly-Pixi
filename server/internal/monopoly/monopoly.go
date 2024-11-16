package monopoly

import (
	"log"
	"math/rand"
	"strconv"

	"github.com/gorilla/websocket"
	"github.com/ryankline122/monopoly-pixi/internal/clients"
	"github.com/ryankline122/monopoly-pixi/internal/dto"
)

type PlayerInfo struct {
	PlayerNumber int
	Username string
	IsReady bool
	Color string
	X float32
	Y float32
	NextSpace int
}
type Response struct {
	Initial bool
	Active bool
	PlayerNumber int
	Gamestate Gamestate
}

type Gamestate struct {
    CurrentPlayer PlayerInfo
	LastRoll int
    Players []PlayerInfo
}

type PlayerConfig struct {
	Color string
	StartX int
	StartY int
}

var State = Gamestate{
	CurrentPlayer: PlayerInfo{}, 
	Players: make([]PlayerInfo, 0),
}

var PlayerConfigs = []PlayerConfig{
    {Color: "purple", StartX: 0, StartY: 0},
    {Color: "blue", StartX: 10, StartY: 10},
    {Color: "red", StartX: -10, StartY: 5},
    // {Color: "blue", StartX: 10, StartY: 10},
    // {Color: "blue", StartX: 10, StartY: 10},
}

func AddPlayer(conn *websocket.Conn, playerNumber int) (Response, clients.Client) {
    var req dto.InitialRequest = dto.InitialRequest{};
    err := conn.ReadJSON(&req)

    if err != nil {
        log.Printf("Error %s when reading client request", err)
    }
    log.Printf("Recieved request: %s", req)
    log.Printf("Recieved username: %s", req.Username)

    newPlayer := PlayerInfo {
        PlayerNumber: playerNumber,
        Username: req.Username,
        IsReady: false,
        Color: PlayerConfigs[playerNumber -1].Color,
        X: float32(PlayerConfigs[playerNumber - 1].StartX),
        Y: float32(PlayerConfigs[playerNumber - 1].StartY),
    }

    client := clients.Client{ID: strconv.Itoa(playerNumber), Conn: conn}
    clients.AddClient(&client)

    if State.CurrentPlayer == (PlayerInfo{}) {
        State.CurrentPlayer = newPlayer
    }

    State.Players = append(State.Players, newPlayer)

    resp := Response{
        Initial: true,
        PlayerNumber: playerNumber,
        Gamestate: State,
    }

    return resp, client
}

func RemovePlayer(playerNumber int) {
    var updatedPlayers []PlayerInfo 
    for _, p := range State.Players {
        if p.PlayerNumber != playerNumber {
            updatedPlayers = append(updatedPlayers, p)
        }
    }
    State.Players = updatedPlayers
}

func UpdatePlayerReadyStatus(playerNumber int) {
    var updatedPlayers []PlayerInfo 
    for _, p := range State.Players {
        if p.PlayerNumber == playerNumber {
            p.IsReady = true
            updatedPlayers = append(updatedPlayers, p)
        } else {
            updatedPlayers = append(updatedPlayers, p)
        }
    }
    State.Players = updatedPlayers
}

func Roll(playerNumber int) {
    log.Printf("%s, %s", playerNumber, State.CurrentPlayer.PlayerNumber)
	if playerNumber == State.CurrentPlayer.PlayerNumber {
		value := rand.Intn(13-1) + 1
		State.LastRoll = value
		State.CurrentPlayer.NextSpace += value
		State.Players[State.CurrentPlayer.PlayerNumber - 1] = State.CurrentPlayer

		endTurn()
	}
}

func endTurn() {
	if State.CurrentPlayer.PlayerNumber + 1 > len(State.Players) {
		State.CurrentPlayer = State.Players[0]
	} else {
		State.CurrentPlayer = State.Players[State.CurrentPlayer.PlayerNumber]
	} 
}