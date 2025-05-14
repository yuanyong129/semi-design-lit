import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../../components/code-content/index';

const code = `<a-switch checkedColor="#F53F3F" uncheckedColor="#14C9C9"></a-switch>`;

@customElement('switch-color')
export class SwitchColor extends LitElement {
  protected render() {
    return html`
      <h2>自定义开关的颜色</h2>
      <p>通过 checkedColor 和 uncheckedColor 可以自定义开关的颜色。</p>
      <code-demo>
        ${unsafeHTML(code)}
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}