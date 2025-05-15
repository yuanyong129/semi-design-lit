import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-space>
  <a-link href="link" .hoverable="${false}">Link</a-link>
  <a-link href="link" status="danger" .hoverable=${false}>Link</a-link>
</a-space>
`;

@customElement('link-hoverable')
export class LinkHoverable extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>悬浮状态底色</h2>
      <p>可以通过 hoverable 属性设置是否在悬浮状态时隐藏底色。</p>
      <code-demo>
        <a-space>
          <a-link href="link" .hoverable="${false}">Link</a-link>
          <a-link href="link" status="danger" .hoverable=${false}>Link</a-link>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
