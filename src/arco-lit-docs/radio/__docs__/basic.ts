import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../code-content/index';

@customElement('radio-basic')
export class RadioBasic extends LitElement {
  _code = `<a-radio></a-radio>`;

  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>链接的基本用法。</p>
      <code-demo>
        <a-radio></a-radio>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}