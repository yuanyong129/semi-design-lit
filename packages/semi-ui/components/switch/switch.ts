import { CSSResultGroup, html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { switchPrefixCls, styles } from "./style/switch.style";
import '../../../semi-icons/build/loading';
import { handleClsList } from "../_utils/web-utils";
import { useSize } from "../_hooks/use-size";
import { Size } from "../_utils/constant";

@customElement('semi-switch')
export class SemiSwitch extends LitElement {
  /**
   * @zh 当前选中状态（受控）
   * @en Current checked state (controlled)
   */
  @property({ type: Boolean })
  checked?: boolean;

  /**
   * @zh 默认选中状态（非受控）
   * @en Default checked state (uncontrolled)
   */
  @property({ attribute: 'default-checked', type: Boolean })
  defaultChecked: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the switch is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否为加载中状态
   * @en Whether the switch is loading
   */
  @property({ type: Boolean })
  loading: boolean = false;

  /**
   * @zh 开关尺寸
   * @en Switch size
   * @values 'small','default','large'
   */
  @property()
  size?: Size;

  /**
   * @zh 打开状态时的文案
   * @en Text shown when checked
   */
  @property({ attribute: 'checked-text' })
  checkedText?: string | TemplateResult;

  /**
   * @zh 关闭状态时的文案
   * @en Text shown when unchecked
   */
  @property({ attribute: 'unchecked-text' })
  uncheckedText?: string | TemplateResult;

  @state()
  private _checked: boolean = false;

  @state()
  private _mergedSize: Size = 'default';

  connectedCallback() {
    super.connectedCallback();
    this._checked = this.defaultChecked;
  }

  private get _isChecked(): boolean {
    return this.checked ?? this._checked;
  }

  private get _hasText(): boolean {
    return Boolean(this.checkedText || this.uncheckedText);
  }

  private cls(): string {
    return handleClsList([
      switchPrefixCls,
      this._mergedSize !== 'default' ? `${switchPrefixCls}-${this._mergedSize}` : '',
      this._isChecked ? `${switchPrefixCls}-checked` : '',
      this.disabled ? `${switchPrefixCls}-disabled` : '',
      this.loading ? `${switchPrefixCls}-loading` : '',
      this._hasText ? `${switchPrefixCls}-with-text` : '',
    ]);
  }

  private handleClick(ev: MouseEvent) {
    if (this.disabled || this.loading) {
      ev.preventDefault();
      return;
    }

    const next = !this._isChecked;
    if (this.checked === undefined) {
      this._checked = next;
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: next, value: next },
      bubbles: true,
      composed: true,
    }));
  }

  protected render() {
    const { mergedSize } = useSize(this, this.size);
    this._mergedSize = mergedSize;

    const text = this._isChecked ? this.checkedText : this.uncheckedText;

    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${this._isChecked}
        class="${this.cls()}"
        ?disabled=${this.disabled}
        part="switch"
        @click=${this.handleClick}
      >
        ${this._hasText
          ? html`<span class="${switchPrefixCls}-inner">
              <span class="${switchPrefixCls}-text">${text}</span>
            </span>`
          : nothing}
        <span class="${switchPrefixCls}-knob">
          ${this.loading
            ? html`<semi-icon-loading spin></semi-icon-loading>`
            : this._isChecked
              ? html`<slot name="checked-icon"></slot>`
              : html`<slot name="unchecked-icon"></slot>`}
        </span>
      </button>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-switch': SemiSwitch
  }
}
