import { Assets, Container, Matrix, Texture, Renderer, Sprite } from "pixi.js";

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
  constructor() {
    this.#pixiRenderer = new Renderer({ clearBeforeRender: false })
    this.#container = new Container();
  }
  clear(): void {
    this.#container = new Container();
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
  #pixiRenderer: Renderer;
}

export { NhRenderer as Renderer, TransformStack };
