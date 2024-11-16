import { ColorSource, Container, Graphics } from "pixi.js";
import { Spaces } from "../constants/spaces";
import { BASE_PLAYER_START_X, BASE_PLAYER_START_Y } from "../constants/player-positions";

export class Player {
    private width: number = 16;
    private height: number = 16;
    private playerContainer: Container;
    private offsetX: number;
    private offsetY: number;
    private color: ColorSource;
    private number: number;
    private username: string;
    
    public currentSpace: number;
    public nextSpace: number;
    public moveX: number;
    public moveY: number;
    public isMoving: boolean;
    public isReady: boolean;

    public constructor(
      number: number, 
      username: string,
      color: ColorSource, 
      offsetX: number, 
      offsetY: number
    ) {
        this.number = number;
        this.username = username;
        this.color = color;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.currentSpace = 0;
        this.nextSpace = 0;
        this.moveX = 5;
        this.moveY = 5;
        this.playerContainer = this.createPlayer();
    };

    public get container(): Container {
      return this.playerContainer;
    }

    public getPlayerNumber(): number {
      return this.number;
    }

    public getUsername(): string {
      return this.username;
    }

    public getColor (): ColorSource {
      return this.color;
    }

    public getX(): number {
      return this.playerContainer.x;
    }

    public getY(): number {
      return this.playerContainer.y;
    }

    public move() {
        /**
         * moves to nextSpace.
         * Bottom --> -x
         * Left --> -y
         * Top --> +x
         * Right --> +y
         */
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
    
          if (this.currentSpace >= 0 && this.currentSpace + 1 < 11) {
            // Bottom
            target = Spaces.at(this.currentSpace + 1).playerX - this.offsetX;
            if (this.playerContainer.x > target) {
              this.playerContainer.x -= this.moveX;
            } else {
              this.currentSpace++;
              this.isMoving = false;
            }
          } else if (this.currentSpace >= 20 && this.currentSpace + 1 < 31) {
            // Top
            target = Spaces.at(this.currentSpace + 1).playerX - this.offsetX;
            if (this.playerContainer.x < target) {
              this.playerContainer.x += this.moveX;
            } else {
              this.currentSpace++;
              this.isMoving = false;
            }
          } else if (this.currentSpace >= 10 && this.currentSpace + 1 < 21) {
            // Left
            target = Spaces.at(this.currentSpace + 1).playerY + this.offsetY; 
            if (this.playerContainer.y > target) {
              this.playerContainer.y -= this.moveY;
            } else {
              this.currentSpace++;
              this.isMoving = false;
            }
          } else {
            // Right
            if (this.currentSpace + 1 !== 40) {
                target = Spaces.at(this.currentSpace + 1).playerY + this.offsetY;
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
        this.isMoving = false;
      }

    private createPlayer() {
        const playerContainer: Container = new Container();
        const player = new Graphics()
            .rect(
                BASE_PLAYER_START_X + this.offsetX,
                BASE_PLAYER_START_Y + this.offsetY,
                this.width, 
                this.height
            )
            .fill({
                color: this.color,
            });
        
        playerContainer.addChild(player);
        playerContainer.pivot.set(player.width / 2, player.height / 2);
        playerContainer.label = "player";

        return playerContainer;
    }
}