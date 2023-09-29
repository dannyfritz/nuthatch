import { Rendix } from "./Rendix";

const pixiLogo = await Rendix.loadAsset("./pixi.png");
new Rendix.BitmapFont("arial", "#ff0000");
const rendix = new Rendix();
document.body.appendChild(rendix.el);
let counter = 1_000;

const render = async () => {
  const now = performance.now();
  const sin = Math.sin(now / 500);
  rendix.clear();
  rendix.fillStyle = new Rendix.Color({ h: 100, s: 50, l: 50 });
  rendix.drawRect(10, 10, 100, 100);
  rendix.fillStyle = new Rendix.Color({ r: 255, g: 0, b: 0 });
  rendix.transform.push();
  rendix.transform.translate(-150, 0);
  rendix.transform.scale(2, 1);
  for (let i = 0; i <= 1_000; i++) {
    rendix.drawRect(200 + i, 200 + i, 50, 100 + sin * 20);
  }
  for (let i = 0; i <= 1_000; i++) {
    rendix.drawSprite(pixiLogo, 150 + i, 150 + sin * 10);
  }
  rendix.transform.pop();
  rendix.drawText("Hello Rendix!", "arial");
  rendix.render();
  counter--;
  if (counter <= 0) {
    console.log("STOPPING!");
    return;
  }
  requestAnimationFrame(render);
};

requestAnimationFrame(render);
