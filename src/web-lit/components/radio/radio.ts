import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('a-radio')
export class ArcoRadio extends LitElement {

  render() {
    return html`
      <div class="radio-group">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
   interface HTMLElementTagNameMap {
      'a-radio': ArcoRadio
    }
}