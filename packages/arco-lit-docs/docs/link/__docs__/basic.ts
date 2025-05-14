import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-space>
  <a-link href="link">Link</a-link>
  <a-link href="link" disabled>Link</a-link>
</a-space>
`;

@customElement('link-basic')
export class LinkBasic extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>链接的基本用法。</p>
      <code-demo>
        <a-space>
          <a-link href="link">Link</a-link>
          <a-link href="link" disabled>Link</a-link>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
