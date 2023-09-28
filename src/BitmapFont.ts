import * as Pixi from "pixi.js";

class BitmapFont {
  constructor(fontName: string, fill: Pixi.TextStyle["fill"]) {
    Pixi.BitmapFont.from(fontName, {
      fill
    });
  }
}

export { BitmapFont };

