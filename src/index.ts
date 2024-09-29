import { Application, Container, Graphics } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

(async () => {
    const app = await setup();
    const gameContainer = new Container();
    const board = createBoard();
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,

      events: app.renderer.events
    })

    gameContainer.position.set(app.screen.width / 2, app.screen.height / 2);

    gameContainer.addChild(board);
    // app.stage.addChild(gameContainer);
    app.stage.addChild(viewport);

    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()

    viewport.addChild(gameContainer)

    app.ticker.add(() => {
      // On each frame
    });
})();

async function setup(): Promise<Application> {
    const app = new Application();
    
    globalThis.__PIXI_APP__ = app

    await app.init({
        resizeTo: window
    });

    app.canvas.style.position = 'absolute';

    document.body.appendChild(app.canvas);

    return app;
}

function createBoard(): Graphics {
    const board = new Graphics()
      .rect(0, 0, 64, 64)
      .fill({
        color: 0xffffff
      })
    
    board.pivot.set(board.width / 2, board.height / 2);

    return board;
}
