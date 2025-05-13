import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { RadioGroupContext, radioGroupContext, RadioType } from "./context";
import { Direction, Size } from "../_utils/constant";
import { RadioOption } from "./interface";
import { getPrefixCls } from "../_utils/global-config";
import { RenderContent } from "../_utils/types";
import { styles } from "./style/radio.style";
import { useFormItem } from "../_hooks/use-form-item";
import { useSize } from "../_hooks/use-size";
import { isFunction, isNumber, isString } from "../_utils/is";
import { provide } from "@lit/context";
import { FormItemEventHandler } from "../form/interface";
import './radio';
import { handleCustomSlot } from "components/_utils/dom";

const prefixCls = getPrefixCls('radio-group');

@customElement('a-radio-group')
export class ArcoRadioGroup extends LitElement {
  /**
   * @zh 默认值（非受控状态）
   * @en Default value (uncontrolled state)
   */
  @property({ type: [String, Number, Boolean] })
  defaultValue: string | number | boolean = '';
  /**
   * @zh 单选框组的类型
   * @en Types of radio group
   * @values 'radio', 'button'
   */
  @property()
  type: RadioType = 'radio';
  /**
   * @zh 单选框组的尺寸
   * @en The size of the radio group
   * @values 'mini','small','medium','large'
   */
  @property()
  size?: Size;
  /**
   * @zh 选项
   * @en Options
   */
  @property()
  options?: Array<string | number | RadioOption>;
  /**
   * @zh 单选框组的方向
   * @en The direction of the radio group
   * @values 'horizontal', 'vertical'
   */
  @property()
  direction: Direction = 'horizontal';
  /**
   * @zh 是否禁用
   * @en Whether to disable
   */
  @property({ type: Boolean })
  disabled: boolean = false;
  /**
   * @zh radio 文案内容
   * @en radio label content
   * @slot label
   * @binding {RadioOption} data
   */
   /**
   * @zh 自定义单选框
   * @en Custom radio
   * @slot radio
   * @binding {boolean} checked
   * @binding {boolean} disabled
   */
  @property()
  slots?: Record<'label' | 'radio', RenderContent>;

  @state()
  _size?: Size;

  @state()
  _type?: RadioType;
  
  @state()
  _disabled?: boolean;

  @state()
  _value: string | number | boolean = '';

  @provide({ context: radioGroupContext })
  @state()
  _context = {} as RadioGroupContext;  

  cls(mergedSize: Size, mergedDisabled: boolean) {
    return [
      `${prefixCls}${this._type === 'button' ? '-button' : ''}`,
      `${prefixCls}-size-${mergedSize}`,
      `${prefixCls}-direction-${this.direction}`,
      {
        [`${prefixCls}-disabled`]: mergedDisabled,
      },
    ]
  }

  getOptions(){
    return (this.options ?? []).map((option) => {
      if (isString(option) || isNumber(option)) {
        return {
          label: option,
          value: option,
        } as RadioOption;
      }
      return option;
    });
  };

  handleChange(eventHandlers: FormItemEventHandler) {
    return (value: string | number | boolean, e: Event) => {
      this._value = value;
      this.dispatchEvent(new CustomEvent('change', { detail: { value, e } }))
      eventHandlers?.onChange?.(e);
    };
  }

  renderRadioOptions() {
    return this.getOptions().map((option) => (html`
      <a-radio
        key="${option.value}"
        value="${option.value}"
        disabled="${option.disabled}"
        defaultValue="${this._value === option.value}"
      >
        ${this.slots?.label
          ? handleCustomSlot(this.slots?.label, { data: option })
          : isFunction(option?.label)
          ? option?.label({})
          : option?.label}
      </a-radio>
    `));
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._size = this.size;
    this._type = this.type;
    this._disabled = this.disabled;
    this._value = this.defaultValue;
  }

  protected render() {
    const {
      mergedDisabled,
      mergedSize: _mergedSize,
      eventHandlers,
    } = useFormItem(this, {
      size: this._size,
      disabled: this._disabled,
    });

    const { mergedSize } = useSize(this, _mergedSize);

    this._context = {
      name: 'ArcoRadioGroup',
      value: this._value,
      size: mergedSize,
      type: this._type || 'radio',
      disabled: mergedDisabled,
      slots: this.slots ?? {},
      handleChange: this.handleChange(eventHandlers),
    }

    return html`
     <span class=${this.cls(mergedSize, mergedDisabled)}>
      ${this.getOptions().length > 0 ? this.renderRadioOptions() : html`<slot></slot>`}
    </span>
    `;
  }

  static styles = styles; 
}


declare global {
  interface HTMLElementTagNameMap {
    'a-radio-group': ArcoRadioGroup
  }
}
