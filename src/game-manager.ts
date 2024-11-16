import { Actions } from "./constants/actions";
import { ClientRequest } from "./dto/client-request";
import { PlayerInfo } from "./dto/player-info";
import { Player } from "./ui/player";

export class GameManager {
    private players: Set<Player>;
    private playerNum: number = 1;
    private websocket: WebSocket;
    private currentPlayer: PlayerInfo = {
        PlayerNumber: -1,
        Username: "",
        Color: "",
        IsReady: false,
        X: 0,
        Y: 0,
        NextSpace: 0
    };
    private lastRoll: number = 0;

    public constructor(websocket: WebSocket, players: Set<Player>){
        this.players = players;
        this.websocket = websocket;
    }

    public roll() {
        const req: ClientRequest = {
            Action: Actions.Roll
        };
        this.websocket.send(JSON.stringify(req));
    }

    public getCurrentPlayer(): PlayerInfo {
        return this.currentPlayer;
    }

    public setCurrentPlayer(player: PlayerInfo) {
        this.currentPlayer = player;
    }

    public getThisPlayerNumber(): number {
        return this.playerNum;
    }

    public setThisPlayerNumber(playerNumber: number) {
        this.playerNum = playerNumber;
    }

    public setLastRoll(value: number) {
        this.lastRoll = value;
    }

    public getLastRollValue(): number {
        return this.lastRoll;
    }

}
