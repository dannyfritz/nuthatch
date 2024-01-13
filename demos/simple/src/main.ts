import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Rendix } from "rendix";
import { withWatch, signal } from "@lit-labs/preact-signals";
import pixiLogo from "../../public/pixi.png";

// const pixiLogo = await Rendix.loadAsset("../public/pixi.png");
const showLogo = signal(true);
const playRendix = signal(true);

const rendix = new Rendix();
const pixiTexture = await rendix.load(pixiLogo);
const render = async () => {
  if (!playRendix.value) {
    return;
  }
  const now = performance.now();
  const sin = Math.sin(now / 500);
  rendix.clear();
  if (showLogo.peek()) {
    rendix.transform.push();
    rendix.transform.translate(-150, 0);
    rendix.transform.scale(2, 2);
    rendix.drawSprite(pixiTexture, 150, 150 + sin * 10);
    rendix.transform.pop();
  }
  rendix.render();
  requestAnimationFrame(render);
};

@customElement("rendix-demo")
class RendixDemoElement extends LitElement {
  #rendix: HTMLCanvasElement | undefined;
  constructor() {
    super();
    rendix.ready.then((rendix) => {
      this.#rendix = rendix.el;
      requestAnimationFrame(render);
      this.update(new Map());
    })
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
