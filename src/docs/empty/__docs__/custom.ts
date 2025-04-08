import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../code-content/index';

@customElement('custom-basic')
export class CustomBasic extends LitElement {
  _code = `<a-empty>
  <icon-exclamation-circle-fill slot="image"></icon-exclamation-circle-fill>
  No data, please reload!
</a-empty>`

  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>空状态组件的基本用法。</p>
      <a-empty .imageSlot="${html`<icon-exclamation-circle-fill></icon-exclamation-circle-fill>`}">
        No data, please reload!
      </a-empty>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}