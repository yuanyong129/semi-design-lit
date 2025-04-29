import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../components/code-content/index';

@customElement('switch-value')
export class SwitchValue extends LitElement {

  @state()
  _value?: string;

  @state()
  _code?: string;

  handleChange(ev: CustomEvent) {
    this._value = ev.detail.value;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.fetch('src/docs/switch/__demo__/value.md').then(res => {
      return res.blob()
    }).then(async res => {
      this._code = await res.text();
    });
  }
  
  protected render() {
    return html`
      <h2>自定义开关的值</h2>
      <p>通过 checkedValue 和 uncheckedValue 可以自定义开关的值。</p>
      <a-space direction="vertical" size="large">
        <a-switch checkedValue="yes" uncheckedValue="no" @change="${this.handleChange}"></a-switch>
        <div>Current Value: ${ this._value }</div>
      </a-space>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}