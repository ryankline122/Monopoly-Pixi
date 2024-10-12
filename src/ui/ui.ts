import { Container, Graphics, Text } from "pixi.js";
import { GameManager } from "../game-manager";

export class UI {
    private uiContainer: Container;
    private gameManager: GameManager;
    private screenWidth: number;
    private screenHeight: number;

    constructor(width: number, height: number, gameManager: GameManager) {
        this.screenWidth = width;
        this.screenHeight = height;
        this.uiContainer = this.createUI();
        this.gameManager = gameManager;
    }

    public get container(): Container {
        return this.uiContainer;
    }

    private createUI(): Container {
        const container: Container = new Container();
        const rollBtn = this.createButton(
            "Roll", 
            this.screenWidth - 120, 
            this.screenHeight - 60,
            () => {
                console.log("Roll button clicked!");
                this.gameManager.roll();
            }
        );
    
        container.addChild(rollBtn);

        return container;
    }

    private createButton(label: string, x: number, y: number, onClick: () => void): Container {
        const button = new Container();
        const background = new Graphics()
            .roundRect(0, 0, 100, 40, 5)
            .fill(0x4CAF50);
    
        const text = new Text({
            text: label,
            style: {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xFFFFFF
            }
        });
        text.anchor.set(0.5);
        text.position.set(50, 20);
    
        button.addChild(background);
        button.addChild(text);
        button.position.set(x, y);
        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.label = label;
    
        button.on('pointerdown', onClick);
    
        return button;
    }

    public resize(width: number, height: number): void {
        this.screenWidth = width;
        this.screenHeight = height;

        this.uiContainer.getChildByLabel("Roll").position.set(
            this.screenWidth - 120,
            this.screenHeight - 60,
        );
    }
}