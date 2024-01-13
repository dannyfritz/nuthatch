import { autoDetectRenderer, Assets, Container, Matrix, type Renderer, Texture, Sprite } from "pixi.js";

class Transform {
  constructor(matrix?: Matrix) {
    this.#matrix = matrix ?? Matrix.IDENTITY.clone();
    this.#matrixStack = [this.#matrix];
  }
  get matrix(): Matrix {
    return this.#matrix.clone();
  }
  pop() {
    if (this.#matrixStack.length > 0) {
      this.#matrix = this.#matrixStack.pop()!;
    } else {
      this.#matrix = Matrix.IDENTITY.clone();
    }
  }
  push() {
    this.#matrixStack.push(this.#matrix);
    this.#matrix = this.#matrix.clone();
  }
  rotate(angle: number) {
    this.#matrix.rotate(angle);
  }
  scale(x: number, y: number) {
    this.#matrix.scale(x, y);
  }
  translate(x: number, y: number) {
    this.#matrix.translate(x, y);
  }
  #matrix: Matrix;
  #matrixStack: Array<Matrix>;
}

class Rendix {
  constructor() {
    this.#ready = new Promise((resolve) => {
      autoDetectRenderer({ clearBeforeRender: false }).then((renderer) => {
        this.#pixiRenderer = renderer;
        resolve(this);
      });
    });
    this.#buffer = [];
    this.transform = new Transform();
  }
  clear(): void {
    // this.#pixiRenderer.clear();
    // this.#pixiRenderer?.clear();
    this.#buffer = [];
  }
  drawRect(x: number, y: number, width: number, height: number): void {
    console.log(x, y, width, height);
  }
  drawSprite(texture: Texture, x: number, y: number): void {
    this.transform.translate(x, y);
    const sprite = new Sprite(texture);
    sprite.localTransform.copyFrom(this.transform.matrix);
    this.#buffer.push([sprite, this.transform.matrix])
  }
  load(url: string): Promise<Texture> {
    return Assets.load(url);
  }
  transform: Transform;
  render(): void {
    const container = new Container();
    for (const [displayObject, matrix] of this.#buffer) {
      const layer = new Container();
      layer.addChild(displayObject);
      layer.localTransform.copyFrom(matrix);
      container.addChild(layer);
    }
    this.#pixiRenderer?.render(container);
  }
  get el(): HTMLCanvasElement {
    return this.#pixiRenderer?.canvas as HTMLCanvasElement;
  }
  get ready(): Promise<Rendix> {
    return this.#ready;
  }
  #buffer: Array<[Container, Matrix]>;
  #pixiRenderer: Renderer | undefined;
  #ready: Promise<Rendix>;
}

export { Rendix };
