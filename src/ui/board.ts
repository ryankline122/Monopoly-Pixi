import { Container, Graphics } from "pixi.js";
import { Sides } from "../enums/sides";
import { Space } from "../models/space";
import { Spaces } from "../constants/spaces";

export class Board {
  private width: number = 904;
  private height: number = 904;
  private boardContainer: Container;
  private spaces: Space[] = Spaces;

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

    this.createSpaces().forEach((c) => {
      boardContainer.addChild(c);
    });

    return boardContainer;
  }

  private createSpaces(): Container[] {
    const corners = [0, 10, 20, 30];
    const spaceContainers: Container[] = [];

    this.spaces.forEach((s) => {
      if (!corners.includes(s.index)) {
        // Shops
        const container = new Container();
        const shopGraphic = new Graphics()
          .rect(s.x, s.y, s.width, s.height)
          .fill({
            color: 0xffffff,
          })
          .stroke({
            width: 2,
            color: 0x0000000,
          });
        container.label = s.name;
        container.addChild(shopGraphic);
        container.addChild(this.addShopColor(s));
        spaceContainers.push(container);
      } else {
        // Corners 
        const container = new Container();
        const corner = new Graphics()
          .rect(s.x, s.y, s.width, s.width)
          .stroke({
            width: 1,
            color: 0x0000000,
          });

        container.label = s.name;
        container.addChild(corner);
        spaceContainers.push(container);
      }
    });

    return spaceContainers;
  }

  private addShopColor(shop: Space): Graphics {
    let colorX = shop.x;
    let colorY = shop.y;
    const isHorizontal = shop.side == Sides.Top || shop.side == Sides.Bottom;
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

    return new Graphics()
      .rect(colorX, colorY, colorWidth, colorHeight)
      .stroke({
        width: 2,
        color: "black"
      })
      .fill({
        color: shop.color,
      });
  }
}