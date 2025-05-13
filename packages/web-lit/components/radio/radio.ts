import { CSSResultGroup, html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { radioGroupContext, type RadioGroupContext, type RadioType } from "./context";
import { handleClsList } from "../_utils/web-utils";
import { getPrefixCls } from "../_utils/global-config";
import { styles } from "./style/radio.style";
import '../_components/icon-hover';
import { getChildElements, handleCustomSlot } from "../_utils/dom";
import { ContextConsumer } from "@lit/context";
import { useFormItem } from "../_hooks/use-form-item";
import { isUndefined } from "../_utils/is";

const prefixCls = getPrefixCls('radio');

@customElement('a-radio')
export class ArcoRadio extends LitElement {

  /**
   * @zh 默认是否选中（非受控状态）
   * @en Whether checked by default (uncontrolled state)
   */
  @property({ type: Boolean })
  defaultChecked: boolean = false;
  /**
   * @zh 选项的 `value`
   * @en The `value` of the option
   */
  @property({ type: [String, Number, Boolean] })
  value: string | number | boolean = true;
  /**
   * @zh 单选的类型
   * @en Radio type
   * @values 'radio', 'button'
   */
  @property()
  type: RadioType = 'radio';
  /**
   * @zh 是否禁用
   * @en Whether to disable
   */
  @property({ type: Boolean })
  disabled: boolean = false;
  // private
  @property({ type: Boolean })
  uninjectGroupContext: boolean = false;

  @property()
  radioSlot?: TemplateResult;

  @state()
  radioGroupCtx?: RadioGroupContext = undefined;

  @state()
  slots!: Array<Node>;

  @state()
  _checked: boolean = false;

  @state()
  _isGroup: boolean = false;

  @state()
  _inputRef?: HTMLInputElement | null = null;


  handleFocus(ev: FocusEvent) {
    // eventHandlers.value?.onFocus?.(ev);
  }

  handleBlur(ev: FocusEvent) {
    // eventHandlers.value?.onBlur?.(ev);
  };

  handleClick(ev: Event) {
    ev.stopPropagation();
  };

  handleChange = (e: Event) => {
    this._checked = true;
    if (this._isGroup) {
      this.radioGroupCtx?.handleChange(this.value ?? true, e);
    } else {
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value ?? true, e } }));
      // eventHandlers.value?.onChange?.(e);
    }

    if (
      this._inputRef &&
      this._inputRef.checked !== this.value
    ) {
      this._inputRef.checked = this.computedChecked();
    }
  }

  cls() {
    return handleClsList([
      `${this.type === 'button' ? `${prefixCls}-button` : prefixCls}`,
      this.value ? `${prefixCls}-checked` : '',
      this.disabled ? `${prefixCls}-disabled` : ''
    ]);
  }

  defaultRadio() {
    return html`
      <icon-hover
        class="${prefixCls}-icon-hover"
        disabled="${this.disabled || this.value}"
      >
        <slot name="radio-icon">
          <span class="${prefixCls}-icon"></span>
        </slot>
      </icon-hover>

      ${ getChildElements(this.childNodes).length > 0
          ? html`<span class="${prefixCls}-label">
                  <slot></slot>
                </span>`
          : nothing }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._checked = this.defaultChecked;
    this.radioGroupCtx = !this.uninjectGroupContext
                         ? new ContextConsumer(this, { context: radioGroupContext, subscribe: true }).value
                         : undefined;
    this._isGroup = this.radioGroupCtx?.name === 'ArcoRadioGroup';
  }

   computedChecked() {
    if (this._isGroup) {
      return this.radioGroupCtx?.value === (this.value ?? true);
    }

    if (!isUndefined(this.defaultChecked)) {
      return this.defaultChecked === (this.value ?? true);
    }
    return this._checked;
  }

  render() {

    const { mergedDisabled: _mergedDisabled, eventHandlers } = useFormItem(this, {
      disabled: this.disabled,
    });

    this._inputRef = this.shadowRoot?.getElementById('inputRef') as HTMLInputElement;

    const mergedType = this.radioGroupCtx?.type ?? this.type;
    const mergedDisabled = this.radioGroupCtx?.disabled || _mergedDisabled;

    return html`
      <label class="${this.cls()}">
        <input
          id="inputRef"
          type="radio"
          .checked="${this._checked}"
          .value="${this.value}"
          class="${prefixCls}-target"
          .disabled="${mergedDisabled}"
          @click="${this.handleClick}"
          @change="${this.handleChange}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}" />
        ${mergedType === 'radio' ? (
          (this.radioSlot ?? handleCustomSlot(this.radioGroupCtx?.slots?.radio, {
            checked: this._checked,
            disabled: mergedDisabled,
          })) ?? this.defaultRadio()
        ) : (
          html`<span class="${prefixCls}-button-content">
                <slot></slot>
              </span>`)}
      </label>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
   interface HTMLElementTagNameMap {
      'a-radio': ArcoRadio
    }
}