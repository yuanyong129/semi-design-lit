import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../../components/code-content/index';

const code =
`<a-space>
  <a-tag size="large">Large</a-tag>
  <a-tag>Medium</a-tag>
  <a-tag size="small">Small</a-tag>
</a-space>`;

@customElement('tag-size')
export class TagSize extends LitElement {
  protected render() {
    return html`
      <h2>标签的尺寸</h2>
      <p>标签的大小分为：small、medium、large 三种，可以在不同场景下选择合适按钮尺寸。推荐及默认尺寸为 medium。</p>
      <code-demo>
        ${unsafeHTML(code)}
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}