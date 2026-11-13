import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { headerStyles } from './style/header.style';

@customElement('semi-layout-header')
export class SemiLayoutHeader extends LitElement {
  protected render() {
    return html`<header class="semi-layout-header" part="header"><slot></slot></header>`;
  }

  static styles = headerStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-layout-header': SemiLayoutHeader;
  }
}
