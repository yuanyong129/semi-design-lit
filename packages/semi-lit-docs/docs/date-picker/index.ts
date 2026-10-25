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

@customElement('date-picker-docs')
class DatePickerDocs extends LitElement {
  @state()
  private _value = '2026-10-25';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>日期选择器</h1>
      <p>DatePicker 通过日历面板选择日期，支持格式化、清除与自定义展示格式。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/datepicker" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '点击选择日期，选择后自动关闭并触发 change。',
        html`
          <semi-date-picker
            .value=${this._value}
            @change=${(event: CustomEvent) => (this._value = event.detail.value ?? '')}
            style="max-width: 280px;"
          ></semi-date-picker>
          <semi-tag style="margin-left: 12px;">${this._value || '未选择'}</semi-tag>
        `,
        `<semi-date-picker .value=\${value} @change=\${onChange}></semi-date-picker>`
      )}

      ${section(
        '自定义格式',
        '通过 format 控制展示格式，默认 YYYY-MM-DD。',
        html`
          <semi-date-picker format="YYYY 年 MM 月 DD 日" default-value="2026-10-25" style="max-width: 280px;"></semi-date-picker>
        `,
        `<semi-date-picker format="YYYY 年 MM 月 DD 日" default-value="2026-10-25"></semi-date-picker>`
      )}

      ${section(
        '尺寸与禁用',
        'size 控制尺寸，disabled 禁用选择。',
        html`
          <semi-space direction="vertical">
            <semi-date-picker size="small" style="max-width: 280px;"></semi-date-picker>
            <semi-date-picker disabled default-value="2026-10-25" style="max-width: 280px;"></semi-date-picker>
          </semi-space>
        `,
        `<semi-date-picker size="small"></semi-date-picker>
<semi-date-picker disabled></semi-date-picker>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'date-picker-docs': DatePickerDocs
  }
}
