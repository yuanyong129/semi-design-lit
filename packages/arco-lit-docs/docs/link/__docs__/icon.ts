import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<div>
  <a-space>
    <a-link href="link" icon>Link</a-link>
    <a-link href="link" disabled icon>Link</a-link>
  </a-space>
</div>
<div>
  <a-space>
    <a-link href="link">
      <icon-edit slot="icon"></icon-edit>
      Link
    </a-link>
    <a-link href="link" disabled>
      <icon-edit slot="icon"></icon-edit>
      Link
    </a-link>
  </a-space>
</div>
`;

@customElement('link-icon')
export class LinkIcon extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>图标</h2>
      <p>通过 icon 设置带图标的链接，设置为 true 时候显示默认图标。</p>
      <code-demo>
        <div>
          <a-space>
            <a-link href="link" icon>Link</a-link>
            <a-link href="link" disabled icon>Link</a-link>
          </a-space>
        </div>
        <div>
          <a-space>
            <a-link href="link">
              <icon-edit slot="icon"></icon-edit>
              Link
            </a-link>
            <a-link href="link" disabled>
              <icon-edit slot="icon"></icon-edit>
              Link
            </a-link>
          </a-space>
        </div>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
