import { PlayerInfo } from "./player-info";

export type Gamestate = {
    CurrentPlayer: number;
    LastRoll: number;
    Players: PlayerInfo[];
}