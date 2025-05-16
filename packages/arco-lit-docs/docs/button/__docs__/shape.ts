import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '@/components/code-content/index';
import { loadMdFile } from "@/utils";

@customElement('button-shape')
export class ButtonShape extends LitElement {
  @state()
  _code = '';

  async connectedCallback() {
    super.connectedCallback();
    this._code = await loadMdFile('button', 'shape');
  }
  
  protected render() {
    return html`
      <h2>按钮形状</h2>
      <p>按钮分为 square - 长方形（默认）、circle - 圆形、round - 全圆角三种形状。</p>
      <code-demo>
        <a-space>
          <a-button type="primary">Square</a-button>
          <a-button type="primary" shape="round">Round</a-button>
          <a-button type="primary" .slots="${{ icon: html`<icon-plus></icon-plus>` }}"></a-button>
          <a-button type="primary" shape="circle" .slots="${{ icon: html`<icon-plus></icon-plus>` }}"></a-button>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}