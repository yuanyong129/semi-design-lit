import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { SemiIcon } from '../icon-component';

@customElement('semi-icon-search')
export class IconSearch extends SemiIcon {
  render() {
    return html`
      <svg class="${this.cls('search')}" style="${this.innerStyle()}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6">
        <circle cx="11" cy="11" r="6.5"></circle>
        <path d="M16 16L21 21" stroke-linecap="round"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon-search': IconSearch
  }
}
