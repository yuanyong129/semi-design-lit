import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import type { SemiTrigger } from '../trigger/trigger';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import { Size } from '../_utils/constant';
import '../trigger/trigger';
import './date-picker-panel';
import '../../../semi-icons/build/calendar';
import '../../../semi-icons/build/close';

const prefixCls = getPrefixCls('date-picker');
const p = unsafeCSS(prefixCls);

export type DatePickerRange = [string, string];

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@customElement('semi-date-picker')
export class SemiDatePicker extends LitElement {
  /**
   * @zh 当前值（YYYY-MM-DD）
   * @en Current value (YYYY-MM-DD)
   */
  @property()
  value?: string | DatePickerRange;

  /**
   * @zh 默认值
   * @en Default value
   */
  @property({ attribute: 'default-value' })
  defaultValue?: string | DatePickerRange;

  /**
   * @zh 是否范围选择
   * @en Whether range selection is enabled
   */
  @property({ type: Boolean })
  range: boolean = false;

  /**
   * @zh 日期格式
   * @en Date format
   */
  @property()
  format: string = 'YYYY-MM-DD';

  /**
   * @zh 占位文字
   * @en Placeholder
   */
  @property()
  placeholder: string = '请选择日期';

  /**
   * @zh 是否禁用
   * @en Whether the date picker is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否显示清除按钮
   * @en Whether to show the clear button
   */
  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = true;

  /**
   * @zh 尺寸
   * @en Size
   */
  @property()
  size?: Size;

  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  @state()
  private _value?: string;

  @state()
  private _range?: DatePickerRange;

  @state()
  private _pendingStart?: string;

  @state()
  private _viewDate: string = toDateString(new Date());

  @query('semi-trigger')
  private _trigger?: SemiTrigger;

  connectedCallback() {
    super.connectedCallback();
    if (Array.isArray(this.defaultValue)) {
      this._range = this.defaultValue;
    } else {
      this._value = this.defaultValue;
    }
  }

  private get _singleValue(): string | undefined {
    return typeof this.value === 'string' ? this.value : this._value;
  }

  private get _currentRange(): DatePickerRange | undefined {
    if (this._pendingStart) return [this._pendingStart, ''];
    return Array.isArray(this.value) ? this.value : this._range;
  }

  private get _hasValue(): boolean {
    return this.range ? Boolean(this._currentRange?.[0]) : Boolean(this._singleValue);
  }

  private get _displayText(): string {
    if (this.range) {
      const range = this._currentRange;
      if (!range?.[0]) return '';
      return `${this._formatDate(range[0])} ~ ${range[1] ? this._formatDate(range[1]) : ''}`;
    }
    return this._singleValue ? this._formatDate(this._singleValue) : '';
  }

  private _formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return this.format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  private _handleSelect(event: CustomEvent<{ date: string }>) {
    const date = event.detail.date;

    if (this.range) {
      if (!this._pendingStart) {
        this._pendingStart = date;
        this._viewDate = date;
        return;
      }

      const start = this._pendingStart;
      const next: DatePickerRange = date < start ? [date, start] : [start, date];
      this._pendingStart = undefined;
      if (!Array.isArray(this.value)) {
        this._range = next;
      }
      this._viewDate = next[0];
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: next, date: event.detail },
        bubbles: true,
        composed: true,
      }));
      this._trigger?.hide();
      return;
    }

    if (this.value === undefined) {
      this._value = date;
    }
    this._viewDate = date;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: date, date: event.detail },
      bubbles: true,
      composed: true,
    }));
    this._trigger?.hide();
  }

  private _handleClear(event: MouseEvent) {
    event.stopPropagation();
    if (this.value === undefined) {
      this._value = undefined;
      this._range = undefined;
    }
    this._pendingStart = undefined;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: undefined },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderPanel() {
    const range = this._currentRange;
    return html`
      <semi-date-picker-panel
        .value=${this.range ? undefined : this._singleValue}
        .viewDate=${this._viewDate}
        .rangeStart=${this.range ? range?.[0] : undefined}
        .rangeEnd=${this.range ? range?.[1] : undefined}
        @select=${(event: CustomEvent) => this._handleSelect(event)}
      ></semi-date-picker-panel>
    `;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      this.size ? `${prefixCls}-${this.size}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this.range ? `${prefixCls}-range` : '',
    ]);

    return html`
      <div class="${cls}" part="date-picker">
        <semi-trigger
          .trigger=${'click'}
          position="bottom"
          align="start"
          .content=${this._renderPanel()}
          .defaultOpen=${this.defaultOpen}
          .disabled=${this.disabled}
          .showArrow=${false}
          .popupPlain=${true}
          @openChange=${(event: CustomEvent) => {
            if (event.detail.open) {
              this._viewDate = this.range
                ? this._currentRange?.[0] ?? toDateString(new Date())
                : this._singleValue ?? toDateString(new Date());
            }
          }}
        >
          <div class="${prefixCls}-selector" part="selector">
            <span class="${prefixCls}-value ${this._hasValue ? '' : `${prefixCls}-placeholder`}">
              ${this._hasValue ? this._displayText : this.placeholder}
            </span>
            ${this.showClear && this._hasValue && !this.disabled
              ? html`<span
                  class="${prefixCls}-clear"
                  role="button"
                  aria-label="Clear"
                  @click=${this._handleClear}
                ><semi-icon-close></semi-icon-close></span>`
              : html`<span class="${prefixCls}-icon"><semi-icon-calendar></semi-icon-calendar></span>`}
          </div>
        </semi-trigger>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }

    .${p}-selector {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      background-color: var(--semi-color-fill-0);
      border: 1px solid transparent;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-selector:hover {
      background-color: var(--semi-color-fill-1);
    }

    .${p}-small .${p}-selector {
      min-height: 24px;
      padding: 0 8px;
      font-size: 12px;
    }

    .${p}-large .${p}-selector {
      min-height: 40px;
      padding: 0 16px;
      font-size: 16px;
    }

    .${p}-value {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-placeholder {
      color: var(--semi-color-text-3);
    }

    .${p}-icon,
    .${p}-clear {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-left: 8px;
      color: var(--semi-color-text-2);
      font-size: 14px;
    }

    .${p}-clear {
      color: var(--semi-color-text-3);
      background-color: var(--semi-color-fill-1);
      border-radius: 50%;
      cursor: pointer;
    }

    .${p}-disabled .${p}-selector {
      color: var(--semi-color-disabled-text);
      background-color: var(--semi-color-disabled-fill);
      cursor: not-allowed;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-date-picker': SemiDatePicker
  }
}
