import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-close-circle')
export class IconCloseCircle extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('close-circle')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M9 9L15 15M15 9L9 15" stroke-linecap="round"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-close-circle': IconCloseCircle
  }
}
