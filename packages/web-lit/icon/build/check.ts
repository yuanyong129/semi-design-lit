import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { ArcoIcon } from "../../../web-lit/components/icon-component";

@customElement('icon-check')
export class IconCheck extends ArcoIcon {
  render() {
    return html`
      <svg class="${this.cls('check')}" style="${this.innerStyle()}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
        <path d="M41.6776 11.0503L19.0502 33.6777L6.32227 20.9498" stroke-linecap="butt"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-check': IconCheck
  }
}
