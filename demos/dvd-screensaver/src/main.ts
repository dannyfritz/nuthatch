import './style.css'
import { Clock, Point, Renderer, TransformStack } from "nuthatch";
import pixiLogo from "../../public/pixi.png";

const rootElement = document.querySelector<HTMLDivElement>('#app')!

const clock = new Clock();
const transformStack = new TransformStack();
const renderer = new Renderer();
await renderer.ready;

const element = renderer.el;
rootElement.replaceChildren();
rootElement.appendChild(element);

clock.start();
const texture = await renderer.load(pixiLogo);
const position = new Point(400, 300);
const velocity = new Point(100, 100);

const update = () => {
  clock.tick(performance.now());
  if (position.x > 800 - 60) { velocity.x = -Math.abs(velocity.x) }
  if (position.y > 600 - 64) { velocity.y = -Math.abs(velocity.y) }
  if (position.x < 0) { velocity.x = Math.abs(velocity.x) }
  if (position.y < 0) { velocity.y = Math.abs(velocity.y) }
  position.x += velocity.x * clock.deltaTimeS;
  position.y += velocity.y * clock.deltaTimeS;
}
setInterval(update, 16);

const render = () => {
  renderer.clear();
  transformStack.clear();
  transformStack.push();
  transformStack.scale(2, 2);
  transformStack.translate(position.x, position.y);
  renderer.drawSprite(texture, transformStack.matrix);
  renderer.render();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
