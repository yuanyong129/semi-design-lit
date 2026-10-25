import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ContextProvider } from '@lit/context';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { FormContext, formInjectionContext, formItemInjectionContext, FormItemInfo, FormItemContext } from './context';
import { FieldRule, ValidatedError, ValidateStatus, ValidateTrigger } from './interface';
import { validateValue } from './validate';
import { handleClsList } from '../_utils/web-utils';
import { styles } from './style/form.style';

let uid = 0;

@customElement('semi-form-item')
export class SemiFormItem extends LitElement {
  /**
   * @zh 字段名
   * @en Field name
   */
  @property()
  field?: string;

  /**
   * @zh 标签
   * @en Label
   */
  @property()
  label?: string;

  /**
   * @zh 是否必填
   * @en Whether the field is required
   */
  @property({ type: Boolean })
  required?: boolean;

  /**
   * @zh 校验规则
   * @en Validation rules
   */
  @property({ attribute: false })
  rules?: FieldRule | FieldRule[];

  /**
   * @zh 帮助文字
   * @en Help text
   */
  @property()
  help?: string;

  /**
   * @zh 额外说明
   * @en Extra description
   */
  @property()
  extra?: string;

  /**
   * @zh 校验状态
   * @en Validate status
   */
  @property({ attribute: 'validate-status' })
  validateStatus?: ValidateStatus;

  /**
   * @zh 是否隐藏标签
   * @en Whether to hide the label
   */
  @property({ attribute: 'no-label', type: Boolean })
  noLabel: boolean = false;

  /**
   * @zh 标签宽度
   * @en Label width
   */
  @property({ attribute: 'label-width' })
  labelWidth?: number | string;

  /**
   * @zh 是否禁用
   * @en Whether the field is disabled
   */
  @property({ type: Boolean })
  disabled?: boolean;

  /**
   * @zh 校验触发时机
   * @en When to trigger validation
   */
  @property({ attribute: false })
  validateTrigger: ValidateTrigger[] = ['change', 'blur'];

  @state()
  private _status: ValidateStatus | '' = '';

  @state()
  private _message: string = '';

  @consume({ context: formInjectionContext, subscribe: true })
  private _formCtx?: FormContext;

  private _uid = ++uid;
  private _registered = false;

  private _provider = new ContextProvider(this, {
    context: formItemInjectionContext,
    initialValue: {} as FormItemContext,
  });

  private _fieldInfo: FormItemInfo = {
    uid: this._uid,
    field: '',
    disabled: false,
    error: false,
    validate: () => this._validate(),
    clearValidate: () => this._clearValidate(),
    resetField: () => this._resetField(),
    setField: () => undefined,
  };

  connectedCallback() {
    super.connectedCallback();
    this._syncContext();
  }

  protected updated() {
    this._register();
    this._syncContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._formCtx && this._registered) {
      this._formCtx.removeField(this._fieldInfo);
      this._registered = false;
    }
  }

  private get _mergedStatus(): ValidateStatus | '' {
    return this.validateStatus ?? this._status;
  }

  private get _isRequired(): boolean {
    if (this.required !== undefined) return this.required;
    const rules = this._rulesList;
    return rules.some((rule) => rule.required);
  }

  private get _rulesList(): FieldRule[] {
    const local = this.rules ? (Array.isArray(this.rules) ? this.rules : [this.rules]) : [];
    const formRules = this.field ? this._formCtx?.rules?.[this.field] : undefined;
    const remote = formRules ? (Array.isArray(formRules) ? formRules : [formRules]) : [];
    return [...remote, ...local];
  }

  private get _labelPosition(): 'top' | 'left' {
    return this._formCtx?.labelPosition ?? 'top';
  }

  private get _labelWidth(): number | string | undefined {
    return this.labelWidth ?? this._formCtx?.labelWidth;
  }

  private _register() {
    if (this._registered || !this._formCtx || !this.field) return;
    this._fieldInfo = {
      uid: this._uid,
      field: this.field,
      label: this.label,
      disabled: Boolean(this.disabled || this._formCtx.disabled),
      error: this._mergedStatus === 'error',
      labelWidth: this._labelWidth,
      validate: () => this._validate(),
      clearValidate: () => this._clearValidate(),
      resetField: () => this._resetField(),
      setField: ({ value, status, message }) => {
        if (value !== undefined) this._formCtx?.setFieldValue(this.field!, value);
        this._status = status ?? '';
        this._message = message ?? '';
      },
    };
    this._formCtx.addField(this._fieldInfo);
    this._registered = true;

    const initial = this._formCtx.getFieldValue(this.field);
    if (initial !== undefined) {
      this._applyControlValue(initial);
    }
  }

  private _applyControlValue(value: any) {
    const control = this.querySelector(
      'semi-input, semi-textarea, semi-input-number, semi-checkbox, semi-checkbox-group, semi-radio-group, semi-switch, semi-select, semi-date-picker'
    ) as any;
    if (!control) return;
    if ('value' in control) control.value = value;
    if ('checked' in control) control.checked = Boolean(value);
    control.requestUpdate?.();
  }

  private _syncContext() {
    this._provider.setValue({
      eventHandlers: {},
      size: this._formCtx?.size,
      disabled: Boolean(this.disabled || this._formCtx?.disabled),
      error: this._mergedStatus === 'error',
      feedback: this._message,
      updateValidateState: (_field, { status, message }) => {
        this._status = status;
        this._message = message;
      },
    });
  }

  private _clearValidate() {
    this._status = '';
    this._message = '';
  }

  private _resetField() {
    this._clearValidate();
    const initial = this.field ? this._formCtx?.getInitialValue(this.field) : undefined;
    const resetValue = initial === undefined ? '' : initial;
    this._applyControlValue(resetValue);
  }

  private _extractValue(event: Event): unknown {
    const detail = (event as CustomEvent).detail;
    if (detail && typeof detail === 'object' && 'value' in detail) {
      return detail.value;
    }
    const target = event.target as any;
    if (target && 'value' in target) return target.value;
    if (target && 'checked' in target) return target.checked;
    return undefined;
  }

  private async _handleValueEvent(event: Event) {
    if (!this.field) return;
    const value = this._extractValue(event);
    if (value === undefined) return;
    this._formCtx?.setFieldValue(this.field, value, event);

    if (this.validateTrigger.includes('change')) {
      await this._validate();
    }
  }

  private async _handleInput(event: Event) {
    if (!this.field) return;
    const value = this._extractValue(event);
    if (value === undefined) return;
    this._formCtx?.setFieldValue(this.field, value, event);

    if (this.validateTrigger.includes('input')) {
      await this._validate();
    }
  }

  private async _handleBlur() {
    if (this.validateTrigger.includes('blur')) {
      await this._validate();
    }
  }

  private async _validate(): Promise<ValidatedError | undefined> {
    if (!this.field) return undefined;

    const label = this.label || this.field;
    const value = this._formCtx?.getFieldValue(this.field);
    const rules = this._rulesList;

    if (!rules.length) {
      this._clearValidate();
      return undefined;
    }

    const result = await validateValue(value, rules, { label });
    if (result) {
      this._status = result.status;
      this._message = result.message;
      return {
        label,
        field: this.field,
        value,
        type: 'validate',
        isRequiredError: rules.some((rule) => rule.required),
        message: result.message,
      };
    }

    this._status = '';
    this._message = '';
    return undefined;
  }

  private _labelStyle(): StyleInfo {
    const width = this._labelWidth;
    if (width === undefined) return {};
    return {
      flex: `0 0 ${typeof width === 'number' ? `${width}px` : width}`,
      maxWidth: typeof width === 'number' ? `${width}px` : width,
    };
  }

  render() {
    const status = this._mergedStatus;
    const hasLabel = !this.noLabel && Boolean(this.label);
    const cls = handleClsList([
      'semi-form-item',
      `semi-form-item-label-${this._labelPosition}`,
      status ? `semi-form-item-${status}` : '',
      this._formCtx?.layout === 'vertical' ? 'semi-form-item-vertical' : '',
    ]);

    return html`
      <div class="${cls}" part="form-item">
        ${hasLabel
          ? html`
              <div class="semi-form-item-label" style="${styleMap(this._labelStyle())}">
                <label>
                  ${this._isRequired ? html`<span class="semi-form-item-required">*</span>` : nothing}
                  ${this.label}
                </label>
              </div>
            `
          : nothing}
        <div class="semi-form-item-content">
          <div
            class="semi-form-item-control"
            @change=${this._handleValueEvent}
            @input=${this._handleInput}
            @focusout=${this._handleBlur}
          >
            <slot></slot>
          </div>
          ${this._message
            ? html`<div class="semi-form-item-message" role="alert">${this._message}</div>`
            : this.help
              ? html`<div class="semi-form-item-help">${this.help}</div>`
              : nothing}
          ${this.extra ? html`<div class="semi-form-item-extra">${this.extra}</div>` : nothing}
        </div>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-form-item': SemiFormItem
  }
}
