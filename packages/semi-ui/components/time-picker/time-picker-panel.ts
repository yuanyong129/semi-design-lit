import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';

const prefixCls = getPrefixCls('timepicker');
const p = unsafeCSS(prefixCls);

type TimePart = 'hour' | 'minute' | 'second' | 'meridiem';

@customElement('semi-time-picker-panel')
export class SemiTimePickerPanel extends LitElement {
  @property({ attribute: false })
  dates: Date[] = [];

  @property({ attribute: false })
  format: string = 'HH:mm:ss';

  @property({ attribute: 'use12-hours', type: Boolean })
  use12Hours = false;

  @property({ attribute: 'hour-step', type: Number })
  hourStep = 1;

  @property({ attribute: 'minute-step', type: Number })
  minuteStep = 1;

  @property({ attribute: 'second-step', type: Number })
  secondStep = 1;

  @property({ attribute: 'hide-disabled-options', type: Boolean })
  hideDisabledOptions = false;

  @property({ attribute: 'range', type: Boolean })
  range = false;

  @property({ type: Boolean })
  open = false;

  @property({ attribute: false })
  disabledHours?: () => number[];

  @property({ attribute: false })
  disabledMinutes?: (hour: number) => number[];

  @property({ attribute: false })
  disabledSeconds?: (hour: number, minute: number) => number[];

  @property({ attribute: false })
  panelHeader?: unknown;

  @property({ attribute: false })
  panelFooter?: unknown;

  private get _showHour() {
    return /[HhKk]/.test(this.format);
  }

  private get _showMinute() {
    return /m/.test(this.format);
  }

  private get _showSecond() {
    return /s/.test(this.format);
  }

  private _dateAt(index: number): Date {
    const candidate = this.dates[index] ?? this.dates[0];
    const date = candidate instanceof Date && !Number.isNaN(candidate.getTime())
      ? new Date(candidate)
      : new Date();
    return date;
  }

  private _isDisabled(part: TimePart, value: number, date: Date): boolean {
    if (part === 'hour') {
      return (this.disabledHours?.() ?? []).includes(value);
    }
    if (part === 'minute') {
      return (this.disabledMinutes?.(date.getHours()) ?? []).includes(value);
    }
    if (part === 'second') {
      return (this.disabledSeconds?.(date.getHours(), date.getMinutes()) ?? []).includes(value);
    }
    return false;
  }

  private _pick(part: TimePart, value: number, index: number) {
    if (this._isDisabled(part, value, this._dateAt(index))) return;
    const date = this._dateAt(index);
    if (part === 'hour') {
      if (this.use12Hours) {
        const afternoon = date.getHours() >= 12;
        const hour = value % 12;
        date.setHours(hour + (afternoon ? 12 : 0));
      } else {
        date.setHours(value);
      }
    } else if (part === 'minute') {
      date.setMinutes(value);
    } else if (part === 'second') {
      date.setSeconds(value);
    } else {
      const hour = date.getHours() % 12;
      date.setHours(value === 1 ? hour + 12 : hour);
    }
    this.dispatchEvent(new CustomEvent('time-select', {
      detail: { date, index },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderColumn(
    title: string,
    part: TimePart,
    values: number[],
    selected: number,
    index: number,
    label: (value: number) => string,
  ) {
    const date = this._dateAt(index);
    const items = values.filter((value) => !this.hideDisabledOptions || !this._isDisabled(part, value, date));
    return html`
      <div class="${p}-panel-list" role="listbox" aria-label=${title}>
        ${items.map((value) => {
          const disabled = this._isDisabled(part, value, date);
          return html`
            <div
              class="${p}-panel-item ${value === selected ? `${p}-panel-item-selected` : ''} ${disabled ? `${p}-panel-item-disabled` : ''}"
              role="option"
              aria-selected=${value === selected ? 'true' : 'false'}
              aria-disabled=${disabled ? 'true' : 'false'}
              @click=${() => this._pick(part, value, index)}
            >${label(value)}</div>
          `;
        })}
      </div>
    `;
  }

  private _renderPanel(index: number) {
    const date = this._dateAt(index);
    const hourValues = this.use12Hours
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i).filter((value) => value % this.hourStep === 0);
    const minuteValues = Array.from({ length: 60 }, (_, i) => i).filter((value) => value % this.minuteStep === 0);
    const secondValues = Array.from({ length: 60 }, (_, i) => i).filter((value) => value % this.secondStep === 0);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return html`
      <div class="${p}-panel">
        <div class="${p}-panel-header">
          ${this.range ? (index === 0 ? '开始时间' : '结束时间') : '选择时间'}
        </div>
        <div class="${p}-panel-body">
          ${this._showHour ? (this.use12Hours
            ? this._renderColumn('小时', 'hour', hourValues, hour % 12 || 12, index, (value) => String(value))
            : this._renderColumn('小时', 'hour', hourValues, hour, index, (value) => String(value).padStart(2, '0')))
            : nothing}
          ${this._showMinute
            ? this._renderColumn('分钟', 'minute', minuteValues, minute, index, (value) => String(value).padStart(2, '0'))
            : nothing}
          ${this._showSecond
            ? this._renderColumn('秒', 'second', secondValues, second, index, (value) => String(value).padStart(2, '0'))
            : nothing}
          ${this.use12Hours
            ? this._renderColumn('上午/下午', 'meridiem', [0, 1], hour >= 12 ? 1 : 0, index, (value) => (value ? '下午' : '上午'))
            : nothing}
        </div>
        ${this.panelFooter ? html`<div class="${p}-panel-footer">${this.panelFooter as any}</div>` : nothing}
      </div>
    `;
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (
      !changed.has('dates')
      && !changed.has('format')
      && !changed.has('use12Hours')
      && !changed.has('open')
    ) return;
    requestAnimationFrame(() => this._scrollSelected());
  }

  private _scrollSelected() {
    const lists = this.renderRoot.querySelectorAll<HTMLElement>(`.${p}-panel-list`);
    lists.forEach((list) => {
      const selected = list.querySelector<HTMLElement>(`.${p}-panel-item-selected`);
      if (!selected) return;
      const target = selected.offsetTop - list.clientHeight / 2 + selected.offsetHeight / 2;
      list.scrollTop = Math.max(0, target);
    });
  }

  render() {
    return html`
      <div class="${p}-panel-container ${this.range ? `${p}-panel-container-range` : ''}" part="panel">
        ${this.panelHeader ? html`<div class="${p}-panel-top">${this.panelHeader as any}</div>` : nothing}
        <div class="${p}-panel-group">
          ${this.range
            ? html`${this._renderPanel(0)}${this._renderPanel(1)}`
            : this._renderPanel(0)}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--semi-color-text-0);
      font-size: 14px;
    }

    .${p}-panel-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
    }

    .${p}-panel-container-range {
      gap: 12px;
    }

    .${p}-panel-group {
      display: flex;
      gap: 1px;
    }

    .${p}-panel-container-range .${p}-panel-group {
      gap: 12px;
    }

    .${p}-panel {
      min-width: 72px;
      display: flex;
      flex-direction: column;
    }

    .${p}-panel-header {
      padding: 8px 12px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      white-space: nowrap;
    }

    .${p}-panel-body {
      display: flex;
      gap: 2px;
    }

    .${p}-panel-list {
      position: relative;
      width: 56px;
      height: 208px;
      overflow-y: auto;
      padding: 4px;
      box-sizing: border-box;
      scrollbar-width: thin;
    }

    .${p}-panel-item {
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--semi-border-radius-small, 4px);
      color: var(--semi-color-text-0);
      cursor: pointer;
      user-select: none;
    }

    .${p}-panel-item:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-panel-item-selected {
      color: var(--semi-color-primary);
      background-color: var(--semi-color-primary-light-default);
      font-weight: 600;
    }

    .${p}-panel-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
      background: transparent;
    }

    .${p}-panel-top {
      color: var(--semi-color-text-2);
      font-size: 12px;
      padding: 0 4px;
    }

    .${p}-panel-footer {
      border-top: 1px solid var(--semi-color-border);
      margin-top: 4px;
      padding-top: 8px;
    }
  `;
}
