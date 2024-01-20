import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Renderer, TransformStack } from "nuthatch";
import { withWatch, signal } from "@lit-labs/preact-signals";
import pixiLogo from "../../public/pixi.png";

const showLogo = signal(true);
const play = signal(true);

const renderer = new Renderer();
const transformStack = new TransformStack();
const pixiTexture = await renderer.load(pixiLogo);
const renderFn = async () => {
  if (!play.value) {
    return;
  }
  const now = performance.now();
  const sin = Math.sin(now / 500);
  renderer.clear();
  transformStack.clear();
  if (showLogo.peek()) {
    // transformStack.push();
    // transformStack.translate(20, 10 + sin * 10);
    // transformStack.scale(2, 2);
    renderer.drawSprite(pixiTexture, transformStack.matrix);
    // transformStack.pop();
    // transformStack.push();
    // transformStack.translate(-10, -10);
    // transformStack.rotate(-.5);
    // transformStack.translate(150, 50);
    renderer.drawSprite(pixiTexture, transformStack.matrix);
  }
  renderer.render();
  requestAnimationFrame(renderFn);
};

@customElement("nuthatch-demo")
class NuthatchDemoElement extends LitElement {
  #renderer: HTMLCanvasElement | undefined;
  constructor() {
    super();
    this.#renderer = renderer.el;
    requestAnimationFrame(renderFn);
  }

  render() {
    return withWatch(html)`
      <main>
        <h1>Demo!</h1>
        <button @click=${this._onPlayPause}>Play/Pause</button>
        <button @click=${this._onToggleLogo}>Toggle Logo</button>
        <hr />
        ${this.#renderer}
      </main>
    `;
  }

  private _onToggleLogo() {
    showLogo.value = !showLogo.value;
  }

  private _onPlayPause() {
    play.value = !play.value;
    if (play.value) {
      requestAnimationFrame(renderFn);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nuthatch-demo": NuthatchDemoElement;
  }
}

export { NuthatchDemoElement };
