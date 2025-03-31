import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './basic';
import './type';
import './size';
import './disabled';
import './color';
import './value';
import './change-intercept';
import './loading';
import './text';
import './icon';

@customElement('switch-docs')
class SwitchDocs extends LitElement {
  connectedCallback(): void {
    super.connectedCallback()
  }
  protected render() {
    return html`
      <h1>开关 Switch</h1>
      <p>互斥性的操作控件，用户可打开或关闭某个功能。</p>
      <a-divider></a-divider>
      <switch-basic></switch-basic>
      <switch-type></switch-type>
      <switch-size></switch-size>
      <switch-disabled></switch-disabled>
      <switch-color></switch-color>
      <switch-value></switch-value>
      <switch-change-intercept></switch-change-intercept>
      <switch-loading></switch-loading>
      <switch-text></switch-text>
      <switch-icon></switch-icon>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'switch-docs': SwitchDocs
  }
}