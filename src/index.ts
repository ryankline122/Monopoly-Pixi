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
      worldWidth: 100,
      worldHeight: 100,

      events: app.renderer.events
    });

    gameContainer.position.set(app.screen.width / 2, app.screen.height / 2);

    gameContainer.addChild(board.container);
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

    app.ticker.add(() => {
      // On each frame
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
