import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Size } from '../_utils/constant';
import { useFormItem } from '../_hooks/use-form-item';
import { useSize } from '../_hooks/use-size';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import '../../../semi-icons/build/minus';
import '../../../semi-icons/build/plus';

const prefixCls = getPrefixCls('input-number');

const styles = css`
  :host {
    display: inline-block;
    width: 100%;
  }

  .${unsafeCSS(prefixCls)}-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    padding: 0 12px;
    color: var(--semi-color-text-0);
    font-size: 14px;
    background-color: var(--semi-color-fill-0);
    border: 1px solid transparent;
    border-radius: 3px;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .${unsafeCSS(prefixCls)}-wrapper:hover {
    background-color: var(--semi-color-fill-1);
  }

  .${unsafeCSS(prefixCls)}-wrapper-focus {
    background-color: var(--semi-color-fill-0);
    border-color: var(--semi-color-focus-border);
  }

  .${unsafeCSS(prefixCls)}-wrapper-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default);
  }

  .${unsafeCSS(prefixCls)}-wrapper-disabled {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill);
    cursor: not-allowed;
  }

  .${unsafeCSS(prefixCls)}-wrapper-large {
    height: 40px;
    padding: 0 16px;
    font-size: 16px;
  }

  .${unsafeCSS(prefixCls)}-wrapper-small {
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
  }

  .${unsafeCSS(prefixCls)} {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    background: transparent;
    border: none;
    outline: none;
  }

  .${unsafeCSS(prefixCls)}::-webkit-outer-spin-button,
  .${unsafeCSS(prefixCls)}::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }

  .${unsafeCSS(prefixCls)}-controls {
    display: inline-flex;
    flex-direction: column;
    flex-shrink: 0;
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .${unsafeCSS(prefixCls)}-wrapper:hover .${unsafeCSS(prefixCls)}-controls,
  .${unsafeCSS(prefixCls)}-wrapper-focus .${unsafeCSS(prefixCls)}-controls {
    opacity: 1;
  }

  .${unsafeCSS(prefixCls)}-control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 12px;
    padding: 0;
    color: var(--semi-color-text-2);
    font-size: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .${unsafeCSS(prefixCls)}-control:hover {
    color: var(--semi-color-text-0);
  }

  .${unsafeCSS(prefixCls)}-control:disabled {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
  }
`;

@customElement('semi-input-number')
export class SemiInputNumber extends LitElement {
  @property({ type: Number })
  value?: number;

  @property({ attribute: 'default-value', type: Number })
  defaultValue?: number;

  @property({ type: Number })
  min?: number;

  @property({ type: Number })
  max?: number;

  @property({ type: Number })
  step: number = 1;

  @property({ type: Number })
  precision?: number;

  @property()
  size?: Size;

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ type: Boolean })
  readonly: boolean = false;

  @property()
  placeholder?: string;

  @property()
  name?: string;

  @state()
  private _value?: number;

  @state()
  private _focused = false;

  @query('input')
  private _input?: HTMLInputElement;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue;
  }

  private get _displayValue(): string {
    const value = this.value ?? this._value;
    if (value === undefined || Number.isNaN(value)) return '';
    return this._format(value);
  }

  private _format(value: number): string {
    if (this.precision !== undefined) {
      return value.toFixed(this.precision);
    }
    return String(value);
  }

  private _clamp(value: number): number {
    let next = value;
    if (this.min !== undefined) next = Math.max(this.min, next);
    if (this.max !== undefined) next = Math.min(this.max, next);
    return next;
  }

  private _setValue(value: number | undefined, event: Event) {
    const next = value === undefined ? undefined : this._clamp(value);
    if (this.value === undefined) {
      this._value = next;
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: next, event },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleInput(ev: Event) {
    const raw = (ev.target as HTMLInputElement).value;
    if (raw === '' || raw === '-') {
      if (this.value === undefined) this._value = undefined;
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    if (this.value === undefined) this._value = parsed;
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: parsed, event: ev },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(ev: Event) {
    const parsed = Number((ev.target as HTMLInputElement).value);
    this._setValue(Number.isNaN(parsed) ? undefined : parsed, ev);
  }

  private _stepBy(delta: number, event: Event) {
    const current = this.value ?? this._value ?? 0;
    this._setValue(current + delta, event);
  }

  private _handleBlur(ev: FocusEvent) {
    this._focused = false;
    const current = this.value ?? this._value;
    if (current !== undefined) {
      this._setValue(current, ev);
    }
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { value: this.value ?? this._value, event: ev },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const { mergedSize: formSize, mergedDisabled, mergedError } = useFormItem(this, {
      size: this.size,
      disabled: this.disabled,
      error: false,
    });
    const { mergedSize } = useSize(this, formSize);
    const disabled = mergedDisabled;

    const wrapperCls = handleClsList([
      `${prefixCls}-wrapper`,
      mergedSize !== 'default' ? `${prefixCls}-wrapper-${mergedSize}` : '',
      this._focused ? `${prefixCls}-wrapper-focus` : '',
      disabled ? `${prefixCls}-wrapper-disabled` : '',
      mergedError ? `${prefixCls}-wrapper-error` : '',
    ]);

    return html`
      <div class="${wrapperCls}" part="input-number">
        <input
          class="${prefixCls}"
          type="text"
          inputmode="decimal"
          .value=${this._displayValue}
          name=${this.name ?? nothing}
          placeholder=${this.placeholder ?? nothing}
          ?disabled=${disabled}
          ?readonly=${this.readonly}
          @focus=${() => (this._focused = true)}
          @blur=${this._handleBlur}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        <span class="${prefixCls}-controls">
          <button
            class="${prefixCls}-control"
            type="button"
            aria-label="Increase"
            ?disabled=${disabled || (this.max !== undefined && (this.value ?? this._value ?? 0) >= this.max)}
            @mousedown=${(ev: MouseEvent) => ev.preventDefault()}
            @click=${(ev: MouseEvent) => this._stepBy(this.step, ev)}
          ><semi-icon-plus></semi-icon-plus></button>
          <button
            class="${prefixCls}-control"
            type="button"
            aria-label="Decrease"
            ?disabled=${disabled || (this.min !== undefined && (this.value ?? this._value ?? 0) <= this.min)}
            @mousedown=${(ev: MouseEvent) => ev.preventDefault()}
            @click=${(ev: MouseEvent) => this._stepBy(-this.step, ev)}
          ><semi-icon-minus></semi-icon-minus></button>
        </span>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-input-number': SemiInputNumber
  }
}

