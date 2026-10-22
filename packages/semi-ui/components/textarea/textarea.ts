import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Size } from '../_utils/constant';
import { useFormItem } from '../_hooks/use-form-item';
import { useSize } from '../_hooks/use-size';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';

const prefixCls = getPrefixCls('textarea');

const styles = css`
  :host {
    display: block;
    width: 100%;
  }

  .${unsafeCSS(prefixCls)}-wrapper {
    position: relative;
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .${unsafeCSS(prefixCls)} {
    display: block;
    width: 100%;
    box-sizing: border-box;
    min-height: 32px;
    padding: 5px 12px;
    color: var(--semi-color-text-0);
    font-family: inherit;
    font-size: 14px;
    line-height: 20px;
    background-color: var(--semi-color-fill-0);
    border: 1px solid transparent;
    border-radius: 3px;
    outline: none;
    resize: vertical;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .${unsafeCSS(prefixCls)}:hover {
    background-color: var(--semi-color-fill-1);
  }

  .${unsafeCSS(prefixCls)}:focus {
    background-color: var(--semi-color-fill-0);
    border-color: var(--semi-color-focus-border);
  }

  .${unsafeCSS(prefixCls)}-small {
    min-height: 24px;
    padding: 2px 8px;
    font-size: 12px;
  }

  .${unsafeCSS(prefixCls)}-large {
    min-height: 40px;
    padding: 9px 16px;
    font-size: 16px;
  }

  .${unsafeCSS(prefixCls)}-disabled {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill);
    cursor: not-allowed;
    resize: none;
  }

  .${unsafeCSS(prefixCls)}-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default);
  }

  .${unsafeCSS(prefixCls)}-error:focus {
    border-color: var(--semi-color-danger);
  }

  .${unsafeCSS(prefixCls)}-count {
    position: absolute;
    right: 12px;
    bottom: 8px;
    color: var(--semi-color-text-3);
    font-size: 12px;
    line-height: 16px;
    pointer-events: none;
  }

  .${unsafeCSS(prefixCls)}-autosize {
    resize: none;
    overflow: hidden;
  }
`;

@customElement('semi-textarea')
export class SemiTextArea extends LitElement {
  @property()
  value?: string;

  @property({ attribute: 'default-value' })
  defaultValue: string = '';

  @property()
  size?: Size;

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ type: Boolean })
  readonly: boolean = false;

  @property({ type: Boolean })
  error: boolean = false;

  @property()
  placeholder?: string;

  @property({ type: Number })
  maxLength?: number;

  @property({ type: Number })
  rows: number = 4;

  @property({ attribute: 'show-count', type: Boolean })
  showCount: boolean = false;

  @property({ type: Boolean })
  autosize: boolean = false;

  @property()
  name?: string;

  @state()
  private _value: string = '';

  @state()
  private _focused = false;

  @query('textarea')
  private _textarea?: HTMLTextAreaElement;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue ?? '';
  }

  protected firstUpdated() {
    this._resize();
  }

  protected updated() {
    this._resize();
  }

  private get _displayValue(): string {
    return this.value ?? this._value;
  }

  private _resize() {
    if (!this.autosize || !this._textarea) return;
    this._textarea.style.height = 'auto';
    this._textarea.style.height = `${this._textarea.scrollHeight}px`;
  }

  private _handleInput(ev: Event) {
    const value = (ev.target as HTMLTextAreaElement).value;
    if (this.value === undefined) {
      this._value = value;
    }
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value, event: ev },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value, event: ev },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleFocus(ev: FocusEvent) {
    this._focused = true;
    this.dispatchEvent(new CustomEvent('focus', {
      detail: { value: this._displayValue, event: ev },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleBlur(ev: FocusEvent) {
    this._focused = false;
    this.dispatchEvent(new CustomEvent('blur', {
      detail: { value: this._displayValue, event: ev },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const { mergedSize: formSize, mergedDisabled, mergedError } = useFormItem(this, {
      size: this.size,
      disabled: this.disabled,
      error: this.error,
    });
    const { mergedSize } = useSize(this, formSize);
    const size = mergedSize;
    const disabled = mergedDisabled;
    const error = mergedError;
    const cls = handleClsList([
      prefixCls,
      size !== 'default' ? `${prefixCls}-${size}` : '',
      disabled ? `${prefixCls}-disabled` : '',
      error ? `${prefixCls}-error` : '',
      this.autosize ? `${prefixCls}-autosize` : '',
    ]);

    return html`
      <div class="${prefixCls}-wrapper">
        <textarea
          class="${cls}"
          part="textarea"
          .value=${this._displayValue}
          name=${this.name ?? nothing}
          placeholder=${this.placeholder ?? nothing}
          rows=${this.rows}
          maxlength=${this.maxLength ?? nothing}
          ?disabled=${disabled}
          ?readonly=${this.readonly}
          @input=${this._handleInput}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        ></textarea>
        ${this.showCount
          ? html`<span class="${prefixCls}-count">${this._displayValue.length}${this.maxLength ? ` / ${this.maxLength}` : ''}</span>`
          : nothing}
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-textarea': SemiTextArea
  }
}


