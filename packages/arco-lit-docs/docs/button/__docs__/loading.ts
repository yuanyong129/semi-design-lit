import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = ``;

@customElement('button-loading')
export class ButtonLoading extends LitElement {
  _code = code;

  @state()
  _loading1 = false;

  @state()
  _loading2 = false;
  

  handleClick1 = () => {
    this._loading1 = !this._loading1;
  }

  handleClick2 = () => {
    this._loading2 = !this._loading2;
  }

  protected render() {
    return html`
      <h2>加载中状态</h2>
      <p>通过设置 loading 可以让按钮处于加载中状态。处于加载中状态的按钮不会触发点击事件。</p>
      <code-demo>
        <a-space>
          <a-button type="primary" loading>Primary</a-button>
          <a-button loading>Default</a-button>
          <a-button type="dashed" loading>Dashed</a-button>
          <a-button type="primary" .loading="${this._loading1}" @click="${this.handleClick1}">Click Me</a-button>
          <a-button type="primary" .loading="${this._loading2}" @click="${this.handleClick2}" .slots="${{ icon: html`<icon-plus></icon-plus>` }}">
            Click Me
          </a-button>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
