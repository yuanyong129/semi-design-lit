import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../code-content/index';
import { loadMdFile } from "../../../docs/_utils";

@customElement('custom-basic')
export class CustomBasic extends LitElement {
  @state()
  _code = ``;

  async connectedCallback() {
    super.connectedCallback();
    this._code = await loadMdFile('empty', 'custom');
  }

  render() {
    return html`
      <h2>自定义图片和文案</h2>
      <p>通过 image 插槽自定义图标、图片，或通过内容修改文案。</p>
      <a-empty>
        <icon-exclamation-circle-fill slot="image"></icon-exclamation-circle-fill>
        No data, please reload!
      </a-empty>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}