import { Gamestate } from "./gamestate";

export type ServerResponse  = {
    Initial: boolean;
    Active: boolean;
    PlayerNumber: number;
    Gamestate: Gamestate;
}