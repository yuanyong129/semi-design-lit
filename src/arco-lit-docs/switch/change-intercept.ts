import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../code-content/index';

@customElement('switch-change-intercept')
export class SwitchChangeIntercept extends LitElement {
  @state()
  _code?: string;

  async handleChangeIntercept() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  async handleChangeIntercept2(newValue?: string | boolean | number) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!newValue) {
      alert("OH, You can't change")
      return false
    }
    return true
  }

  async handleChangeIntercept3() {
    await new Promise((_, reject) => setTimeout(() => {
      alert("OH, Something went wrong")
      reject()
    }, 1000))
    return true
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.fetch('src/docs/switch/__demo__/change-intercept.md').then(res => {
      return res.blob()
    }).then(async res => {
      this._code = await res.text();
    });
  }

  protected render() {
    return html`
      <h2>切换拦截</h2>
      <p>设置 beforeChange 函数，函数的返回值将用于判断是否阻止切换。</p>
      <a-space size="large">
        <a-switch .beforeChange=${this.handleChangeIntercept}></a-switch>
        <a-switch type="round" .beforeChange=${this.handleChangeIntercept2}></a-switch>
        <a-switch type="line" .beforeChange=${this.handleChangeIntercept3}></a-switch>
      </a-space>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}
