import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@web-lit/icon/build/edit";
import './__docs__/basic';
import './__docs__/status';

@customElement('link-docs')
export class LinkDocs extends LitElement {

  @state()
  _loading1 = false;

  @state()
  _loading2 = false;

  handleClick1() {
    this._loading1 = true;
    setTimeout(() => {
      this._loading1 = false;
    }, 3000);
  }
  handleClick2() {
    this._loading2 = true;
    setTimeout(() => {
      this._loading2 = false;
    }, 3000);
  }

  protected render(): unknown {
    return html`
      <h1>链接 Link</h1>
      <p>链接的基本样式。</p>
      <a-divider></a-divider>
      <link-basic></link-basic>
      <link-status></link-status>
      <h2>悬浮状态底色</h2>
      <p>可以通过 hoverable 属性设置是否在悬浮状态时隐藏底色。</p>
      <a-space>
        <a-link href="link" .hoverable="${false}">Link</a-link>
        <a-link href="link" status="danger" .hoverable=${false}>Link</a-link>
      </a-space>
      <a-divider></a-divider>
      <h2>图标</h2>
      <p>通过 icon 设置带图标的链接，设置为 true 时候显示默认图标。</p>
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
      <a-divider></a-divider>
      <h2>加载中状态</h2>
      <p>通过设置 loading 可以让链接处于加载中状态。处于加载中状态的链接不会触发点击事件。</p>
      <a-space>
        <a-link loading>Link</a-link>
        <a-link .loading="${this._loading1}" @click="${this.handleClick1}">Link</a-link>
        <a-link .loading="${this._loading2}" @click="${this.handleClick2}">
          <icon-edit slot="icon"></icon-edit>
          Link
        </a-link>
      </a-space> 
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-docs': LinkDocs
  }
}
