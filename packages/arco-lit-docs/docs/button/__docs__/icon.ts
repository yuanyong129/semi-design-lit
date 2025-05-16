import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';
import { loadMdFile } from "@/utils";

@customElement('button-icon')
export class ButtonIcon extends LitElement {
  @state()
  _code = '';

  async connectedCallback() {
    super.connectedCallback();
    this._code = await loadMdFile('button', 'icon');
  }

  protected render() {
    return html`
      <h2>图标按钮</h2>
      <p>按钮可以嵌入图标。在只设置图标时，按钮的宽高相等。</p>
      <code-demo>
        <a-space>
          <a-button
            type="primary"
            .slots=${{ icon: html`<icon-plus></icon-plus>` }}>
          </a-button>
          <a-button type="primary" .slots=${{ icon: html`<icon-delete></icon-delete>` }}>
            Delete
          </a-button>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}
