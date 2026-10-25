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
  value?: string;

  /**
   * @zh 默认值
   * @en Default value
   */
  @property({ attribute: 'default-value' })
  defaultValue?: string;

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
  private _viewDate: string = toDateString(new Date());

  @query('semi-trigger')
  private _trigger?: SemiTrigger;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue;
  }

  private get _displayValue(): string | undefined {
    return this.value ?? this._value;
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
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: undefined },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderPanel() {
    return html`
      <semi-date-picker-panel
        .value=${this._displayValue}
        .viewDate=${this._viewDate}
        @select=${(event: CustomEvent) => this._handleSelect(event)}
      ></semi-date-picker-panel>
    `;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      this.size ? `${prefixCls}-${this.size}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
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
              this._viewDate = this._displayValue ?? toDateString(new Date());
            }
          }}
        >
          <div class="${prefixCls}-selector" part="selector">
            <span class="${prefixCls}-value ${this._displayValue ? '' : `${prefixCls}-placeholder`}">
              ${this._displayValue ? this._formatDate(this._displayValue) : this.placeholder}
            </span>
            ${this.showClear && this._displayValue && !this.disabled
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
