import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';
import { loadMdFile } from "../../../utils";

@customElement('custom-basic')
export class CustomBasic extends LitElement {
  @state()
  _code = ``;

  async connectedCallback() {
    super.connectedCallback();
    this._code = await loadMdFile('empty', 'custom');
  }

  private _renderImageSlot() {
    return html`<icon-exclamation-circle-fill></icon-exclamation-circle-fill>`
  }

  render() {
    return html`
      <h2>自定义图片和文案</h2>
      <p>通过 image 插槽自定义图标、图片，或通过内容修改文案。</p>
      <code-demo>
        <a-empty .imageSlot="${this._renderImageSlot()}">
          No data, please reload!
        </a-empty>
      </code-demo>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}
