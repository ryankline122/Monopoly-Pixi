package dto

import (
	"github.com/ryankline122/monopoly-pixi/internal/monopoly"
)

type Response struct {
	Initial bool
	PlayerNumber int
	Gamestate monopoly.Gamestate
}



