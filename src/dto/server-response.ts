import { PlayerInfo } from "./player-info";

export type ServerResponse  = {
    Initial: boolean;
    PlayerNumber: number;
    PlayerInfo: PlayerInfo[];
}