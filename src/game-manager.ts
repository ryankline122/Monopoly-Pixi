import { Actions } from "./constants/actions";
import { ClientRequest } from "./dto/client-request";
import { Player } from "./ui/player";

export class GameManager {
    private players: Set<Player>;
    private websocket: WebSocket;
    private currentPlayer = 0;
    private lastRoll: number = 0;

    public constructor(websocket: WebSocket, players: Set<Player>){
        this.players = players;
        this.websocket = websocket;
    }

    public roll() {
        const req: ClientRequest = {
            action: Actions.Roll,
        };
        this.websocket.send(JSON.stringify(req));
    }

    public getCurrentPlayer(): number {
        return this.currentPlayer + 1;
    }

    public setLastRoll(value: number) {
        this.lastRoll = value;
    }

    public getLastRollValue(): number {
        return this.lastRoll;
    }

}
