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
    app.stage.addChild(viewport);

    viewport
      .drag()
      .pinch()
      .wheel()
      // .decelerate()

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

function createBoard(): Container {
  const boardContainer = new Container();
  const board = new Graphics()
    .rect(0, 0, 904, 904)
    .fill({
      color: 0xffffff
    })
  
  const freeParking = createCorner(0, 0);
  const jail = createCorner(board.width, 0);
  const go = createCorner(board.width, board.height);
  const visiting = createCorner(0, board.height);

  boardContainer.pivot.set(board.width / 2, board.height / 2);

  boardContainer.addChild(board);
  boardContainer.addChild(go);
  boardContainer.addChild(visiting);
  boardContainer.addChild(freeParking);
  boardContainer.addChild(jail);

  const shops = createShops(board.width, board.height);
  for (let i = 0; i < shops.length; i++) {
    boardContainer.addChild(shops[i]);
  }

  return boardContainer;
}

function createCorner(x: number, y: number) {
  const container = new Container();
  const cornerSize = 128;
  const width = x > 0 ? x - cornerSize : x;
  const height = y > 0 ? y - cornerSize : y;
  const corner = new Graphics()
    .rect(width, height, cornerSize, cornerSize)
    .stroke({
      width: 1,
      color: 0x0000000
    })

  container.addChild(corner)
  
  return container;
}

function createShops(boardWidth: number, boardHeight: number): Container[] {
  const shops: Container[] = []
  let x = 128
  let y = 128

  // Top and Bottom
  while (x < 776) {
    shops.push(createShop(x, 0, true));
    shops.push(createShop(x, boardHeight - 128, true));
    x += 72;
  }

  // Left and Right 
  while (y < 776) {
    shops.push(createShop(0, y, false));
    shops.push(createShop(boardWidth - 128, y, false));
    y += 72;
  }


  return shops;
}

function createShop(x: number, y: number, horizontal: boolean) {
  const width = horizontal ? 72 : 128;
  const height = horizontal ? 128: 72;
  const shopContainer = new Container();
  const shop = new Graphics()
    .rect(x, y, width, height)
    .fill({
      color: 0xffffff
    })
    .stroke({
      width: 2,
      color: 0x0000000
    })
  shopContainer.addChild(shop);

  return shopContainer;
}