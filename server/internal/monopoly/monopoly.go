package monopoly

type PlayerInfo struct {
	PlayerNumber int
	Color string
	X float32
	Y float32
}

type Gamestate struct {
    CurrentPlayer int
    Players []PlayerInfo
}

var State = Gamestate{CurrentPlayer: 1, Players: make([]PlayerInfo, 0)}