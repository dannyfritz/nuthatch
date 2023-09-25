import { Rendix } from "./Rendix";

const pixiLogo = await Rendix.loadAsset("./pixi.png");
const rendix = new Rendix();
document.body.appendChild(rendix.el);
rendix.drawRect(10, 10, 100, 100);
rendix.fillStyle = new Rendix.Color({ r: 255, g: 0, b: 0 });
rendix.push()
rendix.translate(-150, 0)
rendix.scale(2, 1);
rendix.drawRect(200, 200, 50, 100);
rendix.drawSprite(pixiLogo, 150, 150);
rendix.pop();
rendix.render();