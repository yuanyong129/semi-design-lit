
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { ArcoIcon } from "../../components/icon-component";

@customElement('icon-down')
export class IconDown extends ArcoIcon {
  render() {
    return html`
      <svg class="${this.cls('down')}" style="${this.innerStyle()}" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
        <path d="M39.5996 17.4434L24.0433 32.9997C24.0433 32.9997 13.1813 22.1378 8.48691 17.4434" stroke-linecap="butt"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-down': IconDown
  }
}
