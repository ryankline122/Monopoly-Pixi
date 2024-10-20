import { Application, Container } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Board } from './ui/board';
import { Player } from './ui/player';
import { UI } from './ui/ui';
import { GameManager } from './game-manager';
import { ServerResponse } from './dto/server-response';
import { PlayerInfo } from './dto/player-info';

(async () => {
    const app = await setup();
    const gameContainer = new Container();
    const players: Set<Player> = new Set<Player>();
    // const player1 = new Player("purple", 0, 0);
    // const player2 = new Player("blue", 10, 10);
    // const player3 = new Player("red", -10, 5);
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
        console.log('Connected to server');
        ws.send('Hello from game client');
    };

    ws.onmessage = (event) => {
        const response: ServerResponse = JSON.parse(event.data);
        if (response.Initial) {
            console.log("Initial response", response);
            const playerInfo: PlayerInfo = response.Gamestate.Players[response.PlayerNumber - 1];
            const player: Player = new Player(
                playerInfo.PlayerNumber,
                playerInfo.Color, 
                playerInfo.X,
                playerInfo.Y,
            );
            players.add(player);
            board.container.addChild(player.container);
        } else {
            console.log("Server response", response);

            const connectedPlayers = response.Gamestate.Players.length;
            const currentPlayerNumbers = new Set<number>();
            players.forEach((p) => { currentPlayerNumbers.add(p.getPlayerNumber());});

            if (connectedPlayers !== players.size) {
                if (connectedPlayers > players.size) {
                    // Add new player(s) to the board
                    const newPlayers: PlayerInfo[] = response.Gamestate.Players.filter((p) => {
                        return !currentPlayerNumbers.has(p.PlayerNumber);
                    });

                    newPlayers.forEach((p) => {
                        const player: Player = new Player(
                            p.PlayerNumber,
                            p.Color, 
                            p.X,
                            p.Y,
                        );
                        players.add(player);
                        board.container.addChild(player.container);
                    });

                } else if (connectedPlayers < players.size) {
                    // Remove disconnected players from the board

                }
            } else {
                gameManager.setLastRoll(response.Gamestate.LastRoll);
                response.Gamestate.Players.forEach((p) => {
                    players.forEach((p2) => {
                        if (p.PlayerNumber === p2.getPlayerNumber()) {
                            p2.nextSpace = p.NextSpace;
                        }
                    });
                });
            }
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
    };
    const gameManager: GameManager = new GameManager(ws, players);
    const ui = new UI(app.screen.width, app.screen.height, gameManager);
    const board = new Board();

    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 100,
        worldHeight: 100,
        events: app.renderer.events
    });


    gameContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    gameContainer.addChild(board.container);

    app.stage.addChild(viewport);
    app.stage.addChild(ui.container);

    viewport
        .drag()
        .pinch()
        .wheel()
        .clampZoom({
            minWidth: 1000,
            minHeight: 300,
            maxWidth: 3000,
            maxHeight: 3000
        });

    viewport.addChild(gameContainer);

    app.ticker.add(() => {
        // On each frame
        ui.update();

        players.forEach((p) => { p.move(); });
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        ui.resize(app.screen.width, app.screen.height);
    });
})();

async function setup(): Promise<Application> {
    const app = new Application();
    globalThis.__PIXI_APP__ = app;
    await app.init({
        resizeTo: window
    });
    app.canvas.style.position = 'absolute';
    document.body.appendChild(app.canvas);

    return app;
}
