import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-plus')
export class IconPlus extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('plus')}" style="${this.innerStyle()}" part="icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
        <path d="M5 24H43M24 5L24 43" stroke-linecap="butt"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-plus': IconPlus
  }
}
