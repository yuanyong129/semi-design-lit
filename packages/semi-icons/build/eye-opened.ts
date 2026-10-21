import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-eye-opened')
export class IconEyeOpened extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('eye-opened')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <path d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z" stroke-linejoin="round"></path>
        <circle cx="12" cy="12" r="3.2"></circle>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-eye-opened': IconEyeOpened
  }
}
