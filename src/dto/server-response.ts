import { Gamestate } from "./gamestate";

export type ServerResponse  = {
    Initial: boolean;
    PlayerNumber: number;
    Gamestate: Gamestate;
}