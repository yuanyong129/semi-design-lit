import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';
import './__docs__/custom';

@customElement('empty-docs')
export class EmptyDocs extends LitElement {

  protected render() {
    return html`
      <h1>空状态 Empty</h1>
      <p>指当前场景没有对应的数据内容，呈现出的一种状态。</p>
      <a-divider></a-divider>
      <empty-basic></empty-basic>
      <custom-basic></custom-basic>
    `;
  }
} 

declare global {
  interface HTMLElementTagNameMap {
    'empty-docs': EmptyDocs
  }
}