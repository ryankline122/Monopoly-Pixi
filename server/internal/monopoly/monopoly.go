package monopoly

import (
	"math/rand"
)

type PlayerInfo struct {
	PlayerNumber int
	Color string
	X float32
	Y float32
	NextSpace int
}

type Gamestate struct {
    CurrentPlayer PlayerInfo
	LastRoll int
    Players []PlayerInfo
}

var State = Gamestate{CurrentPlayer: PlayerInfo{}, Players: make([]PlayerInfo, 0)}

func Roll(playerNumber int) {
	if playerNumber == State.CurrentPlayer.PlayerNumber {
		value := rand.Intn(13-1) + 1
		State.LastRoll = value
		State.CurrentPlayer.NextSpace += value
		State.Players[State.CurrentPlayer.PlayerNumber - 1] = State.CurrentPlayer
		EndTurn(playerNumber)
	}
}

func EndTurn(playerNumber int) {
	if State.CurrentPlayer.PlayerNumber + 1 > len(State.Players) {
		State.CurrentPlayer = State.Players[0]
	} else {
		State.CurrentPlayer = State.Players[State.CurrentPlayer.PlayerNumber + 1]
	} 
}