import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './style/index.less?inline';

@customElement('a-input')
export class ArcoInput extends LitElement {
  protected render() {
    return html`
      <div class="arco-input-wrapper">
        <input class="arco-input" />
      </div>
    `;
  }

  static styles = css`${unsafeCSS(styles)}`;
}

declare global {
  interface HTMLElementTagNameMap {
    'a-input': ArcoInput
  }
}
