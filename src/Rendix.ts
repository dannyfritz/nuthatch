import * as Pixi from "pixi.js";

class BitmapFont {
  constructor(fontName: string, fill: Pixi.TextStyle["fill"]) {
    Pixi.BitmapFont.from(fontName, {
      fill,
    });
  }
}

type ColorInput =
  | {
      /** @example 0-360 */
      h: number;
      /** @example 0-1 */
      s: number;
      /** @example 0-1 */
      l: number;
      /** @example 0-1 */
      a?: number;
    }
  | {
      /** @example 0-255 */
      r: number;
      /** @example 0-255 */
      g: number;
      /** @example 0-255 */
      b: number;
      /** @example 0-1 */
      a?: number;
    };
class Color {
  #pixiColor: Pixi.Color;
  constructor(input: ColorInput) {
    this.#pixiColor = new Pixi.Color(input);
  }
  toString(): string {
    return this.#pixiColor.toRgbaString();
  }
}

class LineStyle {
  constructor() {}
}

class Transform {
  constructor(matrix?: Pixi.Matrix) {
    this.#matrix = matrix ?? Pixi.Matrix.IDENTITY.clone();
    this.#matrixStack = [this.#matrix];
  }
  get matrix(): Pixi.Matrix {
    return this.#matrix.clone();
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
  rotate(angle: number) {
    this.#matrix.rotate(angle);
  }
  scale(x: number, y: number) {
    this.#matrix.scale(x, y);
  }
  translate(x: number, y: number) {
    this.#matrix.translate(x, y);
  }
  #matrix: Pixi.Matrix;
  #matrixStack: Array<Pixi.Matrix>;
}

class Rendix {
  static BitmapFont = BitmapFont;
  static Color = Color;
  static LineStyle = LineStyle;
  static async loadAsset(path: string): Promise<Pixi.RenderTexture> {
    // TODO: Make sure path ends in a valid filetype
    return Pixi.Assets.load(path);
  }
  constructor() {
    this.#pixiRenderer = new Pixi.Renderer();
    this.#buffer = [];
    this.fillStyle = new Color({ h: 100, s: 50, l: 100 });
    this.lineStyle = new LineStyle();
    this.transform = new Transform();
  }
  clear(): void {
    this.#pixiRenderer.clear();
    this.#buffer = [];
  }
  drawRect(x: number, y: number, width: number, height: number): void {
    const graphics = new Pixi.Graphics();
    graphics.beginFill(this.fillStyle.toString());
    graphics.drawRect(x, y, width, height);
    this.#buffer.push([graphics, this.transform.matrix]);
  }
  drawSprite(texture: Pixi.RenderTexture, x: number, y: number): void {
    const sprite = new Pixi.Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    this.#buffer.push([sprite, this.transform.matrix]);
  }
  drawText(value: string, fontName: string) {
    const text = new Pixi.BitmapText(value, { fontName });
    this.#buffer.push([text, this.transform.matrix]);
  }
  get el(): HTMLCanvasElement {
    return this.#pixiRenderer.view as HTMLCanvasElement;
  }
  fillStyle: Color;
  lineStyle: LineStyle;
  transform: Transform;
  render(): void {
    const container = new Pixi.Container();
    for (const [displayObject, matrix] of this.#buffer) {
      displayObject.localTransform.copyFrom(matrix);
      container.addChild(displayObject);
    }
    this.#pixiRenderer.render(container);
  }
  #buffer: Array<[Pixi.DisplayObject, Pixi.Matrix]>;
  #pixiRenderer: Pixi.Renderer;
}

export { Rendix };
