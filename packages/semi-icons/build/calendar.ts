import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-calendar')
export class IconCalendar extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('calendar')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2"></rect>
        <path d="M3.5 10H20.5M8 3.5V7M16 3.5V7" stroke-linecap="round"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-calendar': IconCalendar
  }
}
