import { Player } from "./ui/player";

export class GameManager {
    private players: Player[];
    private currentPlayer = 0;

    public constructor(players: Player[]) {
        this.players = players;
    }

    public roll() {
        const value: number = Math.floor(Math.random() * (13 - 2) + 2);

        this.players[this.currentPlayer].nextSpace += value;

        if (this.currentPlayer + 1 === this.players.length) {
            this.currentPlayer = 0;
        } else {
            this.currentPlayer++;
        }

        return value;
    }

    public getCurrentPlayer(): number {
        return this.currentPlayer + 1;
    }

}
