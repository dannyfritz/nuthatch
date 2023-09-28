import * as Pixi from "pixi.js";
import { Color } from "./Color";
import { LineStyle } from "./LineStyle";
import { BitmapFont } from "./BitmapFont";

class Rendix {
  constructor() {
    this.#pixiRenderer = new Pixi.Renderer();
    this.#buffer = [];
    this.fillStyle = new Color({ h: 100, s: 50, l: 100 });
    this.lineStyle = new LineStyle();
    this.#matrix = Pixi.Matrix.IDENTITY.clone();
    this.#matrixStack = [this.#matrix];
  }
  #buffer: Array<[Pixi.DisplayObject, Pixi.Matrix]>;
  #matrix: Pixi.Matrix;
  #matrixStack: Array<Pixi.Matrix>;
  #pixiRenderer: Pixi.Renderer;
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
    const graphics = new Pixi.Graphics();
    graphics.beginFill(this.fillStyle.toString());
    graphics.drawRect(x, y, width, height);
    this.#buffer.push([graphics, this.#matrix.clone()]);
  }
  drawSprite(texture: Pixi.RenderTexture, x: number, y: number): void {
    const sprite = new Pixi.Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    this.#buffer.push([sprite, this.#matrix.clone()]);
  }
  drawText(value: string, fontName: string) {
    const text = new Pixi.BitmapText(value, { fontName });
    this.#buffer.push([text, this.#matrix.clone()]);
  }
  pop() {
    if (this.#matrixStack.length > 0) {
      this.#matrix = this.#matrixStack.pop()!;
    } else {
      this.#matrix = Pixi.Matrix.IDENTITY.clone();
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
    const container = new Pixi.Container();
    for (const [displayObject, matrix] of this.#buffer) {
      displayObject.localTransform.copyFrom(matrix);
      container.addChild(displayObject);
    }
    this.#pixiRenderer.render(container);
  }
  static BitmapFont = BitmapFont;
  static Color = Color;
  static LineStyle = LineStyle;
  static async loadAsset(path: string): Promise<Pixi.RenderTexture> {
    // TODO: Make sure path ends in a valid filetype
    return Pixi.Assets.load(path);
  }
}

export { Rendix };
