import { Assets, Container, Matrix, Point, Texture, autoDetectRenderer, type Renderer, Sprite } from "pixi.js";

class Clock {
  startTime: number = Number.MIN_VALUE;
  previousTime: number = Number.MIN_VALUE;
  elapsedTime: number = 0;
  deltaTime: number = Number.EPSILON;
  get deltaTimeS (): number {
    return this.deltaTime / 1000;
  }
  start() {
    this.startTime = performance.now();
    this.previousTime = performance.now();
    this.deltaTime = Number.EPSILON;
  }
  tick(currentTime: number) {
    this.deltaTime = Math.min(currentTime - this.previousTime, 16);
    this.previousTime = currentTime;
    this.elapsedTime = currentTime - this.startTime;
  }
};

class TransformStack {
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

class NhRenderer {
  ready: Promise<void>;
  constructor() {
    let resolve: () => void;
    this.ready = new Promise((_resolve) => resolve = _resolve);
    autoDetectRenderer({}).then((renderer) => {
      this.#pixiRenderer = renderer;
      resolve();
    })
    this.#container = new Container();
  }
  clear(): void {
    this.#container = new Container();
  }
  drawSprite(texture: Texture, matrix: Matrix): void {
    const sprite = new Sprite(texture);
    sprite.updateLocalTransform = function () {
      this.localTransform.copyFrom(matrix);
    }
    this.#container.addChild(sprite);
  }
  load(url: string): Promise<Texture> {
    return Assets.load(url);
  }
  render(): void {
    this.#pixiRenderer?.render(this.#container);
  }
  get el(): HTMLCanvasElement {
    return this.#pixiRenderer?.canvas as HTMLCanvasElement;
  }
  #container: Container;
  #pixiRenderer: Renderer | undefined;
}

export { Clock, NhRenderer as Renderer, Point, TransformStack };

