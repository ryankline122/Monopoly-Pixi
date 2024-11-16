import { ColorSource } from "pixi.js";
import { Sides } from "../enums/sides";

export type Space = {
    index: number,
    side: Sides | null,
    name: string,
    color: ColorSource | null,
    x: number,
    y: number,
    height: number,
    width: number,
    playerX?: number
    playerY?: number
}
