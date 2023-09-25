import { Color as PixiColor } from "pixi.js";

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
  #pixiColor: PixiColor;
  constructor(input: ColorInput) {
    this.#pixiColor = new PixiColor(input);
  }
  toString(): string {
    return this.#pixiColor.toRgbaString();
  }
}

export { Color };
