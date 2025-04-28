import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../code-content/index';

@customElement('empty-basic')
export class EmptyBasic extends LitElement {
  _code = `<a-empty></a-empty>`

  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>空状态组件的基本用法。</p>
      ${unsafeHTML(this._code)}
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
