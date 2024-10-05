import { Container, Graphics } from "pixi.js";
import { cornerHeightWidth, ShopHeightLeftRight, ShopWidthLeftRight, ShopWidthTopBottom, Spaces } from "./constants/spaces";
import { Space } from "./models/space";

export class Player {
    private width: number = 16;
    private height: number = 16;
    private playerContainer: Container;
    public currentSpace: number;
    public nextSpace: number;
    public moveX: number;
    public moveY: number;
    public isMoving: boolean;

    public constructor() {
        this.currentSpace = 0;
        this.nextSpace = 0;
        this.moveX = 5;
        this.moveY = 5;
        this.playerContainer = this.createPlayer();
    };

    public get container(): Container {
        return this.playerContainer;
    }

    public moveOne() {
        /*
            moves over one space
            
            Bottom --> -x
            Left --> -y
            Top --> +x
            Right --> +y
        */
        // console.log(this.currentSpace, this.nextSpace);

        if (this.currentSpace < this.nextSpace) {
            let target = 0;
            
            if (this.nextSpace === 40) {
                this.currentSpace = -1;
                this.nextSpace = 0;
            }

            if (this.nextSpace > 0 && this.nextSpace < 11 ) {
                // Bottom
                target = Spaces.at(this.nextSpace).playerX;
                
                if (this.playerContainer.x > target) {
                    this.playerContainer.x -= this.moveX;
                } else {
                    this.currentSpace++;
                }
            } else if (this.nextSpace > 20 && this.nextSpace < 31) {
                // Top
                target = Spaces.at(this.nextSpace).playerX;
                
                console.log("Top:", this.playerContainer.x, -target);

                if (this.playerContainer.x < target) {
                    this.playerContainer.x += this.moveX;
                } else {
                    this.currentSpace++;
                }
            } else if (this.nextSpace > 10 && this.nextSpace < 21) {
                // Left
                target = Spaces.at(this.nextSpace).playerY;
                
                if (this.playerContainer.y > target) {
                    this.playerContainer.y -= this.moveY;
                } else {
                    this.currentSpace++;
                }
            } else {
                // Right
                target = Spaces.at(this.nextSpace).playerY;
                console.log(this.playerContainer.y,target);
                
                if (this.playerContainer.y < target) {
                    this.playerContainer.y += this.moveY;
                } else {
                    this.currentSpace++;
                }
            }
       }
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