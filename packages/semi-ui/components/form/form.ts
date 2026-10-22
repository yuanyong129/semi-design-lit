import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { Size } from '../_utils/constant';
import { Data } from '../_utils/types';
import { FormContext, formInjectionContext, FormItemInfo } from './context';
import { FieldRule, ValidatedError } from './interface';
import { styles } from './style/form.style';

@customElement('semi-form')
export class SemiForm extends LitElement {
  /**
   * @zh 表单布局
   * @en Form layout
   * @values 'horizontal','vertical'
   * @defaultValue 'horizontal'
   */
  @property()
  layout: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * @zh 标签位置
   * @en Label position
   * @values 'top','left'
   * @defaultValue 'top'
   */
  @property({ attribute: 'label-position' })
  labelPosition: 'top' | 'left' = 'top';

  /**
   * @zh 标签对齐方式
   * @en Label alignment
   * @values 'left','right'
   * @defaultValue 'left'
   */
  @property({ attribute: 'label-align' })
  labelAlign: 'left' | 'right' = 'left';

  /**
   * @zh 标签宽度
   * @en Label width
   */
  @property({ attribute: 'label-width' })
  labelWidth?: number | string;

  /**
   * @zh 表单数据
   * @en Form data
   */
  @property({ attribute: false })
  model?: Data;

  /**
   * @zh 初始值
   * @en Initial values
   */
  @property({ attribute: false })
  initValues?: Data;

  /**
   * @zh 表单级校验规则
   * @en Form-level validation rules
   */
  @property({ attribute: false })
  rules?: Record<string, FieldRule | FieldRule[]>;

  /**
   * @zh 是否禁用整个表单
   * @en Whether the form is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 表单尺寸
   * @en Form size
   */
  @property()
  size?: Size;

  @state()
  private _values: Data = {};

  private _fields: FormItemInfo[] = [];

  private _provider = new ContextProvider(this, {
    context: formInjectionContext,
    initialValue: {} as FormContext,
  });

  connectedCallback() {
    super.connectedCallback();
    this._values = { ...(this.initValues ?? {}), ...(this.model ?? {}) };
    this._syncContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('model') && this.model) {
      this._values = { ...this._values, ...this.model };
    }
  }

  protected updated() {
    this._syncContext();
  }

  /** Current form values. */
  getValues(): Data {
    return { ...this._values };
  }

  /** Replace current form values. */
  setValues(values: Data) {
    this._values = { ...this._values, ...values };
    if (this.model) {
      Object.assign(this.model, values);
    }
    this.requestUpdate();
    this._emitValueChange();
  }

  /** Reset values to initValues and clear validation. */
  reset() {
    this._values = { ...(this.initValues ?? {}) };
    this._fields.forEach((field) => field.resetField());
    this.requestUpdate();
    this._emitValueChange();
    this.dispatchEvent(new CustomEvent('reset', {
      detail: { values: this.getValues() },
      bubbles: true,
      composed: true,
    }));
  }

  async validate(): Promise<undefined | Record<string, ValidatedError>> {
    const errors: Record<string, ValidatedError> = {};

    for (const field of this._fields) {
      const error = await field.validate();
      if (error) {
        errors[field.field] = error;
      }
    }

    return Object.keys(errors).length ? errors : undefined;
  }

  async validateField(
    field: string | string[],
    callback?: (errors: undefined | Record<string, ValidatedError>) => void
  ): Promise<undefined | Record<string, ValidatedError>> {
    const fields = Array.isArray(field) ? field : [field];
    const errors: Record<string, ValidatedError> = {};

    for (const name of fields) {
      const target = this._fields.find((item) => item.field === name);
      if (!target) continue;
      const error = await target.validate();
      if (error) errors[name] = error;
    }

    const result = Object.keys(errors).length ? errors : undefined;
    callback?.(result);
    return result;
  }

  private _emitValueChange() {
    const values = this.getValues();
    this.dispatchEvent(new CustomEvent('valueChange', {
      detail: { values },
      bubbles: true,
      composed: true,
    }));
  }

  private _addField = (field: FormItemInfo) => {
    if (!this._fields.some((item) => item.uid === field.uid)) {
      this._fields = [...this._fields, field];
      this.requestUpdate();
    }
  };

  private _removeField = (field: FormItemInfo) => {
    this._fields = this._fields.filter((item) => item.uid !== field.uid);
    this.requestUpdate();
  };

  private _setFieldValue = (field: string, value: any, event?: Event) => {
    this._values = { ...this._values, [field]: value };
    if (this.model) {
      this.model[field] = value;
    }
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('change', {
      detail: { values: this.getValues(), field, value, event },
      bubbles: true,
      composed: true,
    }));
    this._emitValueChange();
  }

  private _syncContext() {
    this._provider.setValue({
      layout: this.layout,
      disabled: this.disabled,
      labelAlign: this.labelAlign,
      labelPosition: this.labelPosition,
      labelWidth: this.labelWidth,
      model: this._values,
      size: this.size ?? 'default',
      rules: this.rules,
      fields: this._fields,
      touchedFields: this._fields,
      addField: this._addField,
      removeField: this._removeField,
      getFieldValue: (field) => this._values[field],
      getInitialValue: (field) => this.initValues?.[field],
      setFieldValue: this._setFieldValue,
      validateField: (field, callback) => this.validateField(field, callback),
      validate: () => this.validate(),
      reset: () => this.reset(),
    });
  }

  private _handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    void this.validate().then((errors) => {
      this.dispatchEvent(new CustomEvent(errors ? 'submitFail' : 'submit', {
        detail: { values: this.getValues(), errors },
        bubbles: true,
        composed: true,
      }));
    });
  };

  render() {
    return html`
      <form
        class="semi-form semi-form-${this.layout} semi-form-label-${this.labelPosition} semi-form-label-align-${this.labelAlign}"
        part="form"
        @submit=${this._handleSubmit}
      >
        <slot></slot>
      </form>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-form': SemiForm
  }
}
