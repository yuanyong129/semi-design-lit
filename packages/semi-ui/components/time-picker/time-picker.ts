import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import '../trigger/trigger';
import './time-picker-panel';
import '../../../semi-icons/build/close';
import type {
  TimePickerChangeDetail,
  TimePickerDisabledHours,
  TimePickerDisabledMinutes,
  TimePickerDisabledSeconds,
  TimePickerSize,
  TimePickerType,
  TimePickerValidateStatus,
  TimePickerValue,
} from './interface';

const prefixCls = getPrefixCls('timepicker');
const p = unsafeCSS(prefixCls);

const timeValueConverter = {
  fromAttribute(value: string | null): TimePickerValue | TimePickerValue[] | undefined {
    if (value == null) return undefined;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as TimePickerValue[];
    } catch {
      // Treat non-JSON attributes as a single formatted value.
    }
    return value;
  },
  toAttribute(value: TimePickerValue | TimePickerValue[] | undefined): string | null {
    if (value == null) return null;
    if (Array.isArray(value)) {
      return JSON.stringify(value.map((item) => (item instanceof Date ? item.toISOString() : item)));
    }
    return value instanceof Date ? value.toISOString() : String(value);
  },
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDate(date: Date, format: string): string {
  const hours = date.getHours();
  const tokens: Record<string, string> = {
    HH: pad(hours),
    H: String(hours),
    hh: pad(hours % 12 || 12),
    h: String(hours % 12 || 12),
    mm: pad(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: pad(date.getSeconds()),
    s: String(date.getSeconds()),
    a: hours < 12 ? 'AM' : 'PM',
    A: hours < 12 ? 'AM' : 'PM',
  };
  return format.replace(/HH|H|hh|h|mm|m|ss|s|a|A/g, (token) => tokens[token] ?? token);
}

function parseTime(text: string, format: string, base: Date): Date | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const numbers = trimmed.match(/\d+/g)?.map(Number) ?? [];
  if (!numbers.length) return null;
  const date = new Date(base);
  const hasAmPm = /am|pm/i.test(trimmed);
  const isPm = /pm/i.test(trimmed);
  let index = 0;
  if (/[HhKk]/.test(format)) {
    let hour = numbers[index++];
    if (!Number.isFinite(hour)) return null;
    if (/[hKk]/.test(format) || hasAmPm) {
      hour = hour % 12;
      if (isPm) hour += 12;
    }
    date.setHours(hour);
  }
  if (/m/.test(format) && index < numbers.length) {
    date.setMinutes(numbers[index++]);
  }
  if (/s/.test(format) && index < numbers.length) {
    date.setSeconds(numbers[index++]);
  }
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeValues(value: TimePickerValue | TimePickerValue[] | undefined): TimePickerValue[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

@customElement('semi-time-picker')
export class SemiTimePicker extends LitElement {
  @property({ attribute: 'type' })
  type: TimePickerType = 'time';

  @property({ converter: timeValueConverter })
  value?: TimePickerValue | TimePickerValue[];

  @property({ attribute: 'default-value', converter: timeValueConverter })
  defaultValue?: TimePickerValue | TimePickerValue[];

  @property()
  format?: string;

  @property({ attribute: 'use12-hours', type: Boolean })
  use12Hours = false;

  @property({ attribute: 'hour-step', type: Number })
  hourStep = 1;

  @property({ attribute: 'minute-step', type: Number })
  minuteStep = 1;

  @property({ attribute: 'second-step', type: Number })
  secondStep = 1;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  open?: boolean;

  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen = false;

  @property({ attribute: 'show-clear', type: Boolean })
  showClear = true;

  @property()
  placeholder?: string;

  @property()
  size: TimePickerSize = 'default';

  @property({ attribute: 'validate-status' })
  validateStatus: TimePickerValidateStatus = 'default';

  @property({ type: Boolean })
  borderless = false;

  @property({ attribute: 'input-read-only', type: Boolean })
  inputReadOnly = false;

  @property({ attribute: 'auto-focus', type: Boolean })
  autoFocus = false;

  @property({ attribute: 'focus-on-open', type: Boolean })
  focusOnOpen = false;

  @property()
  position: string = 'bottomLeft';

  @property({ attribute: 'range-separator' })
  rangeSeparator = ' ~ ';

  @property({ attribute: 'hide-disabled-options', type: Boolean })
  hideDisabledOptions = false;

  @property({ attribute: 'inset-label' })
  insetLabel?: string;

  @property({ attribute: 'picker-label' })
  pickerLabel?: string;

  @property({ attribute: false })
  disabledHours?: TimePickerDisabledHours;

  @property({ attribute: false })
  disabledMinutes?: TimePickerDisabledMinutes;

  @property({ attribute: false })
  disabledSeconds?: TimePickerDisabledSeconds;

  @property({ attribute: false })
  panelHeader?: unknown;

  @property({ attribute: false })
  panelFooter?: unknown;

  @state()
  private _dates: Date[] = [];

  @state()
  private _inputValue = '';

  @state()
  private _open = false;

  @state()
  private _focused = false;

  @state()
  private _hovering = false;

  @state()
  private _invalid = false;

  private _initialized = false;

  @query('input')
  private _input?: HTMLInputElement;

  private get _effectiveFormat() {
    return this.format || (this.use12Hours ? 'a h:mm:ss' : 'HH:mm:ss');
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (!this._initialized) {
      this._initialized = true;
      this._dates = this._parseValue(this.value ?? this.defaultValue);
      this._inputValue = this._formatDates(this._dates);
      this._open = this.open ?? this.defaultOpen;
      return;
    }
    if (changed.has('value')) {
      this._dates = this._parseValue(this.value);
      this._inputValue = this._formatDates(this._dates);
    }
    if (changed.has('open') && this.open !== undefined) {
      this._open = this.open;
    }
    if (changed.has('format') || changed.has('use12Hours')) {
      this._inputValue = this._formatDates(this._dates);
    }
  }

  protected firstUpdated() {
    if (this.autoFocus) this._input?.focus();
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  blur() {
    this._input?.blur();
  }

  private _isRange() {
    return this.type === 'timeRange';
  }

  private _parseValue(value: TimePickerValue | TimePickerValue[] | undefined): Date[] {
    return normalizeValues(value)
      .map((item) => this._parseSingle(item))
      .filter((item): item is Date => item instanceof Date);
  }

  private _parseSingle(value: TimePickerValue): Date | null {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value);
    if (typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const fromDateString = new Date(trimmed);
      if (!Number.isNaN(fromDateString.getTime()) && (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed) || /T\d{2}:\d{2}/.test(trimmed))) {
        return fromDateString;
      }
      const date = parseTime(trimmed, this._effectiveFormat, new Date());
      return date ?? (Number.isNaN(fromDateString.getTime()) ? null : fromDateString);
    }
    return null;
  }

  private _formatDates(dates: Date[]): string {
    if (this._isRange()) {
      return [0, 1]
        .map((index) => (dates[index] ? formatDate(dates[index], this._effectiveFormat) : ''))
        .join(this.rangeSeparator);
    }
    return dates[0] ? formatDate(dates[0], this._effectiveFormat) : '';
  }

  private _detailValue(): string | string[] {
    if (!this._isRange()) return this._dates[0] ? formatDate(this._dates[0], this._effectiveFormat) : '';
    return [0, 1].map((index) => (this._dates[index] ? formatDate(this._dates[index], this._effectiveFormat) : ''));
  }

  private _detailDate(): Date | Date[] {
    if (!this._isRange()) return this._dates[0] as Date;
    return this._dates.slice(0, 2);
  }

  private _emitChange() {
    this.dispatchEvent(new CustomEvent<TimePickerChangeDetail>('change', {
      detail: { value: this._detailValue(), date: this._detailDate() },
      bubbles: true,
      composed: true,
    }));
  }

  private _setOpen(open: boolean) {
    const next = this.open !== undefined ? this.open : open;
    if (this._open === next) return;
    this._open = next;
    if (next && this.focusOnOpen) {
      requestAnimationFrame(() => this._input?.focus());
    }
    this.dispatchEvent(new CustomEvent('open-change', {
      detail: { open: next },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleTriggerOpenChange = (event: CustomEvent<{ open: boolean }>) => {
    if (this.open !== undefined) return;
    this._open = event.detail.open;
    if (this._open && this.focusOnOpen) {
      requestAnimationFrame(() => this._input?.focus());
    }
  };

  private _handleFocus() {
    this._focused = true;
    this._setOpen(true);
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private _handleBlur() {
    this._focused = false;
    this._commitInput();
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private _handleInput(event: Event) {
    this._inputValue = (event.target as HTMLInputElement).value;
    this._invalid = false;
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this._commitInput();
      this._setOpen(false);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this._setOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._setOpen(true);
    }
  }

  private _commitInput(): boolean {
    const raw = this._inputValue.trim();
    if (this._isRange()) {
      const parts = raw.split(this.rangeSeparator).map((part) => part.trim());
      const next: Date[] = [];
      for (let index = 0; index < Math.min(parts.length, 2); index += 1) {
        if (!parts[index]) continue;
        const parsed = parseTime(parts[index], this._effectiveFormat, this._dates[index] ?? new Date());
        if (!parsed) {
          this._invalid = true;
          return false;
        }
        next[index] = parsed;
      }
      if (parts.some((part) => part && !parseTime(part, this._effectiveFormat, this._dates[0] ?? new Date()))) {
        this._invalid = true;
        return false;
      }
      this._dates = next;
    } else {
      if (!raw) {
        this._dates = [];
      } else {
        const parsed = parseTime(raw, this._effectiveFormat, this._dates[0] ?? new Date());
        if (!parsed) {
          this._invalid = true;
          return false;
        }
        this._dates = [parsed];
      }
    }
    this._inputValue = this._formatDates(this._dates);
    this._invalid = false;
    this._emitChange();
    return true;
  }

  private _handleClear(event: MouseEvent) {
    event.stopPropagation();
    this._dates = [];
    this._inputValue = '';
    this._invalid = false;
    this.dispatchEvent(new CustomEvent('clear', {
      detail: { value: '', event },
      bubbles: true,
      composed: true,
    }));
    this._emitChange();
    this._input?.focus();
  }

  private _handlePanelSelect = (event: CustomEvent<{ date: Date; index: number }>) => {
    const next = this._dates.slice();
    next[event.detail.index] = event.detail.date;
    if (!this._isRange()) next.length = 1;
    this._dates = next;
    this._inputValue = this._formatDates(next);
    this._invalid = false;
    this._emitChange();
  };

  private _renderPanel() {
    return html`
      <semi-time-picker-panel
        .dates=${this._dates}
        .format=${this._effectiveFormat}
        ?range=${this._isRange()}
        ?open=${this._open}
        ?use12-hours=${this.use12Hours}
        .hourStep=${this.hourStep}
        .minuteStep=${this.minuteStep}
        .secondStep=${this.secondStep}
        ?hide-disabled-options=${this.hideDisabledOptions}
        .disabledHours=${this.disabledHours}
        .disabledMinutes=${this.disabledMinutes}
        .disabledSeconds=${this.disabledSeconds}
        .panelHeader=${this.panelHeader}
        .panelFooter=${this.panelFooter}
        @time-select=${this._handlePanelSelect}
      ></semi-time-picker-panel>
    `;
  }

  private _renderClear() {
    if (!this.showClear || !this._inputValue || this.disabled) return nothing;
    return html`
      <button
        class="${p}-clear"
        type="button"
        aria-label="清除时间"
        tabindex="-1"
        @mousedown=${(event: MouseEvent) => event.preventDefault()}
        @click=${this._handleClear}
      >
        <semi-icon-close></semi-icon-close>
      </button>
    `;
  }

  render() {
    const size = this.size === 'default' ? '' : this.size;
    const status = this.validateStatus === 'default' ? '' : this.validateStatus;
    const classes = handleClsList([
      `${p}`,
      size,
      status,
      this.disabled ? `${p}-disabled` : '',
      this.borderless ? `${p}-borderless` : '',
      this._focused ? `${p}-focus` : '',
      this._hovering ? `${p}-hover` : '',
      this._invalid ? `${p}-invalid` : '',
    ]);
    const placeholder = this.placeholder
      ?? (this._isRange() ? `开始时间${this.rangeSeparator}结束时间` : '选择时间');

    return html`
      <semi-trigger
        trigger="custom"
        .open=${this._open}
        .content=${this._renderPanel()}
        position=${this.position.startsWith('top') ? 'top' : 'bottom'}
        align="start"
        .popupPlain=${true}
        .showArrow=${false}
        @openChange=${this._handleTriggerOpenChange}
      >
        <div
          class=${classes}
          part="time-picker"
          @mouseenter=${() => { this._hovering = true; }}
          @mouseleave=${() => { this._hovering = false; }}
        >
          ${this.insetLabel
            ? html`<span class="${p}-inset-label">${this.insetLabel}</span>`
            : nothing}
          <input
            class="${p}-input"
            type="text"
            .value=${this._inputValue}
            placeholder=${placeholder}
            ?disabled=${this.disabled}
            ?readonly=${this.inputReadOnly}
            aria-label=${this.pickerLabel ?? '时间选择器'}
            aria-invalid=${this._invalid || this.validateStatus === 'error' ? 'true' : 'false'}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
            @click=${() => this._setOpen(true)}
          />
          ${this._renderClear()}
        </div>
      </semi-trigger>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 240px;
      font-size: 14px;
      color: var(--semi-color-text-0);
      vertical-align: middle;
    }

    .${p} {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: var(--semi-color-fill-0);
      border: 1px solid transparent;
      border-radius: var(--semi-border-radius-small, 4px);
      transition: border-color 0.2s, background-color 0.2s;
    }

    .${p}:hover,
    .${p}-hover {
      background-color: var(--semi-color-fill-1);
    }

    .${p}-focus {
      background-color: var(--semi-color-bg-0);
      border-color: var(--semi-color-primary);
      box-shadow: 0 0 0 1px var(--semi-color-primary-light-active);
    }

    .${p}-borderless {
      background: transparent;
      border-color: transparent;
    }

    .${p}-disabled {
      color: var(--semi-color-disabled-text);
      background-color: var(--semi-color-disabled-fill);
      cursor: not-allowed;
    }

    .${p}-error {
      border-color: var(--semi-color-danger);
      background-color: var(--semi-color-danger-light-default);
    }

    .${p}-warning {
      border-color: var(--semi-color-warning);
      background-color: var(--semi-color-warning-light-default);
    }

    .${p}-small {
      height: 24px;
      padding: 0 8px;
    }

    .${p}-large {
      height: 40px;
      padding: 0 12px;
    }

    .${p}-input {
      flex: 1;
      min-width: 0;
      height: 100%;
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: inherit;
      font: inherit;
    }

    .${p}-input::placeholder {
      color: var(--semi-color-text-2);
    }

    .${p}-input:disabled {
      cursor: not-allowed;
    }

    .${p}-inset-label {
      flex: none;
      color: var(--semi-color-text-2);
      white-space: nowrap;
    }

    .${p}-clear {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--semi-color-fill-2);
      color: var(--semi-color-text-2);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .${p}:hover .${p}-clear,
    .${p}-focus .${p}-clear {
      opacity: 1;
    }

    .${p}-clear:hover {
      color: var(--semi-color-text-0);
    }

    .${p}-clear semi-icon-close {
      font-size: 12px;
    }
  `;
}
