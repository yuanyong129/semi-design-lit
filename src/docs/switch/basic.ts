import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('switch-basic')
export class SwitchBasic extends LitElement {
  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>开关的基本用法。</p>
      <a-switch></a-switch>
      <a-divider></a-divider>
    `;
  }
}
