import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

@customElement('input-number-docs')
class InputNumberDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>数字输入框</h1>
      <p>InputNumber 用于数字输入，支持步进、范围限制、精度与尺寸。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/inputnumber" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 step 设置步进值，hover / focus 时显示上下调节按钮。',
        html`
          <semi-input-number default-value=${3} step=${1} style="width: 240px;"></semi-input-number>
        `,
        `<semi-input-number default-value="3" step="1"></semi-input-number>`
      )}

      ${section(
        '范围与精度',
        'min / max 限制范围，precision 控制小数位数。',
        html`
          <semi-space direction="vertical">
            <semi-input-number min=${0} max=${100} step=${5} default-value=${50} style="width: 240px;"></semi-input-number>
            <semi-input-number precision=${2} step=${0.1} default-value=${1.5} style="width: 240px;"></semi-input-number>
          </semi-space>
        `,
        `<semi-input-number min="0" max="100" step="5"></semi-input-number>
<semi-input-number precision="2" step="0.1"></semi-input-number>`
      )}

      ${section(
        '尺寸与禁用',
        'size 支持 small / default / large；disabled 禁用输入与调节。',
        html`
          <semi-space direction="vertical">
            <semi-input-number size="small" default-value=${1} style="width: 200px;"></semi-input-number>
            <semi-input-number size="large" default-value=${1} style="width: 200px;"></semi-input-number>
            <semi-input-number disabled default-value=${1} style="width: 200px;"></semi-input-number>
          </semi-space>
        `,
        `<semi-input-number size="large"></semi-input-number>
<semi-input-number disabled></semi-input-number>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-number-docs': InputNumberDocs
  }
}
