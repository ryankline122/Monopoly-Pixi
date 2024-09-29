import { Application, Container } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Board } from './board';

(async () => {
    const app = await setup();
    const gameContainer = new Container();
    const board = new Board();
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,

      events: app.renderer.events
    })

    gameContainer.position.set(app.screen.width / 2, app.screen.height / 2);

    gameContainer.addChild(board.container);
    app.stage.addChild(viewport);

    viewport
      .drag()
      .pinch()
      .wheel()

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
