import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { SelectOption, SelectValue } from './interface';
import type { SemiTrigger } from '../trigger/trigger';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import { Size } from '../_utils/constant';
import '../trigger/trigger';
import './select-menu';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/down';

const prefixCls = getPrefixCls('select');
const p = unsafeCSS(prefixCls);

@customElement('semi-select')
export class SemiSelect extends LitElement {
  /**
   * @zh 选项
   * @en Options
   */
  @property({ attribute: false })
  options: SelectOption[] = [];

  /**
   * @zh 当前值（受控）
   * @en Current value (controlled)
   */
  @property({ attribute: false })
  value?: SelectValue | SelectValue[];

  /**
   * @zh 默认值
   * @en Default value
   */
  @property({ attribute: false })
  defaultValue?: SelectValue | SelectValue[];

  /**
   * @zh 是否多选
   * @en Whether multiple selection is enabled
   */
  @property({ type: Boolean })
  multiple: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the select is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否可搜索
   * @en Whether the select is searchable
   */
  @property({ type: Boolean })
  filter: boolean = false;

  /**
   * @zh 是否显示清除按钮
   * @en Whether to show the clear button
   */
  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = true;

  /**
   * @zh 占位文字
   * @en Placeholder
   */
  @property()
  placeholder?: string;

  /**
   * @zh 空数据文案
   * @en Empty text
   */
  @property({ attribute: 'empty-text' })
  emptyText: string = '暂无数据';

  /**
   * @zh 尺寸
   * @en Size
   */
  @property()
  size?: Size;

  /**
   * @zh 默认是否展开
   * @en Whether open by default
   */
  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  @state()
  private _value: SelectValue | SelectValue[] | undefined;

  @query('semi-trigger')
  private _trigger?: SemiTrigger;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue;
  }

  /** Open the dropdown programmatically. */
  show() {
    this._trigger?.show();
  }

  /** Close the dropdown programmatically. */
  hide() {
    this._trigger?.hide();
  }

  private get _currentValue(): SelectValue | SelectValue[] | undefined {
    return this.value ?? this._value;
  }

  private get _selectedValues(): SelectValue[] {
    const value = this._currentValue;
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
  }

  private get _selectedOptions(): SelectOption[] {
    const values = this._selectedValues;
    return this.options.filter((option) => values.includes(option.value));
  }

  private get _hasValue(): boolean {
    return this._selectedValues.length > 0;
  }

  private _setValue(value: SelectValue | SelectValue[] | undefined) {
    if (this.value === undefined) {
      this._value = value;
    }
  }

  private _handleOptionClick(option: SelectOption, event: MouseEvent) {
    if (option.disabled) return;
    event.stopPropagation();

    let next: SelectValue | SelectValue[];
    if (this.multiple) {
      const current = this._selectedValues;
      next = current.includes(option.value)
        ? current.filter((value) => value !== option.value)
        : [...current, option.value];
    } else {
      next = option.value;
    }

    this._setValue(next);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: next, option, event },
      bubbles: true,
      composed: true,
    }));

    if (!this.multiple) {
      this._trigger?.hide();
    }
  }

  private _handleMenuSelect(event: CustomEvent<{ option: SelectOption; event: MouseEvent }>) {
    this._handleOptionClick(event.detail.option, event.detail.event);
  }

  private _handleClear(event: MouseEvent) {
    event.stopPropagation();
    const next = this.multiple ? [] : undefined;
    this._setValue(next);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: next, option: undefined, event },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderSelection() {
    const selected = this._selectedOptions;
    if (!selected.length) {
      return html`<span class="${prefixCls}-placeholder">${this.placeholder ?? ''}</span>`;
    }

    if (!this.multiple) {
      return html`<span class="${prefixCls}-value">${selected[0].label}</span>`;
    }

    return selected.map((option) => html`
      <span class="${prefixCls}-tag">
        <span class="${prefixCls}-tag-label">${option.label}</span>
        <button
          class="${prefixCls}-tag-close"
          type="button"
          aria-label="Remove"
          @click=${(event: MouseEvent) => this._handleOptionClick(option, event)}
        ><semi-icon-close></semi-icon-close></button>
      </span>
    `);
  }

  private _renderDropdown() {
    return html`
      <semi-select-menu
        .options=${this.options}
        .selectedValues=${this._selectedValues}
        .multiple=${this.multiple}
        .filter=${this.filter}
        .emptyText=${this.emptyText}
        @select=${(event: CustomEvent) => this._handleMenuSelect(event)}
      ></semi-select-menu>
    `;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      this.size ? `${prefixCls}-${this.size}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this.multiple ? `${prefixCls}-multiple` : '',
    ]);

    return html`
      <div class="${cls}" part="select">
        <semi-trigger
          .trigger=${'click'}
          position="bottom"
          align="start"
          .content=${this._renderDropdown()}
          .defaultOpen=${this.defaultOpen}
          .disabled=${this.disabled}
          .showArrow=${false}
          .popupPlain=${true}
        >
          <div class="${prefixCls}-selector" part="selector">
            <div class="${prefixCls}-selection">${this._renderSelection()}</div>
            ${this.showClear && this._hasValue && !this.disabled
              ? html`<span
                  class="${prefixCls}-clear"
                  role="button"
                  aria-label="Clear"
                  @click=${this._handleClear}
                ><semi-icon-close></semi-icon-close></span>`
              : nothing}
            <span class="${prefixCls}-arrow"><semi-icon-down></semi-icon-down></span>
          </div>
        </semi-trigger>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }

    .${p}-selector {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      background-color: var(--semi-color-fill-0);
      border: 1px solid transparent;
      border-radius: 3px;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .${p}-selector:hover {
      background-color: var(--semi-color-fill-1);
    }

    .${p}-small .${p}-selector {
      min-height: 24px;
      padding: 0 8px;
      font-size: 12px;
    }

    .${p}-large .${p}-selector {
      min-height: 40px;
      padding: 0 16px;
      font-size: 16px;
    }

    .${p}-selection {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
      min-width: 0;
    }

    .${p}-placeholder {
      color: var(--semi-color-text-3);
    }

    .${p}-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-tag {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      padding: 0 4px 0 8px;
      color: var(--semi-color-text-0);
      font-size: 12px;
      line-height: 20px;
      background-color: var(--semi-color-fill-1);
      border-radius: 3px;
    }

    .${p}-tag-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-tag-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-left: 2px;
      padding: 0;
      color: var(--semi-color-text-3);
      font-size: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .${p}-clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      color: var(--semi-color-text-3);
      font-size: 12px;
      background-color: var(--semi-color-fill-1);
      border-radius: 50%;
      cursor: pointer;
    }

    .${p}-arrow {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      color: var(--semi-color-text-2);
      font-size: 12px;
      transition: transform 0.2s ease;
    }

    .${p}-dropdown {
      min-width: 200px;
      max-height: 320px;
      overflow: auto;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
    }

    .${p}-search {
      padding: 8px;
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-search-input {
      width: 100%;
      height: 28px;
      padding: 0 8px;
      font-family: inherit;
      font-size: 13px;
      background-color: var(--semi-color-fill-0);
      border: 1px solid transparent;
      border-radius: 3px;
      outline: none;
    }

    .${p}-search-input:focus {
      border-color: var(--semi-color-focus-border);
    }

    .${p}-options {
      padding: 4px;
    }

    .${p}-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 20px;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-option:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-option-selected {
      color: var(--semi-color-primary);
      font-weight: 500;
    }

    .${p}-option-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-option-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-empty {
      padding: 16px;
      color: var(--semi-color-text-3);
      font-size: 13px;
      text-align: center;
    }

    .${p}-disabled .${p}-selector {
      color: var(--semi-color-disabled-text);
      background-color: var(--semi-color-disabled-fill);
      cursor: not-allowed;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-select': SemiSelect
  }
}
