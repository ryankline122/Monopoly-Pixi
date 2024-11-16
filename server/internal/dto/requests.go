package dto

const (
	Ready int = 0
	Start int = 1
	Roll int = 2
)

type InitialRequest struct {
	Username string
}

type ClientRequest struct {
	Action int
}