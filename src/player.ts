import { Container, Graphics } from "pixi.js";
import { Spaces } from "./constants/spaces";
import { Space } from "./models/space";

export class Player {
    private width: number = 16;
    private height: number = 16;
    private playerContainer: Container;
    public currentSpace: number;
    public nextSpace: number;
    public moveX: number;
    public moveY: number;

    public constructor() {
        this.currentSpace = 0;
        this.nextSpace = 0;
        this.moveX = 5;
        this.moveY = 0;
        this.playerContainer = this.createPlayer();
    };

    public get container(): Container {
        return this.playerContainer;
    }

    public move() {
        // Bottom --> -x
        // Left --> -y
        // Top --> +x
        // Right --> +y

        // console.log("here");
        // console.log(this.currentSpace);
        console.log(this.currentSpace, this.nextSpace);

        let target = Spaces[1].width * this.nextSpace;
        if (this.nextSpace === 10) {
            target = Spaces[1].width * this.nextSpace++;
        }

        if (Math.abs(this.playerContainer.x) < target) {
            this.playerContainer.x -= this.moveX;
        }
        else {
            this.currentSpace = this.nextSpace;
        }
        // } else if (this.playerContainer.y < space.y / 2){
        //     this.playerContainer.y += this.moveY;
        // } else if (this.playerContainer.y > y){
        //     this.playerContainer.y -= this.moveY;
        // } else if (this.playerContainer.x < x){
        //     this.playerContainer.x += this.moveX;
    }

    private createPlayer() {
        const playerContainer: Container = new Container();
        const player = new Graphics()
            .rect(
                Spaces[this.currentSpace].x + (Spaces[this.currentSpace].width / 2) - (this.width / 2),
                Spaces[this.currentSpace].y + (Spaces[this.currentSpace].height / 2) - (this.height / 2), 
                this.width, 
                this.height
            )
            .fill({
                color: "purple",
            });
        
        playerContainer.addChild(player);
        playerContainer.pivot.set(player.width / 2, player.height / 2);
        playerContainer.label = "player";

        return playerContainer;
    }
    

}