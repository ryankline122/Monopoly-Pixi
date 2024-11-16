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
        this.gameManager = gameManager;
        this.uiContainer = this.createUI();
    }

    public get container(): Container {
        return this.uiContainer;
    }

    private createUI(): Container {
        const container: Container = new Container();

        const rollText: Text = new Text({
            text: "--",
            x: this.screenWidth - 80,
            y: this.screenHeight - 120,
            style: {
                fill: '#ffffff',
                fontSize: 32
            }
        });
        rollText.label = "RollText";

        const currentPlayerText: Text = new Text({
            text: this.getCurrentPlayerText(),
            x: this.screenWidth - 120,
            y: this.screenHeight - 150,
            style: {
                fill: '#ffffff',
                fontSize: 16 
            }
        });
        currentPlayerText.label = "CurrentPlayerText";

        const rollBtn = this.createButton(
            "Roll", 
            this.screenWidth - 120, 
            this.screenHeight - 60,
            () => {
                console.log("Roll button clicked!");
                this.gameManager.roll();
                rollText.text = this.gameManager.getLastRollValue();
            }
        );
    
        container.addChild(rollBtn);
        container.addChild(rollText);
        container.addChild(currentPlayerText);


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
        this.uiContainer.getChildByLabel("RollText").position.set(
            this.screenWidth - 80,
            this.screenHeight - 120,
        );
        this.uiContainer.getChildByLabel("CurrentPlayerText").position.set(
            this.screenWidth - 120,
            this.screenHeight - 150,
        );
    }

    public update() {
        const currentPlayerText = this.uiContainer.getChildByLabel("CurrentPlayerText");
        if (currentPlayerText instanceof Text) {
            currentPlayerText.text = this.getCurrentPlayerText();
        }

        const lastRollText = this.uiContainer.getChildByLabel("RollText");
        if (lastRollText instanceof Text) {
            const value = this.gameManager.getLastRollValue();
            lastRollText.text = value > 0 ? `${value}` : `--`;
        }
    }

    private getCurrentPlayerText() {
        if (this.gameManager.getCurrentPlayer().PlayerNumber === this.gameManager.getThisPlayerNumber()) {
            return `Your turn`;

        } else {
            return `${this.gameManager.getCurrentPlayer().Username}'s turn`;
        }
    }
}
