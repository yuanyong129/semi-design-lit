import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

@customElement('pin-code-docs')
class PinCodeDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value = '';

  @state()
  private _complete = '';

  @state()
  private _controlled = '246810';

  private _handleChange(event: CustomEvent<{ value: string }>) {
    this._value = event.detail.value;
    if (event.detail.value.length < 6) this._complete = '';
  }

  private _handleComplete(event: CustomEvent<{ value: string }>) {
    this._complete = event.detail.value;
  }

  protected render() {
    return html`
      <h1>验证码输入框</h1>
      <p>验证码输入框用于分段录入数字或字符，支持位数、格式校验、状态、粘贴与键盘操作。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/pincode" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认 6 位数字，输入完成后触发 complete 事件。',
        html`
          <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
            <semi-pin-code
              .autoFocus=${false}
              @change=${this._handleChange}
              @complete=${this._handleComplete}
            ></semi-pin-code>
            <semi-space>
              <semi-tag>当前输入：${this._value || '空'}</semi-tag>
              <semi-tag color="green">完成值：${this._complete || '未完成'}</semi-tag>
            </semi-space>
          </div>
        `,
        `<semi-pin-code .autoFocus=\${false} @change=\${handleChange} @complete=\${handleComplete}></semi-pin-code>`
      )}

      ${section(
        '位数与格式',
        'count 控制位数；format 支持 number、mixed、正则或校验函数。',
        html`
          <semi-space align="center" spacing={24} wrap>
            <semi-pin-code count="4" .autoFocus=${false}></semi-pin-code>
            <semi-pin-code
              .format=${'mixed'}
              .defaultValue=${'A1b2'}
              .autoFocus=${false}
            ></semi-pin-code>
          </semi-space>
        `,
        `<semi-pin-code count="4"></semi-pin-code>
<semi-pin-code .format=\${'mixed'} .defaultValue=\${'A1b2'}></semi-pin-code>`
      )}

      ${section(
        '尺寸',
        'size 支持 small、default、large。',
        html`
          <semi-space align="center" spacing={24} wrap>
            <semi-pin-code size="small" count="4" .autoFocus=${false}></semi-pin-code>
            <semi-pin-code count="4" .autoFocus=${false}></semi-pin-code>
            <semi-pin-code size="large" count="4" .autoFocus=${false}></semi-pin-code>
          </semi-space>
        `,
        `<semi-pin-code size="small" count="4"></semi-pin-code>
<semi-pin-code size="large" count="4"></semi-pin-code>`
      )}

      ${section(
        '校验状态',
        'validateStatus 支持 error 与 warning，disabled 禁用全部输入。',
        html`
          <semi-space align="center" spacing={24} wrap>
            <semi-pin-code
              count="4"
              validate-status="error"
              .defaultValue=${'12'}
              .autoFocus=${false}
            ></semi-pin-code>
            <semi-pin-code
              count="4"
              validate-status="warning"
              .defaultValue=${'34'}
              .autoFocus=${false}
            ></semi-pin-code>
            <semi-pin-code count="4" .defaultValue=${'5678'} .disabled=${true}></semi-pin-code>
          </semi-space>
        `,
        `<semi-pin-code validate-status="error"></semi-pin-code>
<semi-pin-code validate-status="warning"></semi-pin-code>
<semi-pin-code disabled .defaultValue=\${'5678'}></semi-pin-code>`
      )}

      ${section(
        '受控与粘贴',
        'value 受控时由外部维护值；支持粘贴整段验证码并自动分配。',
        html`
          <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
            <semi-pin-code
              .value=${this._controlled}
              .autoFocus=${false}
              @change=${(event: CustomEvent<{ value: string }>) => (this._controlled = event.detail.value)}
            ></semi-pin-code>
            <semi-space>
              <semi-tag color="blue">受控值：${this._controlled || '空'}</semi-tag>
              <semi-button size="small" @click=${() => (this._controlled = '')}>清空</semi-button>
            </semi-space>
          </div>
        `,
        `<semi-pin-code .value=\${value} @change=\${handleChange}></semi-pin-code>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pin-code-docs': PinCodeDocs;
  }
}
