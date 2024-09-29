import { Container, Graphics } from "pixi.js";
import { Sides } from "./enums/sides";
import { Shop } from "./shop";
import { Shops } from "./constants/shops";

export class Board {
  private width: number = 904;
  private height: number = 904;
  private boardContainer: Container;
  private shops: Shop[] = Shops;

  public constructor() {
    this.boardContainer = this.createBoard();
  }

  public get container(): Container {
    return this.boardContainer;
  }

  private createBoard() {
    const boardContainer = new Container();
    const board = new Graphics().rect(0, 0, this.width, this.height).fill({
      color: "white",
    });

    boardContainer.addChild(board);
    boardContainer.pivot.set(board.width / 2, board.height / 2);
    boardContainer.label = "board";

    const corners = this.createCorners();
    for (let i = 0; i < corners.length; i++) {
      boardContainer.addChild(corners[i]);
    }

    const shops = this.createShops();
    for (let i = 0; i < shops.length; i++) {
      boardContainer.addChild(shops[i]);
    }

    return boardContainer;
  }

  private createCorners() {
    const freeParking = this.createCorner(0, 0);
    const goToJail = this.createCorner(this.width, 0);
    const go = this.createCorner(this.width, this.height);
    const jail = this.createCorner(0, this.height);

    freeParking.label = "FreeParking";
    goToJail.label = "GoToJail";
    go.label = "Go";
    jail.label = "Jail";

    return [
      freeParking,
      goToJail,
      go,
      jail
    ];
  }

  private createShops() {
    const shops: Container[] = [];

    for (let i = 0; i < this.shops.length; i++) {
      shops.push(this.createShop(this.shops[i]));
    }

    return shops;
  }

  private createShop(shop: Shop) {
    const isHorizontal = shop.side == Sides.Top || shop.side == Sides.Bottom;
    const shopContainer = new Container();
    const shopGraphic = new Graphics()
      .rect(shop.x, shop.y, shop.width, shop.height)
      .fill({
        color: 0xffffff,
      })
      .stroke({
        width: 2,
        color: 0x0000000,
      });
    shopContainer.label = shop.name;
    shopContainer.addChild(shopGraphic);

    let colorX = shop.x;
    let colorY = shop.y;
    const colorWidth = isHorizontal ? 72 : 36;
    const colorHeight = isHorizontal ? 36: 72;

    switch (shop.side) {
      case Sides.Left:
        colorX = 128 - colorWidth;
        break;
      case Sides.Top:
        colorY = 128 - colorHeight;
        break;
    }

    const shopColor = new Graphics()
      .rect(colorX, colorY, colorWidth, colorHeight)
      .stroke({
        width: 2,
        color: "black"
      })
      .fill({
        color: shop.color,
      });

    shopContainer.addChild(shopColor);

    return shopContainer;
  }

  private createCorner(x: number, y: number) {
    const container = new Container();
    const cornerSize = 128;
    const width = x > 0 ? x - cornerSize : x;
    const height = y > 0 ? y - cornerSize : y;
    const corner = new Graphics()
      .rect(width, height, cornerSize, cornerSize)
      .stroke({
        width: 1,
        color: 0x0000000,
      });

    container.addChild(corner);

    return container;
  }
}
