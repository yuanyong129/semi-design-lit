import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { contentStyles } from './style/content.style';

@customElement('semi-layout-content')
export class SemiLayoutContent extends LitElement {
  protected render() {
    return html`<main class="semi-layout-content" part="content"><slot></slot></main>`;
  }

  static styles = contentStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-layout-content': SemiLayoutContent;
  }
}
