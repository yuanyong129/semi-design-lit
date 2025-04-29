import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../../components/code-content/index';

const code =
`<a-tag loading>Loading</a-tag>`;

@customElement('tag-loading')
export class TagLoading extends LitElement {
  protected render() {
    return html`
      <h2>加载中状态</h2>
      <p>标签的加载中状态。</p>
      ${unsafeHTML(code)}
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}