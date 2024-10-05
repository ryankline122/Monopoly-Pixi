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

    public move() {
        /**
         * moves to nextSpace.
         * Bottom --> -x
         * Left --> -y
         * Top --> +x
         * Right --> +y
         */
        console.log(this.nextSpace);
        if (this.nextSpace > 39) {
            this.nextSpace -= 40;
        }

        if (this.currentSpace !== this.nextSpace) {
          this.isMoving = true;
          let target = 0;
          
          // Check if we need to wrap around the board
          if (this.currentSpace >= 40) {
            this.currentSpace = 0;
          }
    
          // Determine movement based on current position
          if (this.currentSpace >= 0 && this.currentSpace < 11) {
            // Bottom
            target = Spaces.at(this.currentSpace + 1).playerX;
            if (this.playerContainer.x > target) {
              this.playerContainer.x -= this.moveX;
            } else {
              this.currentSpace++;
              this.isMoving = false;
            }
          } else if (this.currentSpace >= 20 && this.currentSpace < 31) {
            // Top
            target = Spaces.at(this.currentSpace + 1).playerX;
            if (this.playerContainer.x < target) {
              this.playerContainer.x += this.moveX;
            } else {
              this.currentSpace++;
              this.isMoving = false;
            }
          } else if (this.currentSpace >= 10 && this.currentSpace < 21) {
            // Left
            target = Spaces.at(this.currentSpace + 1).playerY;
            if (this.playerContainer.y > target) {
              this.playerContainer.y -= this.moveY;
            } else {
              this.currentSpace++;
              this.isMoving = false;
            }
          } else {
            // Right
            if (this.currentSpace + 1 !== 40) {
                target = Spaces.at(this.currentSpace + 1).playerY;
            } else {
                target = Spaces.at(0).playerY;
            }

            if (this.playerContainer.y < target) {
              this.playerContainer.y += this.moveY;
            } else {
              this.currentSpace++;
              this.isMoving = false;
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