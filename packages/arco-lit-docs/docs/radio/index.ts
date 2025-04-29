import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';

@customElement('radio-docs')
export class RadioDocs extends LitElement {
  protected render() {
    return html`
      <h1>单选框 Radio</h1>
      <p>在一组相关且互斥数据中，用户仅能选择一个选项。</p>
      <radio-basic></radio-basic>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'radio-docs': RadioDocs
  }
}