import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { CheckboxGroupContext, checkboxGroupContext } from './context';
import { CheckboxOption, CheckboxValue } from './interface';
import { Direction } from '../_utils/constant';
import { getPrefixCls } from '../_utils/global-config';
import { styles } from './style/checkbox.style';
import './checkbox';

const prefixCls = getPrefixCls('checkbox-group');

@customElement('semi-checkbox-group')
export class SemiCheckboxGroup extends LitElement {
  /**
   * @zh 当前选中值（受控）
   * @en Current checked values (controlled)
   */
  @property({ attribute: false })
  value?: CheckboxValue[];

  /**
   * @zh 默认选中值
   * @en Default checked values
   */
  @property({ attribute: false })
  defaultValue: CheckboxValue[] = [];

  /**
   * @zh 选项
   * @en Options
   */
  @property({ attribute: false })
  options?: CheckboxOption[];

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
  name: string = 'SemiCheckboxGroup';

  @state()
  private _value: CheckboxValue[] = [];

  private _provider = new ContextProvider(this, {
    context: checkboxGroupContext,
    initialValue: {} as CheckboxGroupContext,
  });

  connectedCallback() {
    super.connectedCallback();
    this._value = [...this.defaultValue];
    this._syncContext();
  }

  protected updated() {
    this._syncContext();
  }

  private _syncContext() {
    this._provider.setValue({
      name: this.name,
      value: this.value ?? this._value,
      disabled: this.disabled,
      handleChange: this._handleChange,
    });
  }

  private _handleChange = (value: CheckboxValue, checked: boolean, event: Event) => {
    const current = this.value ?? this._value;
    const next = checked
      ? [...current.filter((item) => item !== value), value]
      : current.filter((item) => item !== value);

    if (this.value === undefined) {
      this._value = next;
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: next, checked, event },
      bubbles: true,
      composed: true,
    }));
  };

  private _renderOptions() {
    const value = this.value ?? this._value;

    return (this.options ?? []).map((option) => html`
      <semi-checkbox
        .value=${option.value}
        .checked=${value.includes(option.value)}
        .disabled=${option.disabled}
        .indeterminate=${option.indeterminate}
      >${option.label}</semi-checkbox>
    `);
  }

  render() {
    const hasOptions = Boolean(this.options?.length);

    return html`
      <div
        class="${prefixCls} ${prefixCls}-${this.direction} ${this.disabled ? `${prefixCls}-disabled` : ''}"
        part="checkbox-group"
      >
        ${hasOptions ? this._renderOptions() : html`<slot></slot>`}
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-checkbox-group': SemiCheckboxGroup
  }
}
