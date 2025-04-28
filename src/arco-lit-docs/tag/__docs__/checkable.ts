import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../code-content/index';

const code =
`<a-space>
  <a-tag checkable>Awesome</a-tag>
  <a-tag checkable color="red" .defaultChecked="true">Toutiao</a-tag>
  <a-tag checkable color="arcoblue" .default-checked="true">Lark</a-tag>
</a-space>`;

@customElement('tag-checkable')
export class TagCheckable extends LitElement {
  protected render() {
    return html`
      <h2>可选中</h2>
      <p>通过设置 checkable ，可以实现点击选中的效果。</p>
      <a-space>
        <a-tag checkable>Awesome</a-tag>
        <a-tag checkable color="red" .defaultChecked="${true}">Toutiao</a-tag>
        <a-tag checkable color="arcoblue" .defaultChecked="${true}">Lark</a-tag>
      </a-space>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
