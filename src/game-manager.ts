import { Player } from "./ui/player";

export class GameManager {
    private players: Player[];
    private currentPlayer = 0;

    public constructor(players: Player[]) {
        this.players = players;
    }

    public roll() {
        const value: number = Math.floor(Math.random() * (13 - 2) + 2);

        console.log(`rolled a ${value}`);

        this.players[this.currentPlayer].nextSpace += value;
    }

}