import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const code =
`<a-space size="large">
  <a-switch></a-switch>
  <a-switch type="round"></a-switch>
  <a-switch type="line"></a-switch>
</a-space>`;

@customElement('switch-type')
export class SwitchType extends LitElement {
 
  protected render() {
    return html`
      <h2>开关类型</h2>
      <p>开关分为 circle - 圆形（默认）、round - 圆角、line - 线性三种类型。</p>
      <code-demo>
        ${unsafeHTML(code)}
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
