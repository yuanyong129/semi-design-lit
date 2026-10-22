import { CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { Size } from '../_utils/constant';
import { getPrefixCls } from '../_utils/global-config';
import { useSize } from '../_hooks/use-size';
import { useFormItem } from '../_hooks/use-form-item';
import { handleClsList } from '../_utils/web-utils';
import { isNumber, isFunction } from '../_utils/is';
import { styles } from './style/input.style';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/eye-closed';
import '../../../semi-icons/build/eye-opened';

const prefixCls = getPrefixCls('input');

export type InputValidateStatus = 'default' | 'error' | 'warning' | 'success';
export type InputMode = 'password';

@customElement('semi-input')
export class SemiInput extends LitElement {

  /**
   * @zh 缁戝畾鍊硷紙鍙楁帶锛?   * @en Value (controlled)
   */
  @property()
  value?: string;

  /**
   * @zh 榛樿鍊硷紙闈炲彈鎺х姸鎬侊級
   * @en Default value (uncontrolled)
   */
  @property({ attribute: 'default-value' })
  defaultValue: string = '';

  /**
   * @zh 杈撳叆妗嗗昂瀵?   * @en Input size
   * @values 'small','default','large'
   */
  @property()
  size?: Size;

  /**
   * @zh 鏄惁绂佺敤
   * @en Whether the input is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 鏄惁鍙
   * @en Whether the input is read-only
   */
  @property({ type: Boolean })
  readonly: boolean = false;

  /**
   * @zh 鏍￠獙鐘舵€?   * @en Validate status
   * @values 'default','error','warning','success'
   * @defaultValue 'default'
   */
  @property({ attribute: 'validate-status' })
  validateStatus: InputValidateStatus = 'default';

  /**
   * @zh 鏄惁涓洪敊璇姸鎬侊紙validateStatus 鐨勪究鎹峰啓娉曪級
   * @en Shorthand for validateStatus="error"
   */
  @property({ type: Boolean })
  error: boolean = false;

  /**
   * @zh 鏄惁鏄剧ず娓呴櫎鎸夐挳
   * @en Whether to show the clear button
   */
  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = false;

  /**
   * @zh 绂佺敤鏃舵槸鍚︿粛鏄剧ず娓呴櫎鎸夐挳
   * @en Whether to show the clear button when disabled
   */
  @property({ attribute: 'show-clear-ignore-disabled', type: Boolean })
  showClearIgnoreDisabled: boolean = false;

  /**
   * @zh 娓呴櫎鏃舵槸鍚﹂殣钘?suffix
   * @en Whether to hide the suffix when the clear button is visible
   */
  @property({ attribute: 'hide-suffix', type: Boolean })
  hideSuffix: boolean = false;

  /**
   * @zh 鏄惁涓烘棤杈规妯″紡
   * @en Whether the input is borderless
   */
  @property({ type: Boolean })
  borderless: boolean = false;

  /**
   * @zh 鍙繚鐣欐寚瀹氬搴︾殑杈规
   * @en Only keep a custom border width
   */
  @property({ attribute: 'only-border' })
  onlyBorder?: number | string;

  /**
   * @zh 鎻愮ず鏂囧瓧
   * @en Placeholder
   */
  @property()
  placeholder?: string;

  /**
   * @zh 杈撳叆鍊肩殑鏈€澶ч暱搴?   * @en Maximum length of the value
   */
  @property({ type: Number })
  maxLength?: number;

  /**
   * @zh 杈撳叆鍊肩殑鏈€灏忛暱搴?   * @en Minimum length of the value
   */
  @property({ type: Number })
  minLength?: number;

  /**
   * @zh 鑷畾涔夊瓧绗﹂暱搴﹁绠楁柟娉曪紝閰嶅悎 maxLength 浣跨敤
   * @en Custom value length calculation, used with maxLength
   */
  @property({ attribute: false })
  getValueLength?: (value: string) => number;

  /**
   * @zh 杈撳叆妗嗙被鍨?   * @en Input type
   */
  @property()
  type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'hidden' = 'text';

  /**
   * @zh 杈撳叆妗嗘ā寮忥紝password 妯″紡浼氬睍绀哄瘑鐮佹樉闅愭寜閽?   * @en Input mode, password mode shows the eye button
   */
  @property()
  mode?: InputMode;

  /**
   * @zh 鏄惁鑷姩鑱氱劍
   * @en Whether to focus automatically
   */
  @property({ attribute: 'autofocus', type: Boolean })
  autoFocus: boolean = false;

  /**
   * @zh 鑱氱劍鏃舵槸鍚﹂樆姝㈡粴鍔?   * @en Whether to prevent scrolling when focusing
   */
  @property({ attribute: 'prevent-scroll', type: Boolean })
  preventScroll: boolean = false;

  /**
   * @zh 鍘熺敓 name 灞炴€?   * @en Native name attribute
   */
  @property()
  name?: string;

  /**
   * @zh 鍘熺敓 autocomplete 灞炴€?   * @en Native autocomplete attribute
   */
  @property()
  autocomplete?: string;

  /**
   * @zh 鍓嶇疆鍐呭
   * @en Prefix content
   */
  @property({ attribute: false })
  prefixContent?: TemplateResult;

  /**
   * @zh 鍚庣疆鍐呭
   * @en Suffix content
   */
  @property({ attribute: false })
  suffixContent?: TemplateResult;

  /**
   * @zh 鍐呭祵鏍囩锛岀瓑鍚屼簬 prefix
   * @en Inset label, equivalent to prefix
   */
  @property({ attribute: false })
  insetLabel?: TemplateResult | string;

  /**
   * @zh 鍐呭祵鏍囩鐨?id
   * @en Id of the inset label
   */
  @property({ attribute: 'inset-label-id' })
  insetLabelId?: string;

  /**
   * @zh 鑷畾涔夋竻闄ゅ浘鏍?   * @en Custom clear icon
   */
  @property({ attribute: false })
  clearIcon?: TemplateResult;

  /**
   * @zh 鍓嶇疆鏍囩
   * @en Addon before
   */
  @property({ attribute: false })
  addonBefore?: string | TemplateResult;

  /**
   * @zh 鍚庣疆鏍囩
   * @en Addon after
   */
  @property({ attribute: false })
  addonAfter?: string | TemplateResult;

  /**
   * @zh 鏄惁鍦ㄨ緭鍏ユ硶缁勫悎缁撴潫鍚庡啀瑙﹀彂 change
   * @en Whether to trigger change after IME composition ends
   */
  @property({ type: Boolean })
  composition: boolean = false;

  /**
   * @zh 杈撳叆妗嗗師鐢熸牱寮?   * @en Native style of the inner input
   */
  @property({ attribute: false })
  inputStyle?: StyleInfo;

  @state()
  private _value: string = '';

  @state()
  private _focused: boolean = false;

  @state()
  private _hovering: boolean = false;

  @state()
  private _composing: boolean = false;

  @state()
  private _eyeClosed: boolean = true;

  @query('input')
  private _input?: HTMLInputElement;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue ?? '';
    this._eyeClosed = this.mode === 'password';
  }

  protected firstUpdated() {
    if (this.autoFocus && !this.disabled) {
      this.focus();
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('mode')) {
      this._eyeClosed = this.mode === 'password';
    }
  }

  /** Focus the inner input, mirrors Semi Input's imperative focus. */
  focus(options?: FocusOptions) {
    this._input?.focus(options ?? { preventScroll: this.preventScroll });
  }

  /** Blur the inner input. */
  blur() {
    this._input?.blur();
  }

  private get _status(): InputValidateStatus {
    if (this.validateStatus !== 'default') return this.validateStatus;
    return this.error ? 'error' : 'default';
  }

  private get _displayValue(): string {
    return this.value ?? this._value;
  }

  private get _hasPrefix(): boolean {
    return Boolean(this.insetLabel || this.prefixContent || this.querySelector(':scope > [slot="prefix"]'));
  }

  private get _hasSuffix(): boolean {
    return Boolean(this.suffixContent || this.querySelector(':scope > [slot="suffix"]'));
  }

  private _isClearVisible(disabled: boolean): boolean {
    const canClear = !disabled || this.showClearIgnoreDisabled;
    return Boolean(this.showClear && this._displayValue && canClear && (this._focused || this._hovering));
  }

  private get _inputType(): string {
    if (this.mode === 'password') {
      return this._eyeClosed ? 'password' : 'text';
    }
    return this.type;
  }

  private _trimValue(value: string): string {
    if (!this.maxLength || !isFunction(this.getValueLength)) return value;
    if (this.getValueLength(value) <= this.maxLength) return value;

    let result = '';
    for (const char of Array.from(value)) {
      const next = result + char;
      if (this.getValueLength(next) > this.maxLength) break;
      result = next;
    }
    return result;
  }

  private _emit(name: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  private _syncValue(value: string) {
    if (this.value === undefined) {
      this._value = value;
    }
    if (this._input && this._input.value !== value) {
      this._input.value = value;
    }
  }

  private handleInput(ev: Event) {
    const raw = (ev.target as HTMLInputElement).value;
    const value = this._trimValue(raw);

    if (value !== raw) {
      (ev.target as HTMLInputElement).value = value;
    }

    this._syncValue(value);
    this._emit('input', { value, event: ev });

    if (this.composition && this._composing) return;
    this._emit('change', { value, event: ev });
  }

  private handleClear(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.value === undefined) {
      this._syncValue('');
    }
    this._emit('change', { value: '', event: ev, fromClearBtn: true });
    this._emit('clear', { event: ev });
    this.focus();
  }

  private handleFocus(ev: FocusEvent) {
    this._focused = true;
    this._emit('focus', { value: this._displayValue, event: ev });
  }

  private handleBlur(ev: FocusEvent) {
    this._focused = false;
    this._emit('blur', { value: this._displayValue, event: ev });
  }

  private handleWrapperClick(ev: MouseEvent) {
    if (this.disabled || this._focused) return;
    if (ev.target === ev.currentTarget) {
      this.focus();
    }
  }

  private handlePrefixClick(ev: MouseEvent) {
    ev.preventDefault();
    if (!this.disabled) this.focus();
  }

  private handleKeyDown(ev: KeyboardEvent) {
    this._emit('keydown', { value: this._displayValue, event: ev });
  }

  private handleKeyUp(ev: KeyboardEvent) {
    this._emit('keyup', { value: this._displayValue, event: ev });
  }

  private handleKeyPress(ev: KeyboardEvent) {
    this._emit('keypress', { value: this._displayValue, event: ev });
    if (ev.key === 'Enter') {
      this._emit('enterpress', { value: this._displayValue, event: ev });
    }
  }

  private handleCompositionStart(ev: CompositionEvent) {
    this._composing = true;
    this._emit('compositionstart', { value: this._displayValue, event: ev });
  }

  private handleCompositionUpdate(ev: CompositionEvent) {
    this._emit('compositionupdate', { value: this._displayValue, event: ev });
  }

  private handleCompositionEnd(ev: CompositionEvent) {
    this._composing = false;
    this._emit('compositionend', { value: this._displayValue, event: ev });
    if (this.composition) {
      const value = this._trimValue((ev.target as HTMLInputElement).value);
      this._syncValue(value);
      this._emit('change', { value, event: ev });
    }
  }

  private handleToggleEye(ev: Event) {
    ev.preventDefault();
    this._eyeClosed = !this._eyeClosed;
    this.focus();
  }

  private handleEyeKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.handleToggleEye(ev);
    }
  }

  private renderPrefix() {
    if (!this._hasPrefix) return nothing;
    return html`
      <div
        class="${prefixCls}-prefix ${this.insetLabel ? `${prefixCls}-inset-label` : ''}"
        id=${this.insetLabelId ?? nothing}
        @mousedown=${this.handlePrefixClick}
        @click=${this.handlePrefixClick}
      >
        <slot name="prefix">${this.insetLabel ?? this.prefixContent}</slot>
      </div>
    `;
  }

  private renderSuffix(clearVisible: boolean) {
    if (!this._hasSuffix) return nothing;
    return html`
      <div
        class="${prefixCls}-suffix ${clearVisible && this.hideSuffix ? `${prefixCls}-suffix-hidden` : ''}"
        @mousedown=${this.handlePrefixClick}
        @click=${this.handlePrefixClick}
      >
        <slot name="suffix">${this.suffixContent}</slot>
      </div>
    `;
  }

  private renderInput(size: Size, disabled: boolean, clearVisible: boolean, status: InputValidateStatus = this._status) {
    const wrapperStyles: StyleInfo = {};
    if (this.onlyBorder !== undefined && this.onlyBorder !== null) {
      wrapperStyles.borderWidth = isNumber(this.onlyBorder) ? `${this.onlyBorder}px` : this.onlyBorder;
    }

    const wrapperCls = handleClsList([
      `${prefixCls}-wrapper`,
      `${prefixCls}-wrapper-${size}`,
      this._focused ? `${prefixCls}-wrapper-focus` : '',
      disabled ? `${prefixCls}-wrapper-disabled` : '',
      this.readonly ? `${prefixCls}-wrapper-readonly` : '',
      status === 'error' ? `${prefixCls}-wrapper-error` : '',
      status === 'warning' ? `${prefixCls}-wrapper-warning` : '',
      status === 'success' ? `${prefixCls}-wrapper-success` : '',
      this.borderless ? `${prefixCls}-borderless` : '',
      this.type === 'hidden' ? `${prefixCls}-wrapper-hidden` : '',
      this._hasPrefix ? `${prefixCls}-wrapper__with-prefix` : '',
      this._hasSuffix ? `${prefixCls}-wrapper__with-suffix` : '',
      clearVisible ? `${prefixCls}-wrapper-clearable` : '',
    ]);

    const inputCls = handleClsList([
      prefixCls,
      `${prefixCls}-${size}`,
      disabled ? `${prefixCls}-disabled` : '',
      clearVisible ? `${prefixCls}-sibling-clearbtn` : '',
      this.mode === 'password' ? `${prefixCls}-sibling-modebtn` : '',
    ]);

    return html`
      <div
        class="${wrapperCls}"
        style="${styleMap(wrapperStyles)}"
        part="input-wrapper"
        @mouseenter=${() => (this._hovering = true)}
        @mouseleave=${() => (this._hovering = false)}
        @click=${this.handleWrapperClick}
      >
        ${this.addonBefore
          ? html`<div class="${prefixCls}-prepend">${this.addonBefore}</div>`
          : nothing}
        ${this.renderPrefix()}
        <input
          class="${inputCls}"
          style="${styleMap(this.inputStyle ?? {})}"
          .value=${this._displayValue}
          type=${this._inputType}
          name=${this.name ?? nothing}
          autocomplete=${this.autocomplete ?? nothing}
          placeholder=${this.placeholder ?? nothing}
          maxlength=${this.getValueLength ? nothing : (this.maxLength ?? nothing)}
          minlength=${this.minLength ?? nothing}
          aria-invalid=${status === 'error' ? 'true' : nothing}
          ?disabled=${disabled}
          ?readonly=${this.readonly}
          @input=${this.handleInput}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @keydown=${this.handleKeyDown}
          @keyup=${this.handleKeyUp}
          @keypress=${this.handleKeyPress}
          @compositionstart=${this.handleCompositionStart}
          @compositionupdate=${this.handleCompositionUpdate}
          @compositionend=${this.handleCompositionEnd}
        />
        ${clearVisible
          ? html`<div
              class="${prefixCls}-clearbtn"
              role="button"
              aria-label="Clear"
              @mousedown=${this.handleClear}
            >${this.clearIcon ?? html`<semi-icon-close></semi-icon-close>`}</div>`
          : nothing}
        ${this.renderSuffix(clearVisible)}
        ${this.mode === 'password' && !disabled
          ? html`<div
              class="${prefixCls}-modebtn"
              role="button"
              tabindex="0"
              aria-label=${this._eyeClosed ? 'Show password' : 'Hide password'}
              @mousedown=${(ev: MouseEvent) => ev.preventDefault()}
              @click=${this.handleToggleEye}
              @keydown=${this.handleEyeKeyDown}
            >${this._eyeClosed
              ? html`<semi-icon-eye-closed></semi-icon-eye-closed>`
              : html`<semi-icon-eye-opened></semi-icon-eye-opened>`}</div>`
          : nothing}
        ${this.addonAfter
          ? html`<div class="${prefixCls}-append">${this.addonAfter}</div>`
          : nothing}
      </div>
    `;
  }

  protected render() {
    const { mergedSize: formSize, mergedDisabled, mergedError } = useFormItem(this, {
      size: this.size,
      disabled: this.disabled,
      error: this._status === 'error',
    });
    const { mergedSize } = useSize(this, formSize);
    const clearVisible = this._isClearVisible(mergedDisabled);

    return this.renderInput(mergedSize, mergedDisabled, clearVisible, mergedError ? 'error' : this._status);
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-input': SemiInput
  }
}

