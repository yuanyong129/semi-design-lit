import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

@customElement('link-status')
export class LinkStatus extends LitElement {
  _code = `<a-space direction="vertical">
  <a-space>
    <a-link href="link">Normal Link</a-link>
    <a-link href="link" disabled>Normal Link</a-link>
  </a-space>
  <a-space>
    <a-link href="link" status="success">Success Link</a-link>
    <a-link href="link" status="success" disabled>Success Link</a-link>
  </a-space>
  <a-space>
    <a-link href="link" status="warning">Warning Link</a-link>
    <a-link href="link" status="warning" disabled>Warning Link</a-link>
  </a-space>
  <a-space>
    <a-link href="link" status="danger">Danger Link</a-link>
    <a-link href="link" status="danger" disabled>Danger Link</a-link>
  </a-space>
</a-space>`;

  protected render() {
    return html`
      <h2>链接的状态</h2>
      <p>链接的状态分为 normal - 正常（默认）、success - 成功、warning - 警告、danger - 危险四种。</p>
      <code-demo>
        <a-space direction="vertical">
          <a-space>
            <a-link href="link">Normal Link</a-link>
            <a-link href="link" disabled>Normal Link</a-link>
          </a-space>
          <a-space>
            <a-link href="link" status="success">Success Link</a-link>
            <a-link href="link" status="success" disabled>Success Link</a-link>
          </a-space>
          <a-space>
            <a-link href="link" status="warning">Warning Link</a-link>
            <a-link href="link" status="warning" disabled>Warning Link</a-link>
          </a-space>
          <a-space>
            <a-link href="link" status="danger">Danger Link</a-link>
            <a-link href="link" status="danger" disabled>Danger Link</a-link>
          </a-space>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
