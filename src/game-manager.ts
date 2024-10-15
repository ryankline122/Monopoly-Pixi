import { Player } from "./ui/player";

export class GameManager {
    private players: Player[];
    private currentPlayer = 1;

    public constructor(players: Player[]) {
        this.players = players;
    }

    public roll() {
        const value: number = Math.floor(Math.random() * (13 - 2) + 2);

        this.players[this.currentPlayer -1].nextSpace += value;

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        return value;
    }

    public getCurrentPlayer(): number {
        return this.currentPlayer;
    }

}