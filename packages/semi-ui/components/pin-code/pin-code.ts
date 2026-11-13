import { html, LitElement, nothing } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { Size } from '../_utils/constant';
import { styles } from './style/pin-code.style';
import { PinCodeFormat } from './interface';

const prefixCls = getPrefixCls('pin-code');

@customElement('semi-pin-code')
export class SemiPinCode extends LitElement {
  /**
   * @zh 验证码值（受控）
   * @en Pin code value (controlled)
   */
  @property()
  value?: string;

  /**
   * @zh 默认验证码值（非受控）
   * @en Default pin code value (uncontrolled)
   */
  @property({ attribute: 'default-value' })
  defaultValue: string = '';

  /**
   * @zh 验证码位数
   * @en Number of input cells
   * @defaultValue 6
   */
  @property({ type: Number })
  count: number = 6;

  /**
   * @zh 允许输入的字符格式
   * @en Allowed character format
   * @defaultValue 'number'
   */
  @property({ attribute: false })
  format: PinCodeFormat = 'number';

  /**
   * @zh 是否禁用
   * @en Whether the pin code is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 输入框尺寸
   * @en Input size
   */
  @property()
  size?: Size;

  /**
   * @zh 校验状态
   * @en Validate status
   */
  @property({ attribute: 'validate-status' })
  validateStatus: 'default' | 'error' | 'warning' = 'default';

  /**
   * @zh 是否自动聚焦第一个输入框
   * @en Whether to focus the first cell automatically
   */
  @property({ attribute: 'autofocus', type: Boolean })
  autoFocus: boolean = true;

  /**
   * @zh 无障碍标签
   * @en Accessible label
   */
  @property({ attribute: 'aria-label' })
  ariaLabel: string = '验证码';

  @state()
  private _values: string[] = [];

  @state()
  private _activeIndex: number = -1;

  @queryAll('input')
  private _inputs!: NodeListOf<HTMLInputElement>;

  private _lastComplete = '';

  connectedCallback() {
    super.connectedCallback();
    this._values = this._split(this.value ?? this.defaultValue);
  }

  protected firstUpdated() {
    if (this.autoFocus && !this.disabled) {
      this.focus(0);
    }
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('count') || changed.has('defaultValue')) {
      const next = this._split(this.value ?? this._values.join(''));
      if (next.join('') !== this._values.join('')) {
        this._values = next;
      }
    }
  }

  private _split(value: string | undefined): string[] {
    const chars = (value ?? '').slice(0, this.count).split('');
    while (chars.length < this.count) chars.push('');
    return chars;
  }

  private get _currentValues(): string[] {
    return this._split(this.value !== undefined ? this.value : this._values.join(''));
  }

  private _validate(char: string): boolean {
    if (!char) return true;
    const format = this.format;
    if (typeof format === 'string') {
      if (format === 'number') return /^\d$/.test(char);
      if (format === 'mixed') return /^[0-9a-zA-Z]$/.test(char);
      return true;
    }
    if (format instanceof RegExp) return format.test(char);
    if (typeof format === 'function') return format(char);
    return true;
  }

  focus(options?: FocusOptions): void;
  focus(index?: number): void;
  focus(optionsOrIndex?: FocusOptions | number) {
    if (typeof optionsOrIndex === 'number') {
      const input = this._inputs?.[Math.max(0, Math.min(this.count - 1, optionsOrIndex))];
      input?.focus();
      input?.select();
      return;
    }
    super.focus(optionsOrIndex);
  }

  blur(index: number = this._activeIndex) {
    if (index < 0) {
      super.blur();
      return;
    }
    this._inputs?.[index]?.blur();
  }

  private _focusIndex(index: number) {
    const input = this._inputs?.[Math.max(0, Math.min(this.count - 1, index))];
    input?.focus();
  }

  private _emitChange(values: string[]) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: values.join('') },
      bubbles: true,
      composed: true,
    }));
  }

  private _maybeComplete(values: string[]) {
    const joined = values.join('');
    if (joined.length === this.count && values.every(Boolean)) {
      if (joined !== this._lastComplete) {
        this._lastComplete = joined;
        this.dispatchEvent(new CustomEvent('complete', {
          detail: { value: joined },
          bubbles: true,
          composed: true,
        }));
      }
    } else {
      this._lastComplete = '';
    }
  }

  private _applyValues(values: string[], emit = true) {
    if (this.value === undefined) {
      this._values = values;
    }
    if (emit) this._emitChange(values);
    this._maybeComplete(values);
  }

  private _handleInput(event: InputEvent, index: number) {
    if (event.isComposing) return;
    const input = event.target as HTMLInputElement;
    const chars = this._currentValues;
    const raw = input.value;
    const char = raw.slice(-1);
    if (!char) {
      chars[index] = '';
      this._applyValues(chars);
      input.value = '';
      return;
    }
    if (!this._validate(char)) {
      input.value = chars[index] ?? '';
      return;
    }
    chars[index] = char;
    this._applyValues(chars);
    if (index < this.count - 1) {
      this._focusIndex(index + 1);
    } else {
      input.blur();
    }
  }

  private _handleKeyDown(event: KeyboardEvent, index: number) {
    const chars = this._currentValues;
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (chars[index]) {
        chars[index] = '';
        this._applyValues(chars);
      } else if (index > 0) {
        chars[index - 1] = '';
        this._applyValues(chars);
        this._focusIndex(index - 1);
      }
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      if (chars[index]) {
        chars[index] = '';
        this._applyValues(chars);
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this._focusIndex(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this._focusIndex(index + 1);
    }
  }

  private _handlePaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const chars = this._currentValues;
    let cursor = index;
    for (const char of text) {
      if (cursor >= this.count) break;
      if (!this._validate(char)) continue;
      chars[cursor] = char;
      cursor += 1;
    }
    this._applyValues(chars);
    if (cursor < this.count) {
      this._focusIndex(cursor);
    }
  }

  private _handleFocus(index: number) {
    this._activeIndex = index;
  }

  private _handleFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.renderRoot.contains(next))) return;
    this._activeIndex = -1;
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { value: this._currentValues.join('') },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const values = this._currentValues;
    const className = handleClsList([
      prefixCls,
      this.size ? `${prefixCls}-${this.size}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this.validateStatus !== 'default' ? `${prefixCls}-${this.validateStatus}` : '',
    ]);
    const inputMode = this.format === 'number' ? 'numeric' : 'text';

    return html`
      <div class="${className}" role="group" aria-label=${this.ariaLabel} @focusout=${this._handleFocusOut}>
        ${Array.from({ length: this.count }, (_, index) => html`
          <input
            class="${prefixCls}-input ${this._activeIndex === index ? `${prefixCls}-input-active` : ''}"
            .value=${values[index] ?? ''}
            type="text"
            inputmode=${inputMode}
            maxlength="1"
            autocomplete="one-time-code"
            ?disabled=${this.disabled}
            tabindex=${this.disabled ? -1 : 0}
            aria-label=${`${this.ariaLabel}第 ${index + 1} 位`}
            @input=${(event: InputEvent) => this._handleInput(event, index)}
            @keydown=${(event: KeyboardEvent) => this._handleKeyDown(event, index)}
            @paste=${(event: ClipboardEvent) => this._handlePaste(event, index)}
            @focus=${() => this._handleFocus(index)}
          />
        `)}
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-pin-code': SemiPinCode;
  }
}
