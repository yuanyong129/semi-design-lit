import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';
import './__docs__/type';
import './__docs__/size';
import './__docs__/disabled';
import './__docs__/color';
import './__docs__/value';
import './__docs__/change-intercept';
import './__docs__/loading';
import './__docs__/text';
import './__docs__/icon';

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