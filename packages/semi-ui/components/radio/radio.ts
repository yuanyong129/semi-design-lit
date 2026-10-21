import { CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { radioGroupContext, type RadioGroupContext, type RadioType } from "./context";
import { handleClsList } from "../_utils/web-utils";
import { getPrefixCls } from "../_utils/global-config";
import { styles } from "./style/radio.style";

const prefixCls = getPrefixCls('radio');

@customElement('semi-radio')
export class SemiRadio extends LitElement {
  /**
   * @zh 是否选中（受控）
   * @en Whether the radio is checked (controlled)
   */
  @property({ type: Boolean })
  checked?: boolean;

  /**
   * @zh 默认是否选中（非受控）
   * @en Whether the radio is checked by default (uncontrolled)
   */
  @property({ attribute: 'default-checked', type: Boolean })
  defaultChecked: boolean = false;

  /**
   * @zh 选项的 value
   * @en The value of the option
   */
  @property({ type: [String, Number, Boolean] })
  value: string | number | boolean = true;

  /**
   * @zh 是否禁用
   * @en Whether the radio is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 单选框类型，通常由 semi-radio-group 注入
   * @en Radio type, usually injected by semi-radio-group
   */
  @property()
  type?: RadioType;

  @consume({ context: radioGroupContext, subscribe: true })
  private _groupContext?: RadioGroupContext;

  @state()
  private _checked: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this._checked = this.defaultChecked;
  }

  private get _isGroup(): boolean {
    return this._groupContext?.name === 'SemiRadioGroup';
  }

  private get _mergedType(): RadioType {
    return this._groupContext?.type ?? this.type ?? 'default';
  }

  private get _mergedDisabled(): boolean {
    return Boolean(this.disabled || this._groupContext?.disabled);
  }

  private get _isChecked(): boolean {
    if (this._isGroup) {
      return this._groupContext?.value === this.value;
    }
    return this.checked ?? this._checked;
  }

  private _cls(): string {
    const type = this._mergedType;
    return handleClsList([
      prefixCls,
      `${prefixCls}-${type}`,
      this._isChecked ? `${prefixCls}-checked` : '',
      this._mergedDisabled ? `${prefixCls}-disabled` : '',
      type === 'button' ? `${prefixCls}-button-${this._groupContext?.buttonStyle ?? 'solid'}` : '',
    ]);
  }

  private handleChange(ev: Event) {
    if (this._mergedDisabled) {
      ev.preventDefault();
      return;
    }

    if (!this._isGroup) {
      this._checked = true;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value, checked: true, event: ev },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    this._groupContext?.handleChange(this.value, ev);
  }

  render() {
    return html`
      <label class="${this._cls()}">
        <input
          class="${prefixCls}-input"
          type="radio"
          name=${this._groupContext?.inputName ?? nothing}
          .checked=${this._isChecked}
          .value=${String(this.value)}
          .disabled=${this._mergedDisabled}
          @change=${this.handleChange}
        />
        ${this._mergedType === 'button'
          ? nothing
          : html`<span class="${prefixCls}-inner"></span>`}
        <span class="${prefixCls}-addon"><slot></slot></span>
      </label>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-radio': SemiRadio
  }
}
