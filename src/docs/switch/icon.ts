import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../icon/build/check';
import '../../icon/build/close';
import '../code-content/index';

const code =
`<a-space size="large">
  <a-switch>
    <icon-check slot="checked-icon"></icon-check>
    <icon-close slot="unchecked-icon"></icon-close>
  </a-switch>
  <a-switch type="round">
    <icon-check slot="checked-icon"></icon-check>
    <icon-close slot="unchecked-icon"></icon-close>
  </a-switch>
  <a-switch type="line">
    <icon-check slot="checked-icon"></icon-check>
    <icon-close slot="unchecked-icon"></icon-close>
  </a-switch>
</a-space>`;

@customElement('switch-icon')
export class SwitchIcon extends LitElement {

  protected render() {
    return html`
      <h2>自定义图标</h2>
      <p>自定义开关按钮上显示的图标。</p>
      <a-space size="large">
        <a-switch>
          <icon-check slot="checked-icon"></icon-check>
          <icon-close slot="unchecked-icon"></icon-close>
        </a-switch>
        <a-switch type="round">
          <icon-check slot="checked-icon"></icon-check>
          <icon-close slot="unchecked-icon"></icon-close>
        </a-switch>
        <a-switch type="line">
          <icon-check slot="checked-icon"></icon-check>
          <icon-close slot="unchecked-icon"></icon-close>
        </a-switch>
      </a-space>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
