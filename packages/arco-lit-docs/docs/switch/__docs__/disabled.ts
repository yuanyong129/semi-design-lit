import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = 
`<a-space size="large">
  <a-switch disabled></a-switch>
  <a-switch .defaultChecked=${true} disabled></a-switch>
  <a-switch type="round" disabled></a-switch>
  <a-switch .defaultChecked=${true} type="round" disabled></a-switch>
  <a-switch type="line" disabled></a-switch>
  <a-switch .defaultChecked=${true} type="line" disabled></a-switch>
</a-space>`;

@customElement('switch-disabled')
export class SwitchDisabled extends LitElement {
  protected render() {
    return html`
      <h2>禁用状态</h2>
      <p>禁用开关。</p>
      <code-demo>
        <a-space size="large">
          <a-switch disabled></a-switch>
          <a-switch .defaultChecked=${true} disabled></a-switch>
          <a-switch type="round" disabled></a-switch>
          <a-switch .defaultChecked=${true} type="round" disabled></a-switch>
          <a-switch type="line" disabled></a-switch>
          <a-switch .defaultChecked=${true} type="line" disabled></a-switch>
        </a-space>
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
