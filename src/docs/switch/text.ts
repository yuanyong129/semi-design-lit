import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('switch-text')
export class SwitchText extends LitElement {
  protected render() {
    return html`
      <h2>自定义文案</h2>
      <p>自定义开关的打开/关闭状态的文字。</p>
      <a-space size="large">
        <a-switch
          checkedText="ON"
          uncheckedText="OFF">
        </a-switch>
        <a-switch
          type="round"
          .checkedText=${html`<span>ON</span>`}
          .uncheckedText=${html`<span>OFF</span>`}>
        </a-switch>
      </a-space>
      <a-divider></a-divider>
    `;
  }
}
