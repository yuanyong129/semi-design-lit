import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';
import { loadMdFile } from "../../../utils";

@customElement('switch-value')
export class SwitchValue extends LitElement {

  @state()
  _value?: string;

  @state()
  _code?: string;

  handleChange(ev: CustomEvent) {
    this._value = ev.detail.value;
  }

  async connectedCallback(): Promise<void> {
      super.connectedCallback();
      this._code = await loadMdFile('switch', 'value');
    }
  
  protected render() {
    return html`
      <h2>自定义开关的值</h2>
      <p>通过 checkedValue 和 uncheckedValue 可以自定义开关的值。</p>
      <code-demo>
        <a-space direction="vertical" size="large">
          <a-switch checkedValue="yes" uncheckedValue="no" @change="${this.handleChange}"></a-switch>
          <div>Current Value: ${ this._value }</div>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}