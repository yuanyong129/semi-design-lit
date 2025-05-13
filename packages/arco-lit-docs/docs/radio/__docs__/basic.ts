import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

@customElement('radio-basic')
export class RadioBasic extends LitElement {
  _code = `<a-space size="large">
  <a-radio value="radio">Radio</a-radio>
  <a-radio value="disabled radio" .defaultChecked="${true}" disabled>Disabled Radio</a-radio>
</a-space>`;

  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>单选框的基本用法。</p>
      <code-demo>
        <a-space size="large">
          <a-radio value="radio">Radio</a-radio>
          <a-radio value="disabled radio" .defaultChecked="${true}" disabled>Disabled Radio</a-radio>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}