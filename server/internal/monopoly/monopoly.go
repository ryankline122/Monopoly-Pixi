package monopoly

type Player struct {
    Number int
}

type Gamestate struct {
    CurrentPlayer int
    Players []Player
}

var State = Gamestate{CurrentPlayer: 1, Players: make([]Player, 0)}