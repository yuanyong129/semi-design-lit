import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../code-content/index';

const code =
`export class Demo extends LitElement {
  @state()
  _value?: string;

  handleChange(ev: CustomEvent) {
    this._value = ev.detail.value;
  }

  render () {\n` +
'     return html`\n' +
'        <a-space direction="vertical" size="large">\n' +
'         <a-switch checkedValue="yes" uncheckedValue="no" @change="${this.handleChange}"></a-switch>\n' +
'          <div>Current Value: ${ this._value }</div>\n' +
'        </a-space>\n' +
'      `;\n' +
'  }\n' +
`}`;

@customElement('switch-value')
export class SwitchValue extends LitElement {
  @state()
  _value?: string;

  handleChange(ev: CustomEvent) {
    this._value = ev.detail.value;
  }
  
  protected render() {
    return html`
      <h2>自定义开关的值</h2>
      <p>通过 checkedValue 和 uncheckedValue 可以自定义开关的值。</p>
      <a-space direction="vertical" size="large">
        <a-switch checkedValue="yes" uncheckedValue="no" @change="${this.handleChange}"></a-switch>
        <div>Current Value: ${ this._value }</div>
      </a-space>
      <code-content .code="${code}" type="typescript"></code-content>
      <a-divider></a-divider>
    `;
  }
}