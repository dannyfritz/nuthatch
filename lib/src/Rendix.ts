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
  applyToContainer(container: Container) {
    container.x = this.#matrix.tx;
    container.y = this.#matrix.ty;
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
  drawSprite(texture: Texture): void {
    const sprite = new Sprite(texture);
    this.transform.applyToContainer(sprite);
    this.#buffer.push(sprite)
  }
  load(url: string): Promise<Texture> {
    return Assets.load(url);
  }
  transform: Transform;
  render(): void {
    const container = new Container();
    container.addChild(...this.#buffer);
    this.#pixiRenderer?.render(container);
  }
  get el(): HTMLCanvasElement {
    return this.#pixiRenderer?.canvas as HTMLCanvasElement;
  }
  get ready(): Promise<Rendix> {
    return this.#ready;
  }
  #buffer: Array<Container>;
  #pixiRenderer: Renderer | undefined;
  #ready: Promise<Rendix>;
}

export { Rendix };
