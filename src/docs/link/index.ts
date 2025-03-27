import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('link-docs')
export class LinkDocs extends LitElement {
  protected render(): unknown {
    return html`
      <h1>链接 Link</h1>
      <p>链接的基本样式。</p>
      <a-divider></a-divider>
      <h2>基本用法</h2>
      <p>链接的基本用法。</p>
      <a-space>
        <a-link href="link">Link</a-link>
        <a-link href="link" disabled>Link</a-link>
      </a-space>
      <a-divider></a-divider>
      <h2>链接的状态</h2>
      <p>链接的状态分为 normal - 正常（默认）、success - 成功、warning - 警告、danger - 危险四种。</p>
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
      <a-divider></a-divider>
      <h2>悬浮状态底色</h2>
      <p>可以通过 hoverable 属性设置是否在悬浮状态时隐藏底色。</p>
      <a-space>
        <a-link href="link" .hoverable="${false}">Link</a-link>
        <a-link href="link" status="danger" .hoverable=${false}>Link</a-link>
      </a-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-docs': LinkDocs
  }
}
