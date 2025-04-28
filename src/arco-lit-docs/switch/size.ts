import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
// import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../code-content/index';

const code = 
`<a-space size="large">
  <a-switch></a-switch>
  <a-switch size="small"></a-switch>
</a-space>`;

@customElement('switch-size')
export class SwitchSize extends LitElement {
  protected render() {
    return html`
      <h2>开关尺寸</h2>
      <p>开关分为 small、medium 两种尺寸。</p>
      <a-space size="large">
        <a-switch></a-switch>
        <a-switch size="small"></a-switch>
      </a-space>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
