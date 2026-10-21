import { CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Size } from '../_utils/constant';
import { getPrefixCls } from '../_utils/global-config';
import { useSize } from '../_hooks/use-size';
import { useFormItem } from '../_hooks/use-form-item';
import { handleClsList } from '../_utils/web-utils';
import { styles } from './style/input.style';
import '../../../semi-icons/build/close';

const prefixCls = getPrefixCls('input');

@customElement('semi-input')
export class SemiInput extends LitElement {

  /**
   * @zh 绑定值
   * @en Value
   */
  @property()
  value?: string;

  /**
   * @zh 默认值（非受控状态）
   * @en Default value (uncontrolled)
   */
  @property({ attribute: 'default-value' })
  defaultValue: string = '';

  /**
   * @zh 输入框尺寸
   * @en Input size
   * @values 'small','default','large'
   */
  @property()
  size?: Size;

  /**
   * @zh 是否禁用
   * @en Whether the input is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否只读
   * @en Whether the input is read-only
   */
  @property({ type: Boolean })
  readonly: boolean = false;

  /**
   * @zh 是否为错误状态
   * @en Whether the input is in error state
   */
  @property({ type: Boolean })
  error: boolean = false;

  /**
   * @zh 是否显示清除按钮
   * @en Whether to show the clear button
   */
  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = false;

  /**
   * @zh 是否为无边框模式
   * @en Whether the input is borderless
   */
  @property({ type: Boolean })
  borderless: boolean = false;

  /**
   * @zh 提示文字
   * @en Placeholder
   */
  @property()
  placeholder?: string;

  /**
   * @zh 输入值的最大长度
   * @en Maximum length of the value
   */
  @property({ type: Number })
  maxLength?: number;

  /**
   * @zh 输入框类型
   * @en Input type
   */
  @property()
  type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' = 'text';

  /**
   * @zh 是否自动聚焦
   * @en Whether to focus automatically
   */
  @property({ type: Boolean })
  autofocus: boolean = false;

  /**
   * @zh 原生 name 属性
   * @en Native name attribute
   */
  @property()
  name?: string;

  /**
   * @zh 前置内容
   * @en Prefix content
   */
  @property({ attribute: false })
  prefixContent?: TemplateResult;

  /**
   * @zh 后置内容
   * @en Suffix content
   */
  @property({ attribute: false })
  suffixContent?: TemplateResult;

  /**
   * @zh 前置标签
   * @en Addon before
   */
  @property({ attribute: false })
  addonBefore?: string | TemplateResult;

  /**
   * @zh 后置标签
   * @en Addon after
   */
  @property({ attribute: false })
  addonAfter?: string | TemplateResult;

  @state()
  private _value: string = '';

  @state()
  private _focused: boolean = false;

  @query('input')
  private _input?: HTMLInputElement;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue ?? '';
  }

  private get _hasPrefix(): boolean {
    return Boolean(this.prefixContent || this.querySelector(':scope > [slot="prefix"]'));
  }

  private get _hasSuffix(): boolean {
    return Boolean(this.suffixContent || this.querySelector(':scope > [slot="suffix"]'));
  }

  private get _displayValue(): string {
    return this.value ?? this._value;
  }

  private _emit(value: string) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private handleInput(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (this.value === undefined) {
      this._value = value;
    }
    this._emit(value);
  }

  private handleClear(ev: MouseEvent) {
    ev.stopPropagation();
    this._value = '';
    if (this._input) {
      this._input.value = '';
      this._input.focus();
    }
    this._emit('');
  }

  private handleFocus() {
    this._focused = true;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private handleBlur() {
    this._focused = false;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      this.dispatchEvent(new CustomEvent('enterpress', {
        detail: { value: this._displayValue, event: ev },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private renderInput(size: Size, disabled: boolean) {
    const wrapperCls = handleClsList([
      `${prefixCls}-wrapper`,
      `${prefixCls}-wrapper-${size}`,
      this._focused ? `${prefixCls}-wrapper-focus` : '',
      disabled ? `${prefixCls}-wrapper-disabled` : '',
      this.error ? `${prefixCls}-wrapper-error` : '',
      this.borderless ? `${prefixCls}-wrapper-borderless` : '',
    ]);

    return html`
      <span class="${wrapperCls}" part="input-wrapper">
        ${this._hasPrefix
          ? html`<span class="${prefixCls}-prefix"><slot name="prefix">${this.prefixContent}</slot></span>`
          : nothing}
        <input
          class="${prefixCls}"
          .value=${this._displayValue}
          type=${this.type}
          name=${this.name ?? nothing}
          placeholder=${this.placeholder ?? nothing}
          maxlength=${this.maxLength ?? nothing}
          ?disabled=${disabled}
          ?readonly=${this.readonly}
          ?autofocus=${this.autofocus}
          @input=${this.handleInput}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @keydown=${this.handleKeyDown}
        />
        ${this.showClear && this._displayValue && !disabled && !this.readonly
          ? html`<span class="${prefixCls}-clearbtn" role="button" aria-label="Clear" @click=${this.handleClear}>
              <semi-icon-close></semi-icon-close>
            </span>`
          : nothing}
        ${this._hasSuffix
          ? html`<span class="${prefixCls}-suffix"><slot name="suffix">${this.suffixContent}</slot></span>`
          : nothing}
      </span>
    `;
  }

  protected render() {
    const { mergedSize: formSize, mergedDisabled } = useFormItem(this, {
      size: this.size,
      disabled: this.disabled,
      error: this.error,
    });
    const { mergedSize } = useSize(this, formSize);

    const input = this.renderInput(mergedSize, mergedDisabled);

    if (this.addonBefore || this.addonAfter) {
      return html`
        <div class="${prefixCls}-group">
          ${this.addonBefore
            ? html`<span class="${prefixCls}-addon ${prefixCls}-addon-before">${this.addonBefore}</span>`
            : nothing}
          ${input}
          ${this.addonAfter
            ? html`<span class="${prefixCls}-addon ${prefixCls}-addon-after">${this.addonAfter}</span>`
            : nothing}
        </div>
      `;
    }

    return input;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-input': SemiInput
  }
}
