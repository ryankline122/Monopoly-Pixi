import { Container, Graphics } from 'pixi.js';

export class Board {
    private width: number = 904;
    private height: number = 904;
    private boardContainer: Container;

    public constructor() {
        this.boardContainer = this.createBoard();
    }

    public get container() : Container {
        return this.boardContainer; 
    }

    private createBoard() {
        const boardContainer = new Container();
        const board = new Graphics()
          .rect(0, 0, 904, 904)
          .fill({
            color: 0xffffff
          })
        
        const freeParking = this.createCorner(0, 0);
        const goToJail = this.createCorner(board.width, 0);
        const go = this.createCorner(board.width, board.height);
        const jail = this.createCorner(0, board.height);
      
        freeParking.label = "FreeParking"
        goToJail.label = "GoToJail"
        go.label = "Go"
        jail.label = "Jail"
      
        boardContainer.addChild(board);
        boardContainer.addChild(go);
        boardContainer.addChild(jail);
        boardContainer.addChild(freeParking);
        boardContainer.addChild(goToJail);
      
        boardContainer.pivot.set(board.width / 2, board.height / 2);
      
        const shops = this.createShops();
        for (let i = 0; i < shops.length; i++) {
          boardContainer.addChild(shops[i]);
        }
      
        boardContainer.label = "board";
      
        return boardContainer;
    }

    private createShops() {
        const shops: Container[] = []
        let x = 128
        let y = 128
      
        while (x < 776) {
          shops.push(this.createShop(x, 0, true));
          shops.push(this.createShop(x, this.height - 128, true));
          shops.push(this.createShop(0, y, false));
          shops.push(this.createShop(this.width - 128, y, false));

          y += 72;
          x += 72;
        }
      
        return shops;
    }

    private createShop(x: number, y: number, horizontal: boolean) {
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
        shopContainer.label = 'shop';
        shopContainer.addChild(shop);
      
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
            color: 0x0000000
          })
      
        container.addChild(corner)
        
        return container;
      }
}