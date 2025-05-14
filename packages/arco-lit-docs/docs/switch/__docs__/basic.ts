import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../../components/code-content/index';

const code = `<a-switch></a-switch>`;

@customElement('switch-basic')
export class SwitchBasic extends LitElement {
  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>开关的基本用法。</p>
      <code-demo>
        ${unsafeHTML(code)}
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
