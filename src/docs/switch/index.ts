import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('switch-docs')
class SwitchDocs extends LitElement {
  protected render(): unknown {
    return html`
      <h1>开关 Switch</h1>
      <p>互斥性的操作控件，用户可打开或关闭某个功能。</p>
      <a-divider></a-divider>
      <h2>基本用法</h2>
      <p>开关的基本用法。</p>
      <a-switch></a-switch>
      <a-divider></a-divider>
      <h2>开关类型</h2>
      <p>开关分为 circle - 圆形（默认）、round - 圆角、line - 线性三种类型。</p>
      <a-space size="large">
        <a-switch></a-switch>
        <a-switch type="round"></a-switch>
        <a-switch type="line"></a-switch>
      </a-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'switch-docs': SwitchDocs
  }
}