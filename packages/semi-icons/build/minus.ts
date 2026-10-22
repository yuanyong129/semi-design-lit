import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-minus')
export class IconMinus extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('minus')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2">
        <path d="M5 12H19" stroke-linecap="round"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-minus': IconMinus
  }
}
