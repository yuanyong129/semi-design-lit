import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';

@customElement('scrollbar-docs')
class ScrollbarDocs extends LitElement {

  protected render() {
    return html`
      <h1>滚动条 Scrollbar</h1>
      <p>用于替换浏览器默认滚动条样式。</p>
      <a-divider></a-divider>
      <scrollbar-basic></scrollbar-basic>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scrollbar-docs': ScrollbarDocs
  }
}