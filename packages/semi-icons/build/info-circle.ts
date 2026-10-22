import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-info-circle')
export class IconInfoCircle extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('info-circle')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 11V16" stroke-linecap="round"></path>
        <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"></circle>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-info-circle': IconInfoCircle
  }
}
