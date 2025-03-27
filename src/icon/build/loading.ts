import { CSSResultGroup, html } from "lit";
import { customElement } from "lit/decorators.js";
import { ArcoIcon } from "../../../src/components/icon-component";
import { iconStyles } from "../../style/theme/icon";

@customElement('icon-loading')
export class IconLoading extends ArcoIcon {
  render() {
    return html`
      <svg class="${this.cls('loading')}" style="${this.innerStyle()}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
        <path d="M42 24C42 33.9411 33.9411 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6" stroke-linecap="butt"></path>
      </svg>
    `;
  }

  static styles?: CSSResultGroup | undefined = iconStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-loading': IconLoading
  }
}