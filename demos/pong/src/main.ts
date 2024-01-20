import { Keyboard, Renderer, TransformStack, V2 } from "nuthatch";

class Ball {
  position: V2;
  velocity: V2;
  radius: number;
  constructor() {
    this.position = new V2(400, 300);
    this.velocity = new V2(1, 0);
    this.radius = 10;
  }
}

class Paddle {
  position: V2;
  size: V2;
  constructor(x: number, y: number) {
    this.position = new V2(x, y);
    this.size = new V2(50, 200);
  }
}

const balls: Array<Ball> = [new Ball()];
const paddle1: Paddle = new Paddle(0, 0);
const paddle2: Paddle = new Paddle(750, 0);

const actions = {
  player1Up: false,
  player1Down: false,
  player2Up: false,
  player2Down: false,
}

const keyboard = new Keyboard();
keyboard.enable();

const renderer = new Renderer();
document.body.append(renderer.el);

const transformStack = new TransformStack();

const renderBall = (ball: Ball): void => {
  transformStack.push();
  transformStack.translate(ball.position.x, ball.position.y);
  renderer.drawRectangle(ball.radius, ball.radius, transformStack.matrix);
  transformStack.pop();
}

const renderPaddle = (paddle: Paddle): void => {
  transformStack.push();
  transformStack.translate(paddle.position.x, paddle.position.y);
  renderer.drawRectangle(paddle.size.x, paddle.size.y, transformStack.matrix);
  transformStack.pop();
}

const update = () => {
  while (keyboard.keyQueue.length > 0) {
    const [input, isDown] = keyboard.keyQueue.pop()!;
    if (input === "KeyW") {
      actions.player1Up = isDown;
    } else if (input === "KeyS") {
      actions.player1Down = isDown;
    }
    if (input === "KeyI") {
      actions.player2Up = isDown;
    } else if (input === "KeyK") {
      actions.player2Down = isDown;
    }
  }
  if (actions.player1Up) {
    paddle1.position.y -= 10;
  }
  if (actions.player1Down) {
    paddle1.position.y += 10;
  }
  if (actions.player2Up) {
    paddle2.position.y -= 10;
  }
  if (actions.player2Down) {
    paddle2.position.y += 10;
  }
}

const render = () => {
  update();
  renderer.clear();
  transformStack.clear();
  balls.forEach(ball => renderBall(ball));
  renderPaddle(paddle1);
  renderPaddle(paddle2);
  renderer.render();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

