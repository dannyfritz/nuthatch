import {
  Assets,
  Container,
  DisplayObject,
  Graphics,
  Matrix,
  RenderTexture,
  Renderer,
  Sprite,
} from "pixi.js";
import { Color } from "./Color";
import { LineStyle } from "./LineStyle";

class Rendix {
  constructor() {
    this.#pixiRenderer = new Renderer();
    this.#buffer = [];
    this.fillStyle = new Color({ h: 100, s: 50, l: 50 });
    this.lineStyle = new LineStyle();
    this.#matrix = Matrix.IDENTITY.clone();
    this.#matrixStack = [this.#matrix];
  }
  #buffer: Array<[DisplayObject, Matrix]>;
  #matrix: Matrix;
  #matrixStack: Array<Matrix>;
  #pixiRenderer: Renderer;
  get el(): HTMLCanvasElement {
    return this.#pixiRenderer.view as HTMLCanvasElement;
  }
  fillStyle: Color;
  lineStyle: LineStyle;
  clear(): void {
    this.#pixiRenderer.clear();
    this.#buffer = [];
  }
  drawRect(x: number, y: number, width: number, height: number): void {
    const graphics = new Graphics();
    graphics.beginFill(this.fillStyle.toString());
    graphics.drawRect(x, y, width, height);
    this.#buffer.push([graphics, this.#matrix.clone()]);
  }
  drawSprite(texture: RenderTexture, x: number, y: number): void {
    const sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    this.#buffer.push([sprite, this.#matrix.clone()]);
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
  translate(x: number, y: number) {
    this.#matrix.translate(x, y);
  }
  rotate(angle: number) {
    this.#matrix.rotate(angle);
  }
  scale(x: number, y: number) {
    this.#matrix.scale(x, y)
  }
  render(): void {
    const container = new Container();
    for (const [displayObject, matrix] of this.#buffer) {
      displayObject.localTransform.copyFrom(matrix);
      container.addChild(displayObject);
    }
    this.#pixiRenderer.render(container);
  }
  static Color = Color;
  static LineStyle = LineStyle;
  static async loadAsset(path: string): Promise<RenderTexture> {
    // TODO: Make sure path ends in a valid filetype
    return Assets.load(path);
  }
}

export { Color, Rendix };
