import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../code-content/index';

const code =
`<a-space>
  <a-tag closable>Tag</a-tag>
  <a-tag closable>
    <icon-star slot="icon"></icon-star>
    Tag
  </a-tag>
</a-space>`;

@customElement('tag-closeable')
export class TagCloseable extends LitElement {
  protected render() {
    return html`
      <h2>可关闭标签</h2>
      <p>通过 closable 属性控制标签是否可关闭。可关闭标签可通过 close 事件执行一些关闭后操作，也可通过 visible 属性控制标签的显示或隐藏。</p>
      ${unsafeHTML(code)}
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
