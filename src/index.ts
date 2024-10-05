import { Application, Container } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Board } from './board';
import { Player } from './player';

(async () => {
    const app = await setup();
    const gameContainer = new Container();
    const board = new Board();
    const player1 = new Player("purple", 0, 0);
    const player2 = new Player("blue", 10, 10);
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 100,
      worldHeight: 100,

      events: app.renderer.events
    });

    gameContainer.position.set(app.screen.width / 2, app.screen.height / 2);

    gameContainer.addChild(board.container);
    board.container.addChild(player1.container);
    board.container.addChild(player2.container);
    app.stage.addChild(viewport);

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

    window.addEventListener("keyup", () => {
      if (!player1.isMoving) {
        player1.nextSpace += 1;
        player2.nextSpace += 1;
      }
    });

    app.ticker.add(() => {
      // On each frame
      player1.move();
      player2.move();
      // console.log(player1.container.x, player1.container.y);

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
