import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ContextProvider } from "@lit/context";
import { RadioGroupContext, radioGroupContext, RadioType, RadioButtonStyle } from "./context";
import { RadioOption } from "./interface";
import { Direction } from "../_utils/constant";
import { getPrefixCls } from "../_utils/global-config";
import { styles } from "./style/radio.style";
import { isFunction, isNumber, isString } from "../_utils/is";
import './radio';

const prefixCls = getPrefixCls('radio-group');

@customElement('semi-radio-group')
export class SemiRadioGroup extends LitElement {
  /**
   * @zh 当前值（受控）
   * @en Current value (controlled)
   */
  @property({ attribute: false })
  value?: string | number | boolean;

  /**
   * @zh 默认值（非受控）
   * @en Default value (uncontrolled)
   */
  @property({ attribute: 'default-value', type: [String, Number, Boolean] })
  defaultValue: string | number | boolean = '';

  /**
   * @zh 单选框组类型
   * @en Radio group type
   * @values 'default','button','card'
   * @defaultValue 'default'
   */
  @property()
  type: RadioType = 'default';

  /**
   * @zh 按钮类型单选框的样式
   * @en Button style when type is 'button'
   * @values 'solid','outline'
   * @defaultValue 'solid'
   */
  @property({ attribute: 'button-style' })
  buttonStyle: RadioButtonStyle = 'solid';

  /**
   * @zh 选项
   * @en Options
   */
  @property({ attribute: false })
  options?: Array<string | number | RadioOption>;

  /**
   * @zh 排列方向
   * @en Layout direction
   */
  @property()
  direction: Direction = 'horizontal';

  /**
   * @zh 是否禁用
   * @en Whether the group is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 原生 name
   * @en Native name
   */
  @property()
  name?: string;

  @state()
  private _value: string | number | boolean = '';

  private _provider = new ContextProvider(this, {
    context: radioGroupContext,
    initialValue: {
      name: 'SemiRadioGroup',
      value: '',
      type: 'default',
      buttonStyle: 'solid',
      disabled: false,
      handleChange: () => undefined,
    } as RadioGroupContext,
  });

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue;
    this._syncContext();
  }

  protected updated() {
    this._syncContext();
  }

  private _syncContext() {
    this._provider.setValue({
      name: 'SemiRadioGroup',
      inputName: this.name,
      value: this.value ?? this._value,
      type: this.type,
      buttonStyle: this.buttonStyle,
      disabled: this.disabled,
      handleChange: this._handleChange,
    });
  }

  private _handleChange = (value: string | number | boolean, e: Event) => {
    if (this.value === undefined) {
      this._value = value;
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value, checked: true, event: e },
      bubbles: true,
      composed: true,
    }));
  };

  private _getOptions(): RadioOption[] {
    return (this.options ?? []).map((option) => {
      if (isString(option) || isNumber(option)) {
        return { label: option, value: option } as RadioOption;
      }
      return option;
    });
  }

  private _renderOptions() {
    const value = this.value ?? this._value;
    const options = this._getOptions();

    return options.map((option) => html`
      <semi-radio
        .value=${option.value}
        .disabled=${option.disabled}
        .checked=${value === option.value}
      >${isFunction(option.label) ? option.label({}) : option.label}</semi-radio>
    `);
  }

  render() {
    const options = this._getOptions();

    return html`
      <div
        class="${[
          prefixCls,
          `${prefixCls}-${this.type}`,
          `${prefixCls}-direction-${this.direction}`,
          this.type === 'button' ? `${prefixCls}-button-${this.buttonStyle}` : '',
          this.disabled ? `${prefixCls}-disabled` : '',
        ].filter(Boolean).join(' ')}"
        part="radio-group"
      >
        ${options.length > 0 ? this._renderOptions() : html`<slot></slot>`}
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-radio-group': SemiRadioGroup
  }
}
