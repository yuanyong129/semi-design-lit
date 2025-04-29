import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../../components/code-content/index';

const code =
`<a-space>
  <a-tag>Default</a-tag>
  <a-tag>Tag 1</a-tag>
  <a-tag>Tag 2</a-tag>
  <a-tag>
    <icon-check-circle-fill slot="icon"></icon-check-circle-fill>
    Complete
  </a-tag>
</a-space>`;

@customElement('tag-basic')
export class TagBasic extends LitElement {
  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>标签的基本用法。</p>
      ${unsafeHTML(code)}
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
