import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-eye-closed')
export class IconEyeClosed extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('eye-closed')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <path d="M3 4L21 20" stroke-linecap="round"></path>
        <path d="M9.9 5.4C10.6 5.15 11.3 5 12 5C16 5 19.5 7.5 21.5 12C20.7 13.8 19.6 15.2 18.3 16.2M6.1 6.9C4.7 8.1 3.4 9.8 2.5 12C4.5 16.5 8 19 12 19C13.4 19 14.8 18.7 16 18.1" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9.9 10.1C9.6 10.6 9.5 11.3 9.6 11.9C9.8 13.2 11 14.2 12.4 14.2C13 14.2 13.6 14 14.1 13.7" stroke-linecap="round"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-eye-closed': IconEyeClosed
  }
}
