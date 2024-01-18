import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Rendix, TransformStack } from "rendix";
import { withWatch, signal } from "@lit-labs/preact-signals";
import pixiLogo from "../../public/pixi.png";

const showLogo = signal(true);
const playRendix = signal(true);

const rendix = new Rendix();
const transformStack = new TransformStack();
const pixiTexture = await rendix.load(pixiLogo);
const render = async () => {
  if (!playRendix.value) {
    return;
  }
  const now = performance.now();
  const sin = Math.sin(now / 500);
  rendix.clear();
  transformStack.clear();
  if (showLogo.peek()) {
    transformStack.push();
    transformStack.translate(20, 10 + sin * 10);
    transformStack.scale(2, 2);
    rendix.drawSprite(pixiTexture, transformStack.matrix);
    transformStack.pop();
    transformStack.push();
    transformStack.translate(-10, -10);
    transformStack.rotate(-.5);
    transformStack.translate(150, 50);
    rendix.drawSprite(pixiTexture, transformStack.matrix);
  }
  rendix.render();
  requestAnimationFrame(render);
};

@customElement("rendix-demo")
class RendixDemoElement extends LitElement {
  #rendix: HTMLCanvasElement | undefined;
  constructor() {
    super();
    this.#rendix = rendix.el;
    requestAnimationFrame(render);
  }

  render() {
    return withWatch(html)`
      <main>
        <h1>Demo!</h1>
        <button @click=${this._onPlayPause}>Play/Pause</button>
        <button @click=${this._onToggleLogo}>Toggle Logo</button>
        <hr />
        ${this.#rendix}
      </main>
    `;
  }

  private _onToggleLogo() {
    showLogo.value = !showLogo.value;
  }

  private _onPlayPause() {
    playRendix.value = !playRendix.value;
    if (playRendix.value) {
      requestAnimationFrame(render);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": RendixDemoElement;
  }
}

export { RendixDemoElement };
