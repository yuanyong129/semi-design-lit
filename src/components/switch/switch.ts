import { CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { switchPrefixCls, styles } from "./style/switch.style";
import '../../icon/build/loading';
import { handleClsList } from "../_utils/web-utils";
import { getSlots } from "../_utils/dom";
import { useSize } from "../_hooks/use-size";
import { isFunction, isNull, isUndefined } from "../_utils/is";
import { Size } from "../_utils/constant";

@customElement('a-switch')
export class ArcoSwitch extends LitElement {
  /**
   * @zh 绑定值
   * @en Value
   */
  @property({ type: [String, Boolean, Number] })
  value?: string | number | boolean;
  /**
   * @zh 默认选中状态（非受控状态）
   * @en Default selected state (uncontrolled state)
   */
  @property({ type: Boolean })
  defaultChecked?: boolean = false
  /**
   * @zh 是否禁用
   * @en Whether to disable
   */
  @property({ type: Boolean })
  disabled?: boolean = false;
  /**
   * @zh 是否为加载中状态
   * @en Whether it is loading state
   */
  @property({ type: Boolean })
  loading?: boolean = false;
  /**
   * @zh 开关的类型
   * @en Type of switch
   * @values 'circle', 'round', 'line'
   */
  @property()
  type: 'circle' | 'round' | 'line' = 'circle';
  /**
   * @zh 开关的大小
   * @en Size of switch
   */
  @property()
  size?: 'small' | 'medium'
  /**
   * @zh 选中时的值
   * @en Value when checked
   */
  @property({ type: [String, Boolean, Number] })
  checkedValue: string | number | boolean = true;
  /**
   * @zh 未选中时的值
   * @en Value when unchecked
   */
  @property({ type: [String, Boolean, Number] })
  uncheckedValue: string | number | boolean = false;
  /**
   * @zh 选中时的开关颜色
   * @en The color of the switch when checked
   */
  @property()
  checkedColor?: string;
  /**
   * @zh 未选中时的开关颜色
   * @en The color of the switch when unchecked
   */
  @property()
  uncheckedColor?: string;
  /**
   * @zh switch 状态改变前的钩子， 返回 false 或者返回 Promise 且被 reject 则停止切换。
   * @en before-change hook before the switch state changes. If false is returned or a Promise is returned and then is rejected, will stop switching
   */
  @property()
  beforeChange?: (
    newValue: string | number | boolean
  ) => Promise<boolean | void> | boolean | void
  /**
   * @zh 打开状态时的文案（`type='line'`和`size='small'`时不生效）
   * @en Copywriting when opened (not effective when `type='line'` and `size='small'`)
   */
  @property()
  checkedText?: string;
  /**
   * @zh 关闭状态时的文案（`type='line'`和`size='small'`时不生效）
   * @en Copywriting when closed (not effective when `type='line'` and `size='small'`)
   */
  @property()
  uncheckedText?: string;

  @state()
  _checked?: boolean | string | number

  @state()
  _computedLoading = false;

  @state()
  _computedCheck = false;

  @state()
  _mergedDisabled = false;

  @state()
  _loading = false;

  @state()
  _mergedSize?: Size;

  handleChange = (checked: boolean, ev: Event) => {
    console.log('handleChange')
    this._checked = checked ? this.checkedValue : this.uncheckedValue;
    this.dispatchEvent(new CustomEvent('update:value', { detail: { value: this._checked } } ));
    this.dispatchEvent(new CustomEvent('change', {
      ...ev,
      detail: { value: this._checked } 
    }));
    // eventHandlers.value?.onChange?.(ev);
  };

  async handleClick(ev: MouseEvent) {
    if (this._computedLoading || this._mergedDisabled) {
      return;
    }

    const checked = !this._computedCheck;
    const checkedValue = checked ? this.checkedValue : this.uncheckedValue;
    const shouldChange = this.beforeChange;

    if (isFunction(shouldChange)) {
      this._loading = true;
      try {
        const result = await shouldChange(checkedValue);
        if (result ?? true) {
          this.handleChange(checked, ev);
        }
      } finally {
        this._loading = false;
      }
    } else {
      this.handleChange(checked, ev);
    }
  }

  handleFocus(ev: FocusEvent) {
    this.dispatchEvent(new CustomEvent('focus', ev));
    // eventHandlers.value?.onFocus?.(ev);
  };

  handleBlur = (ev: FocusEvent) => {
    this.dispatchEvent(new CustomEvent('blur', ev));
    // eventHandlers.value?.onBlur?.(ev);
  };

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    console.log('attributeChangedCallback', name, value);
    if(name === 'value') {
      if (isUndefined(value) || isNull(value)) {
        this._checked = this.uncheckedValue;
      }
    }
  }



  cls() {
    return handleClsList([
      switchPrefixCls,
      `${switchPrefixCls}-type-${this.type}`,
      this._mergedSize === 'small' || this._mergedSize === 'mini' ? `${switchPrefixCls}-small` : '',
      this._computedCheck ? `${switchPrefixCls}-checked` : '',
      this._mergedDisabled ? `${switchPrefixCls}-disabled` : '',
      this._computedLoading ? `${switchPrefixCls}-loading` : '',
      (this.type === 'line' && (this.checkedColor || this.uncheckedColor)) ? `${switchPrefixCls}-custom-color` : '',
    ]);
  }

  buttonStyle() {
    if (this._computedCheck && this.checkedColor) {
      return this.type === 'line'
        ? { '--custom-color': this.checkedColor }
        : { backgroundColor: this.checkedColor };
    }
    if (!this._computedCheck && this.uncheckedColor) {
      return this.type === 'line'
        ? { '--custom-color': this.uncheckedColor }
        : { backgroundColor: this.uncheckedColor };
    }
    return undefined;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._checked = this.defaultChecked ? this.checkedValue : this.uncheckedValue;
  }

  protected render(): unknown {

    const slots = getSlots(this.children);
    this._mergedSize = useSize(this.size);
    this._computedCheck = (this.value ?? this._checked) === this.checkedValue;
    this._computedLoading = this._loading || Boolean(this.loading);

    return html`
      <button
        type="button"
        role="switch"
        .aria-checked="${this._computedCheck}"
        class="${this.cls()}"
        style="${this.buttonStyle}"
        .disabled="${this._mergedDisabled}"
        @click="${this.handleClick}"
        @focus="handleFocus"
        @blur="handleBlur">
        <span class="${switchPrefixCls}-handle">
          <span class="${switchPrefixCls}-handle-icon">
            ${ this._computedLoading
                ? html`<icon-loading></icon-loading>`
                : this._computedCheck
                  ? html`<slot name="checked-icon"></slot>`
                  : html`<slot name="unchecked-icon"></slot>`}
          </span>
        </span>
        ${ this.type !== 'line' &&
           this.size !== 'small' &&
           (slots.checked || this.checkedText || slots.unchecked || this.uncheckedText)
            ? html`
                <span class="${switchPrefixCls}-text-holder">
                  ${ this._computedCheck
                      ? html`<slot name="checked">${this.checkedText}</slot>`
                      : html`<slot name="unchecked">${this.uncheckedText}</slot>` }
                </span>
                <span class="${switchPrefixCls}-text">
                  ${ this._computedCheck
                    ? html`<slot name="checked">${this.checkedText}</slot>`
                    : html`<slot name="unchecked">${this.uncheckedText}</slot>` }
                </span>
              `: nothing
        }
      </button>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'a-switch': ArcoSwitch
  }
}