import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

@customElement('radio-group')
export class RadioGroup extends LitElement {
  _code = `<a-space direction="vertical" size="large">
  <a-radio-group>
    <a-radio value="A">A</a-radio>
    <a-radio value="B">B</a-radio>
    <a-radio value="C">C</a-radio>
    <a-radio value="D">D</a-radio>
  </a-radio-group>
  <a-radio-group>
    <a-radio value="A">A</a-radio>
    <a-radio value="B">B</a-radio>
    <a-radio value="C">C</a-radio>
    <a-radio value="D" disabled>D</a-radio>
  </a-radio-group>
</a-space>`;

  protected render() {
    return html`
      <h2>单选框组</h2>
      <p>通过  &lt;a-radio-group&gt; 组件展示单选框组。</p>
      <code-demo>
        <a-space direction="vertical" size="large">
          <a-radio-group>
            <a-radio value="A">A</a-radio>
            <a-radio value="B">B</a-radio>
            <a-radio value="C">C</a-radio>
            <a-radio value="D">D</a-radio>
          </a-radio-group>
         <a-radio-group>
            <a-radio value="A">A</a-radio>
            <a-radio value="B">B</a-radio>
            <a-radio value="C">C</a-radio>
            <a-radio value="D" disabled>D</a-radio>
          </a-radio-group>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}