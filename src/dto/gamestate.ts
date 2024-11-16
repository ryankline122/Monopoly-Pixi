import { PlayerInfo } from "./player-info";

export type Gamestate = {
    CurrentPlayer: PlayerInfo;
    LastRoll: number;
    Players: PlayerInfo[];
}