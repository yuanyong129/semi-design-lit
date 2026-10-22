import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-copy')
export class IconCopy extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('copy')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <rect x="8" y="8" width="11" height="11" rx="1.5"></rect>
        <path d="M16 5.5C16 4.7 15.3 4 14.5 4H6.5C5.7 4 5 4.7 5 5.5V15.5C5 16.3 5.7 17 6.5 17" stroke-linecap="round"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-copy': IconCopy
  }
}
