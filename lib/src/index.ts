import { Assets, Container, Matrix, Texture, Renderer as PixiRenderer, Sprite, Graphics } from "pixi.js";

export class Keyboard {
  target: HTMLElement;
  #handlerDown: undefined | ((event: KeyboardEvent) => void) = undefined;
  #handlerUp: undefined | ((event: KeyboardEvent) => void) = undefined;
  keyQueue: Array<[KeyboardEvent["code"], isDown: boolean]> = [];
  constructor(target: HTMLElement = document.body) {
    this.target = target;
  }
  disabled(): void {
    if (!this.#handlerDown) return;
    this.target.removeEventListener("keydown", this.#handlerDown);
    this.target.removeEventListener("keyup", this.#handlerUp!);
    this.#handlerDown = undefined;
    this.#handlerUp = undefined;
  }
  enable(): void {
    if (this.#handlerDown) {
      console.warn("Handlers already initialized!");
      return;
    }
    this.#handlerDown = (event) => {
      this.keyQueue.push([event.code, true]);
      return;
    }
    this.#handlerUp = (event) => {
      this.keyQueue.push([event.code, false]);
      return;
    }
    this.target.addEventListener("keydown", this.#handlerDown);
    this.target.addEventListener("keyup", this.#handlerUp);
  }
}

export class V2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class TransformStack {
  constructor() {
    this.#transforms = [Matrix.IDENTITY.clone()];
  }
  clear(): void {
    this.#transforms = [Matrix.IDENTITY.clone()];
  }
  pop(): void {
    this.#transforms.pop();
  }
  push(): void {
    this.#transforms.push(this.matrix.clone());
  }
  rotate(_rad: number): void {
    this.matrix.rotate(0.5);
  }
  scale(x: number, y: number): void {
    this.matrix.scale(x, y);
  }
  translate(x: number, y: number): void {
    this.matrix.translate(x, y);
  };
  get matrix(): Matrix {
    return this.#transforms[this.#transforms.length - 1];
  }
  #transforms: Array<Matrix>;
}

export class Renderer {
  constructor() {
    this.#pixiRenderer = new PixiRenderer({ clearBeforeRender: false })
    this.#container = new Container();
  }
  clear(): void {
    this.#container = new Container();
  }
  drawRectangle(width: number, height: number, matrix: Matrix): void {
    const graphics = new Graphics();
    graphics.beginFill("#ffffff");
    graphics.drawRect(0, 0, width, height);
    graphics.localTransform.copyFrom(matrix);
    this.#container.addChild(graphics);
  }
  drawSprite(texture: Texture, matrix: Matrix): void {
    const sprite = new Sprite(texture);
    sprite.localTransform.copyFrom(matrix);
    this.#container.addChild(sprite);
  }
  load(url: string): Promise<Texture> {
    return Assets.load(url);
  }
  render(): void {
    this.#pixiRenderer?.render(this.#container);
  }
  get el(): HTMLCanvasElement {
    return this.#pixiRenderer?.view as HTMLCanvasElement;
  }
  #container: Container;
  #pixiRenderer: PixiRenderer;
}

