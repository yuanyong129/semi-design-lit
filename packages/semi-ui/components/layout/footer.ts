import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { footerStyles } from './style/footer.style';

@customElement('semi-layout-footer')
export class SemiLayoutFooter extends LitElement {
  protected render() {
    return html`<footer class="semi-layout-footer" part="footer"><slot></slot></footer>`;
  }

  static styles = footerStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-layout-footer': SemiLayoutFooter;
  }
}
