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

@customElement('time-picker-docs')
class TimePickerDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value = '10:30:00';

  @state()
  private _range: string[] = ['09:00:00', '18:00:00'];

  @state()
  private _twelve = '02:30:00 PM';

  @state()
  private _stepValue = '08:00:00';

  @state()
  private _sizeValue = '12:00:00';

  private _disabledHours = () => [0, 1, 2, 3, 4, 5, 6];

  private _disabledMinutes = (hour: number) => (hour === 8 ? [0, 15, 30] : []);

  protected render() {
    return html`
      <h1>时间选择器</h1>
      <p>时间选择器用于选择或输入时间，支持范围选择、12 小时制、步长与禁用时段。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/timepicker" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 value 受控，点击输入框展开面板，也可以直接输入时间后回车提交。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-time-picker
              .value=${this._value}
              @change=${(event: CustomEvent<{ value: string }>) => (this._value = event.detail.value)}
            ></semi-time-picker>
            <span style="color:var(--semi-color-text-2)">${this._value}</span>
          </div>
        `,
        `<semi-time-picker .value=\${value} @change=\${handleChange}></semi-time-picker>`
      )}

      ${section(
        '范围选择',
        'type 设置为 timeRange 时选择开始与结束时间，value 为两个时间字符串组成的数组。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-time-picker
              type="timeRange"
              .value=${this._range}
              @change=${(event: CustomEvent<{ value: string[] }>) => (this._range = event.detail.value)}
            ></semi-time-picker>
            <span style="color:var(--semi-color-text-2)">${this._range[0]} ~ ${this._range[1]}</span>
          </div>
        `,
        `<semi-time-picker type="timeRange" .value=\${['09:00:00', '18:00:00']}></semi-time-picker>`
      )}

      ${section(
        '12 小时制',
        'use12-hours 开启 12 小时制，面板增加上午/下午选择，默认格式为 a h:mm:ss。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-time-picker
              use12-hours
              .value=${this._twelve}
              @change=${(event: CustomEvent<{ value: string }>) => (this._twelve = event.detail.value)}
            ></semi-time-picker>
            <span style="color:var(--semi-color-text-2)">${this._twelve}</span>
          </div>
        `,
        `<semi-time-picker use12-hours .value=\${'02:30:00 PM'}></semi-time-picker>`
      )}

      ${section(
        '步长与禁用',
        '通过 hour-step、minute-step、second-step 控制可选粒度，disabled-hours/disabled-minutes 禁用部分时间。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-time-picker
              .value=${this._stepValue}
              .hourStep=${1}
              .minuteStep=${15}
              .disabledHours=${this._disabledHours}
              .disabledMinutes=${this._disabledMinutes}
              @change=${(event: CustomEvent<{ value: string }>) => (this._stepValue = event.detail.value)}
            ></semi-time-picker>
            <span style="color:var(--semi-color-text-2)">${this._stepValue}</span>
          </div>
        `,
        `<semi-time-picker .minuteStep=\${15} .disabledHours=\${disabledHours}></semi-time-picker>`
      )}

      ${section(
        '尺寸与状态',
        '通过 size、validate-status、borderless 和 disabled 调整外观与交互状态。',
        html`
          <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
            <semi-time-picker
              size="small"
              .value=${this._sizeValue}
              @change=${(event: CustomEvent<{ value: string }>) => (this._sizeValue = event.detail.value)}
            ></semi-time-picker>
            <semi-time-picker size="large" .value=${'14:20:00'}></semi-time-picker>
            <semi-time-picker validate-status="error" .value=${'23:00:00'}></semi-time-picker>
            <semi-time-picker validate-status="warning" .value=${'07:30:00'}></semi-time-picker>
            <semi-time-picker disabled .value=${'09:00:00'}></semi-time-picker>
          </div>
        `,
        `<semi-time-picker size="small" validate-status="error" disabled></semi-time-picker>`
      )}

      ${section(
        '面板头尾',
        'panelHeader 与 panelFooter 可以在面板上下插入自定义内容，适合快捷选择与说明。',
        html`
          <semi-time-picker
            .value=${'15:30:00'}
            .panelHeader=${html`<span style="padding:0 8px;color:var(--semi-color-text-2)">工作时间</span>`}
            .panelFooter=${html`<div style="padding:0 8px;color:var(--semi-color-text-2);font-size:12px">支持直接输入</div>`}
          ></semi-time-picker>
        `,
        `<semi-time-picker .panelHeader=\${header} .panelFooter=\${footer}></semi-time-picker>`
      )}
    `;
  }
}
