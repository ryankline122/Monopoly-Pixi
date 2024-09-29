import { Application, BitmapText } from 'pixi.js';

(async () => {
    const app = await setup();
    const helloWorld = addText("Hello world!", 32, 50, 50);
    helloWorld.position.set(90, 80);
    app.stage.addChild(helloWorld);
  
    const speed = 5; // Pixels per frame
    let moveX = 0;
    let moveY = 0;
  
    window.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'ArrowRight':
          moveX = speed;
          break;
        case 'ArrowLeft':
          moveX = -speed;
          break;
        case 'ArrowUp':
          moveY = -speed;
          break;
        case 'ArrowDown':
          moveY = speed;
          break;
      }
    });
  
    window.addEventListener('keyup', function(e) {
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowLeft':
          moveX = 0;
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          moveY = 0;
          break;
      }
    });
  
    app.ticker.add(() => {
      helloWorld.x += moveX;
      helloWorld.y += moveY;
    });
  })();

function addText(text: string, size: number, x: number, y: number) {
    const _text = new BitmapText({
        text: text,
        style: {
            fontSize: size,
            align: "left"
        },
    });

    _text.x = x
    _text.y = y

    return _text;
}

async function setup () {
    const app = new Application();
    
    globalThis.__PIXI_APP__ = app

    await app.init({
        resizeTo: window
    });

    app.canvas.style.position = 'absolute';

    document.body.appendChild(app.canvas);

    return app;
}
