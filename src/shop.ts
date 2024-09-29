import { ColorSource } from "pixi.js";
import { Sides } from "./enums/sides";

export type Shop = {
    id: number,
    name: string,
    color: ColorSource,
    x: number,
    y: number,
    height: number,
    width: number,
    side: Sides,
    initialRent: number
    rentWithOneHouse: number
    rentWithTwoHouses: number
    rentWithThreeHouses: number
    rentWithFourHouses: number
    rentWithHotel: number
    purchaseCost: number,
    houseCost: number,
    hotelCost: number,
    mortgageValue: number,
}