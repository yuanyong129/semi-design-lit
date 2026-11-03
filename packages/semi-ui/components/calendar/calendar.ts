import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CalendarEvent } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import '../../../semi-icons/build/left';
import '../../../semi-icons/build/right';

const prefixCls = getPrefixCls('calendar');
const p = unsafeCSS(prefixCls);

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return undefined;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

@customElement('semi-calendar')
export class SemiCalendar extends LitElement {
  /**
   * @zh 当前日期（YYYY-MM-DD）
   * @en Current date (YYYY-MM-DD)
   */
  @property()
  value?: string;

  /**
   * @zh 默认日期
   * @en Default date
   */
  @property({ attribute: 'default-value' })
  defaultValue?: string;

  /**
   * @zh 日历事件
   * @en Calendar events
   */
  @property({ attribute: false })
  events: CalendarEvent[] = [];

  /**
   * @zh 禁用日期
   * @en Disabled date
   */
  @property({ attribute: false })
  disabledDate?: (date: Date) => boolean;

  @state()
  private _value?: string;

  @state()
  private _view: Date = new Date();

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue;
    const date = parseDate(this.value ?? this.defaultValue) ?? new Date();
    this._view = new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private get _currentValue(): string | undefined {
    return this.value ?? this._value;
  }

  private _moveMonth(delta: number) {
    this._view = new Date(this._view.getFullYear(), this._view.getMonth() + delta, 1);
  }

  private _select(date: Date) {
    if (this.disabledDate?.(date)) return;
    const value = toDateString(date);
    if (this.value === undefined) {
      this._value = value;
    }
    this._view = new Date(date.getFullYear(), date.getMonth(), 1);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value, date },
      bubbles: true,
      composed: true,
    }));
  }

  private _today() {
    this._select(new Date());
  }

  private _days(): Date[] {
    const year = this._view.getFullYear();
    const month = this._view.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - offset);
    return Array.from({ length: 42 }, (_, index) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    );
  }

  private _eventsFor(date: string): CalendarEvent[] {
    return this.events.filter((event) => event.date === date);
  }

  render() {
    const today = toDateString(new Date());
    const current = this._currentValue;
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

    return html`
      <div class="${prefixCls}" part="calendar">
        <div class="${prefixCls}-header">
          <div class="${prefixCls}-title">
            <button class="${prefixCls}-nav" type="button" aria-label="Previous month" @click=${() => this._moveMonth(-1)}>
              <semi-icon-left></semi-icon-left>
            </button>
            <span class="${prefixCls}-month">${this._view.getFullYear()} 年 ${this._view.getMonth() + 1} 月</span>
            <button class="${prefixCls}-nav" type="button" aria-label="Next month" @click=${() => this._moveMonth(1)}>
              <semi-icon-right></semi-icon-right>
            </button>
          </div>
          <button class="${prefixCls}-today" type="button" @click=${this._today}>今天</button>
        </div>
        <div class="${prefixCls}-weekdays">
          ${weekdays.map((day) => html`<span>${day}</span>`)}
        </div>
        <div class="${prefixCls}-grid">
          ${this._days().map((date) => {
            const value = toDateString(date);
            const inMonth = date.getMonth() === this._view.getMonth();
            const selected = value === current;
            const isToday = value === today;
            const disabled = this.disabledDate?.(date) ?? false;
            return html`
              <div
                class="${prefixCls}-cell ${inMonth ? '' : `${prefixCls}-cell-outside`} ${selected ? `${prefixCls}-cell-selected` : ''} ${disabled ? `${prefixCls}-cell-disabled` : ''}"
                role="button"
                tabindex=${disabled ? '-1' : '0'}
                aria-label=${value}
                @click=${() => this._select(date)}
                @keydown=${(event: KeyboardEvent) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this._select(date);
                  }
                }}
              >
                <span class="${prefixCls}-date ${isToday ? `${prefixCls}-date-today` : ''}">${date.getDate()}</span>
                <div class="${prefixCls}-events">
                  ${this._eventsFor(value).map((event) => html`
                    <span class="${prefixCls}-event ${prefixCls}-event-${event.type ?? 'info'}" title=${event.content}>${event.content}</span>
                  `)}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      width: 100%;
      overflow: hidden;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: 6px;
    }

    .${p}-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .${p}-month {
      min-width: 110px;
      color: var(--semi-color-text-0);
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }

    .${p}-nav {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      color: var(--semi-color-text-2);
      font-size: 12px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-nav:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-today {
      padding: 4px 12px;
      color: var(--semi-color-primary);
      font-family: inherit;
      font-size: 13px;
      background: transparent;
      border: 1px solid var(--semi-color-primary);
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-today:hover {
      background-color: var(--semi-color-primary-light-default);
    }

    .${p}-weekdays,
    .${p}-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .${p}-weekdays {
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-weekdays span {
      padding: 8px 0;
      color: var(--semi-color-text-3);
      font-size: 12px;
      text-align: center;
    }

    .${p}-cell {
      box-sizing: border-box;
      min-height: 72px;
      padding: 6px;
      overflow: hidden;
      border-right: 1px solid var(--semi-color-border);
      border-bottom: 1px solid var(--semi-color-border);
      cursor: pointer;
    }

    .${p}-cell:nth-child(7n) {
      border-right: none;
    }

    .${p}-cell:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-cell-outside {
      color: var(--semi-color-text-3);
      background-color: var(--semi-color-fill-0);
    }

    .${p}-cell-selected {
      background-color: var(--semi-color-primary-light-default);
    }

    .${p}-cell-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-date {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: inherit;
      font-size: 13px;
      border-radius: 50%;
    }

    .${p}-date-today {
      color: var(--semi-color-white);
      background-color: var(--semi-color-primary);
    }

    .${p}-events {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .${p}-event {
      overflow: hidden;
      padding: 0 4px;
      color: var(--semi-color-text-0);
      font-size: 11px;
      line-height: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 2px;
    }

    .${p}-event-info {
      background-color: var(--semi-color-info-light-default);
    }

    .${p}-event-success {
      background-color: var(--semi-color-success-light-default);
    }

    .${p}-event-warning {
      background-color: var(--semi-color-warning-light-default);
    }

    .${p}-event-danger {
      background-color: var(--semi-color-danger-light-default);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-calendar': SemiCalendar
  }
}
