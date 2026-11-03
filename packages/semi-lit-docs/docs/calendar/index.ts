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

@customElement('calendar-docs')
class CalendarDocs extends LitElement {
  @state()
  private _value = '2026-11-15';

  private get _events() {
    return [
      { date: '2026-11-05', content: '版本发布', type: 'success' },
      { date: '2026-11-15', content: '团队评审', type: 'info' },
      { date: '2026-11-20', content: '截止日期', type: 'danger' },
      { date: '2026-11-26', content: '感恩节', type: 'warning' },
    ];
  }

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>日历</h1>
      <p>Calendar 以月视图展示日期与事件，支持切换月份、选择日期和禁用日期。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/calendar" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '点击日期选中，事件通过 events 配置展示。',
        html`
          <semi-calendar
            .value=${this._value}
            .events=${this._events}
            @change=${(event: CustomEvent) => (this._value = event.detail.value)}
          ></semi-calendar>
          <semi-tag style="margin-top: 12px;">当前日期：${this._value}</semi-tag>
        `,
        `<semi-calendar .value=\${value} .events=\${events}
  @change=\${onChange}></semi-calendar>`
      )}

      ${section(
        '禁用日期',
        '通过 disabledDate 禁用周末，禁用日期不可点击。',
        html`
          <semi-calendar
            default-value="2026-11-15"
            .disabledDate=${(date: Date) => date.getDay() === 0 || date.getDay() === 6}
          ></semi-calendar>
        `,
        `<semi-calendar .disabledDate=\${(date) =>
  date.getDay() === 0 || date.getDay() === 6}></semi-calendar>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-docs': CalendarDocs
  }
}
