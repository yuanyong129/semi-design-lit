import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';

const prefixCls = getPrefixCls('date-picker-panel');
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

@customElement('semi-date-picker-panel')
export class SemiDatePickerPanel extends LitElement {
  @property()
  value?: string;

  @property({ attribute: 'view-date' })
  viewDate?: string;

  @state()
  private _view: Date = new Date();

  connectedCallback() {
    super.connectedCallback();
    this._syncView();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('viewDate') || changed.has('value')) {
      this._syncView();
    }
  }

  private _syncView() {
    const date = parseDate(this.viewDate) ?? parseDate(this.value) ?? new Date();
    this._view = new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private _moveMonth(delta: number) {
    this._view = new Date(this._view.getFullYear(), this._view.getMonth() + delta, 1);
    this.dispatchEvent(new CustomEvent('viewChange', {
      detail: { viewDate: toDateString(this._view) },
      bubbles: true,
      composed: true,
    }));
  }

  private _select(day: number) {
    const date = new Date(this._view.getFullYear(), this._view.getMonth(), day);
    this.dispatchEvent(new CustomEvent('select', {
      detail: { date: toDateString(date), value: date },
      bubbles: true,
      composed: true,
    }));
  }

  private _days(): Array<{ day: number; current: boolean; date: string }> {
    const year = this._view.getFullYear();
    const month = this._view.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number; current: boolean; date: string }> = [];

    for (let index = 0; index < firstWeekday; index++) {
      cells.push({ day: 0, current: false, date: '' });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        day,
        current: true,
        date: toDateString(new Date(year, month, day)),
      });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: 0, current: false, date: '' });
    }
    return cells;
  }

  render() {
    const today = toDateString(new Date());
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

    return html`
      <div class="${prefixCls}" part="panel">
        <div class="${prefixCls}-header">
          <button class="${prefixCls}-nav" type="button" aria-label="Previous month" @click=${() => this._moveMonth(-1)}>‹</button>
          <span class="${prefixCls}-title">${this._view.getFullYear()} 年 ${this._view.getMonth() + 1} 月</span>
          <button class="${prefixCls}-nav" type="button" aria-label="Next month" @click=${() => this._moveMonth(1)}>›</button>
        </div>
        <div class="${prefixCls}-weekdays">
          ${weekdays.map((day) => html`<span>${day}</span>`)}
        </div>
        <div class="${prefixCls}-days">
          ${this._days().map((cell) => cell.current
            ? html`<button
                class="${prefixCls}-day ${cell.date === this.value ? `${prefixCls}-day-selected` : ''} ${cell.date === today ? `${prefixCls}-day-today` : ''}"
                type="button"
                @click=${() => this._select(cell.day)}
              >${cell.day}</button>`
            : html`<span class="${prefixCls}-blank"></span>`)}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      width: 280px;
      padding: 12px;
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
    }

    .${p}-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .${p}-title {
      font-size: 14px;
      font-weight: 600;
    }

    .${p}-nav {
      width: 28px;
      height: 28px;
      color: var(--semi-color-text-2);
      font-size: 18px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-nav:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-weekdays,
    .${p}-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .${p}-weekdays {
      margin-bottom: 4px;
    }

    .${p}-weekdays span {
      color: var(--semi-color-text-3);
      font-size: 12px;
      line-height: 28px;
      text-align: center;
    }

    .${p}-day {
      height: 32px;
      padding: 0;
      color: var(--semi-color-text-0);
      font-size: 13px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-day:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-day-selected {
      color: var(--semi-color-white);
      background-color: var(--semi-color-primary);
    }

    .${p}-day-today {
      color: var(--semi-color-primary);
      font-weight: 600;
    }

    .${p}-day-selected.${p}-day-today {
      color: var(--semi-color-white);
    }

    .${p}-blank {
      height: 32px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-date-picker-panel': SemiDatePickerPanel
  }
}
