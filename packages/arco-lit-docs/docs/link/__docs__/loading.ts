import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';
import { loadMdFile } from "../../../utils";

@customElement('link-loading')
export class LinkLoading extends LitElement {

  @state()
  _code: string = '';

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

  async connectedCallback() {
    super.connectedCallback();
    this._code = await loadMdFile('link', 'loading');
  }
  
  protected render() {
    return html`
      <h2>加载中状态</h2>
      <p>通过设置 loading 可以让链接处于加载中状态。处于加载中状态的链接不会触发点击事件。</p>
      <code-demo>
        <a-space>
          <a-link loading>Link</a-link>
          <a-link .loading="${this._loading1}" @click="${this.handleClick1}">Link</a-link>
          <a-link .loading="${this._loading2}" @click="${this.handleClick2}">
            <icon-edit slot="icon"></icon-edit>
            Link
          </a-link>
        </a-space> 
      </code-demo>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}
