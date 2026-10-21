import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <h2>${title}</h2>
    <p>${description}</p>
    <code-demo>${demo}</code-demo>
    <code-content .code=${code}></code-content>
  `;
}

@customElement('switch-docs')
class SwitchDocs extends LitElement {
  @state()
  private _checked = true;

  private _handleChange(ev: CustomEvent<{ checked: boolean }>) {
    this._checked = ev.detail.checked;
  }

  protected render() {
    return html`
      <h1>开关 Switch</h1>
      <p>开关用于在两个互斥状态之间切换，支持文案、尺寸、加载与禁用状态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/switch" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认未选中，点击切换状态并触发 change 事件。',
        html`
          <semi-space>
            <semi-switch></semi-switch>
            <semi-switch default-checked></semi-switch>
          </semi-space>
        `,
        `<semi-switch></semi-switch>
<semi-switch default-checked></semi-switch>`
      )}

      ${section(
        '尺寸',
        '支持 small、default、large 三种尺寸。',
        html`
          <semi-space align="center">
            <semi-switch size="small"></semi-switch>
            <semi-switch></semi-switch>
            <semi-switch size="large"></semi-switch>
          </semi-space>
        `,
        `<semi-switch size="small"></semi-switch>
<semi-switch></semi-switch>
<semi-switch size="large"></semi-switch>`
      )}

      ${section(
        '带文案',
        '通过 checked-text 与 unchecked-text 设置开关内的文案。',
        html`
          <semi-space>
            <semi-switch checked-text="开" unchecked-text="关"></semi-switch>
            <semi-switch size="large" checked-text="ON" unchecked-text="OFF" default-checked></semi-switch>
          </semi-space>
        `,
        `<semi-switch checked-text="开" unchecked-text="关"></semi-switch>`
      )}

      ${section(
        '受控用法',
        '通过 checked 与 change 事件实现受控切换。',
        html`
          <semi-space align="center">
            <semi-switch .checked=${this._checked} @change=${this._handleChange}></semi-switch>
            <semi-tag color="blue">当前：${this._checked ? '开' : '关'}</semi-tag>
          </semi-space>
        `,
        `<semi-switch .checked=\${checked} @change=\${handleChange}></semi-switch>`
      )}

      ${section(
        '加载与禁用',
        'loading 显示加载图标，disabled 禁止切换。',
        html`
          <semi-space>
            <semi-switch loading></semi-switch>
            <semi-switch loading default-checked></semi-switch>
            <semi-switch disabled></semi-switch>
            <semi-switch disabled default-checked></semi-switch>
          </semi-space>
        `,
        `<semi-switch loading></semi-switch>
<semi-switch disabled></semi-switch>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'switch-docs': SwitchDocs
  }
}
