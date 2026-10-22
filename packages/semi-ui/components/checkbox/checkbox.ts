import { CSSResultGroup, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { CheckboxGroupContext, checkboxGroupContext } from './context';
import { FormItemContext, formItemInjectionContext } from '../form/context';
import { CheckboxValue } from './interface';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { styles } from './style/checkbox.style';
import '../../../semi-icons/build/check';
import '../../../semi-icons/build/minus';

const prefixCls = getPrefixCls('checkbox');

@customElement('semi-checkbox')
export class SemiCheckbox extends LitElement {
  /**
   * @zh 是否选中（受控）
   * @en Whether the checkbox is checked (controlled)
   */
  @property({ type: Boolean })
  checked?: boolean;

  /**
   * @zh 默认是否选中
   * @en Whether the checkbox is checked by default
   */
  @property({ attribute: 'default-checked', type: Boolean })
  defaultChecked: boolean = false;

  /**
   * @zh 选项值
   * @en Checkbox value
   */
  @property({ type: [String, Number, Boolean] })
  value: CheckboxValue = '';

  /**
   * @zh 是否禁用
   * @en Whether the checkbox is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否半选
   * @en Whether the checkbox is indeterminate
   */
  @property({ type: Boolean })
  indeterminate: boolean = false;

  /**
   * @zh 原生 name
   * @en Native name
   */
  @property()
  name?: string;

  @state()
  private _checked: boolean = false;

  @consume({ context: checkboxGroupContext, subscribe: true })
  private _groupContext?: CheckboxGroupContext;

  @consume({ context: formItemInjectionContext, subscribe: true })
  private _formItemContext?: FormItemContext;

  connectedCallback() {
    super.connectedCallback();
    this._checked = this.defaultChecked;
  }

  private get _isGroup(): boolean {
    return Boolean(this._groupContext);
  }

  private get _isChecked(): boolean {
    if (this._isGroup) {
      return this._groupContext!.value.includes(this.value);
    }
    return this.checked ?? this._checked;
  }

  private get _isDisabled(): boolean {
    return Boolean(this.disabled || this._groupContext?.disabled || this._formItemContext?.disabled);
  }

  private _cls(): string {
    return handleClsList([
      prefixCls,
      this._isChecked ? `${prefixCls}-checked` : '',
      this.indeterminate ? `${prefixCls}-indeterminate` : '',
      this._isDisabled ? `${prefixCls}-disabled` : '',
    ]);
  }

  private _handleChange(ev: Event) {
    const checked = (ev.target as HTMLInputElement).checked;

    if (this._isGroup) {
      this._groupContext!.handleChange(this.value, checked, ev);
      return;
    }

    if (this.checked === undefined) {
      this._checked = checked;
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked, value: this.value, event: ev },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const checked = this._isChecked;

    return html`
      <label class="${this._cls()}" part="checkbox">
        <input
          class="${prefixCls}-input"
          type="checkbox"
          name=${this.name ?? this._groupContext?.name ?? nothing}
          .checked=${checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this._isDisabled}
          @change=${this._handleChange}
        />
        <span class="${prefixCls}-indicator" aria-hidden="true">
          ${this.indeterminate
            ? html`<semi-icon-minus></semi-icon-minus>`
            : checked
              ? html`<semi-icon-check></semi-icon-check>`
              : nothing}
        </span>
        <span class="${prefixCls}-label"><slot></slot></span>
      </label>
    `;
  }

  static styles: CSSResultGroup = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-checkbox': SemiCheckbox
  }
}
