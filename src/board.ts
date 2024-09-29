import { ColorSource, Container, Graphics } from 'pixi.js';
import { Sides } from './enums/sides';
import { Shop } from './shop';
import { Shops } from './constants/shops';

export class Board {
    private width: number = 904;
    private height: number = 904;
    private boardContainer: Container;
    private shops: Shop[] = Shops;

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
          });
        
        const freeParking = this.createCorner(0, 0);
        const goToJail = this.createCorner(board.width, 0);
        const go = this.createCorner(board.width, board.height);
        const jail = this.createCorner(0, board.height);
      
        freeParking.label = "FreeParking";
        goToJail.label = "GoToJail";
        go.label = "Go";
        jail.label = "Jail";
      
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
        const shops: Container[] = [];
        let x = 128;
        let y = 128;
        let i = 0;

        for (let i = 0; i < this.shops.length; i++) {
          const current: Shop = 
          shops.push(this.createShop(x, 0, Sides.Top, i));
        }
      
        // while (x < 776) {
        //   shops.push(this.createShop(x, 0, Sides.Top, i));
        //   shops.push(this.createShop(x, this.height - 128, Sides.Bottom, i));
        //   shops.push(this.createShop(0, y, Sides.Left, i));
        //   shops.push(this.createShop(this.width - 128, y, Sides.Right, i));

        //   y += 72;
        //   x += 72;
        //   i++;
        // }

        console.log(JSON.stringify(this.shops));
        
        return shops;
    }

    private createShop(
        x: number, 
        y: number, 
        side: Sides,
        id: number,
        name: string = "shop",
        color: ColorSource = "blue" 
    ) {
        const isHorizontal = (side === Sides.Top || side === Sides.Bottom);
        const shopWidth = isHorizontal ? 72 : 128;
        const shopHeight = isHorizontal ? 128: 72;
        const shopContainer = new Container();
        const shop = new Graphics()
          .rect(x, y, shopWidth, shopHeight)
          .fill({
            color: 0xffffff
          })
          .stroke({
            width: 2,
            color: 0x0000000
          });
        shopContainer.label = name;
        shopContainer.addChild(shop);

        const colorWidth = isHorizontal ? 72 : 36;
        const colorHeight = isHorizontal ? 36: 72;
        let colorX = x;
        let colorY = y;

        switch(side) {
          case Sides.Left: 
            colorX = 128 - colorWidth;
            break;
          case Sides.Top:
            colorY = 128 - colorHeight;
            break;
        }

        const shopColor = new Graphics()
          .rect(colorX, colorY, colorWidth, colorHeight)
          .fill({
            color: color 
          });

        shopContainer.addChild(shopColor);

        // const shopObj: Shop = {
        //   id: id,
        //   name: 'shop',
        //   color: color,
        //   x: x,
        //   y: y,
        //   height: shopHeight,
        //   width: shopWidth,
        //   initialRent: 0,
        //   rentWithOneHouse: 0,
        //   rentWithTwoHouses: 0,
        //   rentWithThreeHouses: 0,
        //   rentWithFourHouses: 0,
        //   rentWithHotel: 0,
        //   purchaseCost: 0,
        //   houseCost: 0,
        //   hotelCost: 0,
        //   mortgageValue: 0,
        // };

        // this.shops.push(shopObj);
      
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
          });
      
        container.addChild(corner);
        
        return container;
      }
}