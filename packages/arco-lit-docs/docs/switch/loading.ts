import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../components/code-content/index';

const code =
`<a-space size="large">
  <a-switch loading></a-switch>
  <a-switch type="round" loading></a-switch>
  <a-switch type="line" loading></a-switch>
</a-space>`;

@customElement('switch-loading')
export class SwitchLoading extends LitElement {
  protected render(): unknown {
    return html`
      <h2>加载中状态</h2>
      <p>通过设置 loading 使开关处于加载中状态，此时开关不可点击。</p>
      <a-space size="large">
        <a-switch loading></a-switch>
        <a-switch type="round" loading></a-switch>
        <a-switch type="line" loading></a-switch>
      </a-space>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
