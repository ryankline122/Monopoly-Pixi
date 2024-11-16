import { Application, Container } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Board } from './ui/board';
import { Player } from './ui/player';
import { UI } from './ui/ui';
import { GameManager } from './game-manager';
import { ServerResponse } from './dto/server-response';
import { PregameLobby } from './pregamelobby';

// Entry point
(async () => {
    await homepageHandler();
})();

async function homepageHandler() {
    const lobby = document.getElementById("lobby");
    const home = document.getElementById("home");
    const form = document.getElementById("connectForm") as HTMLFormElement;
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    lobby.hidden = true;

    form.addEventListener("submit", async (e) => {
        // TODO:
        const username = usernameInput.value;
        const isJoinable: boolean = true; // Replace this with api call - Checks username and server status

        if (username.length >= 3 && isJoinable) {
            e.preventDefault();
            home.classList.remove('d-flex');
            home.classList.add('d-none');
            lobby.hidden = false;

            await pregameLobbyHandler(username);
        } else {
            console.log("unable to join game");
        }
    });
}

async function pregameLobbyHandler(username: string) {
    const players: Set<Player> = new Set<Player>();
    const ws = new WebSocket('ws://localhost:8080');
    const pregameLobby: PregameLobby = new PregameLobby(ws, players, username);

    await pregameLobby.setupEventListeners();
};

export async function startGame(ws: WebSocket, players: Set<Player>) {
    const app = await setup();
    const gameManager: GameManager = new GameManager(ws, players);
    const ui = new UI(app.screen.width, app.screen.height, gameManager);
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 100,
        worldHeight: 100,
        events: app.renderer.events
    });
    const gameContainer = new Container();
    const board = new Board();

    players.forEach((p) => {
        board.container.addChild(p.container);
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

    ws.onmessage = (event) => {
        const response: ServerResponse = JSON.parse(event.data);
        console.log("Server response", response);

        gameManager.setLastRoll(response.Gamestate.LastRoll);
        gameManager.setCurrentPlayer(response.Gamestate.CurrentPlayer);
        gameManager.setThisPlayerNumber(response.PlayerNumber);
        console.log(gameManager.getThisPlayerNumber());
        response.Gamestate.Players.forEach((p) => {
            players.forEach((p2) => {
                if (p.PlayerNumber === p2.getPlayerNumber()) {
                    p2.nextSpace = p.NextSpace;
                }
            });
        });
    };

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
}

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