import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-left')
export class IconLeft extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('left')}" style="${this.innerStyle()}" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
        <path d="M32 8.3999L16.4437 23.9563C16.4437 23.9563 27.3056 34.8182 32 39.5126" stroke-linecap="butt"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-left': IconLeft
  }
}