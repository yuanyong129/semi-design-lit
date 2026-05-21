import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
// import './__docs__/basic';
// import './__docs__/custom';

@customElement('input-docs')
export class InputDocs extends LitElement {

  protected render() {
    return html`
      <h1>输入框 Input</h1>
      <p>指当前场景没有对应的数据内容，呈现出的一种状态。</p>
      <a-divider></a-divider>
      <a-input placeholder="请输入"></a-input>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-docs': InputDocs
  }
}
