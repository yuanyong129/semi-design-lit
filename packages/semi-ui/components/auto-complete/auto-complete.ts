import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import '../trigger/trigger';
import './auto-complete-menu';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/search';
import {
  AutoCompleteDataItem,
  AutoCompleteOption,
  AutoCompleteSize,
  AutoCompleteTrigger,
  AutoCompleteValidateStatus,
} from './interface';

const prefixCls = getPrefixCls('autoComplete');
const p = unsafeCSS(prefixCls);
let autoCompleteId = 0;

interface FilteredOption extends AutoCompleteOption {
  label: string;
}

@customElement('semi-auto-complete')
export class SemiAutoComplete extends LitElement {
  @property()
  value?: string;

  @property({ attribute: 'default-value' })
  defaultValue: string = '';

  @property({ attribute: 'input-value' })
  inputValue?: string;

  @property({ attribute: false })
  data: AutoCompleteDataItem[] = [];

  @property({ type: Boolean })
  loading: boolean = false;

  @property()
  size: AutoCompleteSize = 'default';

  @property({ type: Boolean })
  disabled: boolean = false;

  @property()
  placeholder?: string;

  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = false;

  @property({ attribute: 'empty-content' })
  emptyContent: string = '';

  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  @property({ attribute: 'validate-status' })
  validateStatus: AutoCompleteValidateStatus = 'default';

  @property({ attribute: 'auto-focus', type: Boolean })
  autoFocus: boolean = false;

  @property({ type: Number })
  maxLength?: number;

  @property()
  position: 'top' | 'bottom' = 'bottom';

  @property()
  trigger: AutoCompleteTrigger = 'focus';

  @property()
  insetLabel?: string;

  @query('input')
  private _input?: HTMLInputElement;

  @state()
  private _query: string = '';

  @state()
  private _open: boolean = false;

  @state()
  private _activeIndex: number = -1;

  @state()
  private _focused: boolean = false;

  private readonly _listId = `${prefixCls}-listbox-${autoCompleteId++}`;

  connectedCallback() {
    super.connectedCallback();
    this._query = this.value ?? this.inputValue ?? this.defaultValue;
    if (this.defaultOpen) this._open = true;
  }

  protected firstUpdated() {
    if (this.autoFocus) this._input?.focus();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    const nextValue = this.inputValue ?? this.value;
    if (nextValue !== undefined && changed.has('value')) {
      this._query = nextValue;
    }
    if (nextValue !== undefined && changed.has('inputValue')) {
      this._query = nextValue;
    }
    if (changed.has('data')) {
      const count = this._options.length;
      if (this._activeIndex >= count) this._activeIndex = -1;
    }
  }

  /** Focus the input. */
  focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  /** Blur the input. */
  blur() {
    this._input?.blur();
  }

  /** Open the dropdown. */
  show() {
    this._setOpen(true);
  }

  /** Close the dropdown. */
  hide() {
    this._setOpen(false);
  }

  private _setOpen(open: boolean) {
    if (this._open === open) return;
    this._open = open;
    this.dispatchEvent(new CustomEvent('open-change', {
      detail: { open },
      bubbles: true,
      composed: true,
    }));
  }

  private _normalizeItem(item: AutoCompleteDataItem): FilteredOption | null {
    if (typeof item === 'string') return { value: item, label: item };
    if (item.value === undefined || item.value === null) return null;
    return { value: item.value, label: item.label ?? item.value, disabled: item.disabled };
  }

  private get _options(): FilteredOption[] {
    return this.data
      .map((item) => this._normalizeItem(item))
      .filter((item): item is FilteredOption => item !== null);
  }

  private _handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this._query = value;
    this._activeIndex = -1;
    this._setOpen(true);
    this.dispatchEvent(new CustomEvent('search', {
      detail: { inputValue: value },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleFocus() {
    this._focused = true;
    if (this.trigger === 'focus') this._setOpen(true);
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _handleClick() {
    if (this.disabled) return;
    if (this.trigger === 'click') this._setOpen(!this._open);
  }

  private _selectOption(option: FilteredOption, event: MouseEvent | KeyboardEvent) {
    if (option.disabled) return;
    if (this.value === undefined && this.inputValue === undefined) {
      this._query = option.value;
    }
    this._input?.focus();
    this._setOpen(false);
    this.dispatchEvent(new CustomEvent('select', {
      detail: { value: option.value, item: option, event },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: option.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;
    const options = this._options;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this._open) {
          this._setOpen(true);
          return;
        }
        if (!options.length) return;
        if (event.key === 'ArrowDown') {
          this._activeIndex = (this._activeIndex + 1) % options.length;
        } else {
          this._activeIndex = this._activeIndex <= 0
            ? options.length - 1
            : this._activeIndex - 1;
        }
        break;
      case 'Enter':
        if (!this._open) {
          event.preventDefault();
          this._setOpen(true);
          return;
        }
        if (options[this._activeIndex]) {
          event.preventDefault();
          this._selectOption(options[this._activeIndex], event);
        }
        break;
      case 'Escape':
        this._setOpen(false);
        break;
      case 'Tab':
        this._setOpen(false);
        break;
      default:
        break;
    }
  }

  private _handleClear(event: MouseEvent) {
    event.stopPropagation();
    this._query = '';
    this._activeIndex = -1;
    this._setOpen(true);
    this.dispatchEvent(new CustomEvent('clear', {
      detail: { value: '', event },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('search', {
      detail: { inputValue: '' },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
    this._input?.focus();
  }

  private _handleTriggerOpenChange(event: CustomEvent<{ open: boolean }>) {
    this._open = event.detail.open;
    if (!this._open) this._activeIndex = -1;
  }

  private _renderDropdown() {
    return html`
      <semi-auto-complete-menu
        .options=${this._options}
        .activeIndex=${this._activeIndex}
        .loading=${this.loading}
        .emptyContent=${this.emptyContent}
        .listId=${this._listId}
        @option-select=${this._handleOptionSelect}
      ></semi-auto-complete-menu>
    `;
  }

  private _handleOptionSelect = (
    event: CustomEvent<{ option: FilteredOption; event: MouseEvent }>
  ) => {
    this._selectOption(event.detail.option, event.detail.event);
  };

  render() {
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.size}`,
      this.disabled ? `${prefixCls}-disabled` : '',
      this._focused ? `${prefixCls}-focus` : '',
      this.validateStatus !== 'default' ? `${prefixCls}-${this.validateStatus}` : '',
      this.insetLabel ? `${prefixCls}-with-inset-label` : '',
    ]);

    return html`
      <semi-trigger
        .trigger=${'custom'}
        .open=${this._open}
        .position=${this.position}
        .align=${'start'}
        .content=${this._renderDropdown()}
        .disabled=${this.disabled}
        .showArrow=${false}
        .popupPlain=${true}
        .popupRole=${'listbox'}
        @openChange=${this._handleTriggerOpenChange}
      >
        <div class="${cls}" part="input" @click=${this._handleClick}>
          <span class="${prefixCls}-prefix">
            ${this.insetLabel
              ? html`<span class="${prefixCls}-inset-label">${this.insetLabel}</span>`
              : html`<slot name="prefix"></slot>`}
          </span>
          <input
            class="${prefixCls}-input"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded=${this._open ? 'true' : 'false'}
            aria-controls=${this._listId}
            aria-activedescendant=${this._activeIndex >= 0 ? `${this._listId}-option-${this._activeIndex}` : nothing}
            aria-invalid=${this.validateStatus === 'error' ? 'true' : nothing}
            aria-label=${this.getAttribute('aria-label') ?? 'AutoComplete'}
            ?disabled=${this.disabled}
            placeholder=${this.placeholder ?? ''}
            maxlength=${this.maxLength ?? nothing}
            .value=${this._query}
            @input=${this._handleInput}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @keydown=${this._handleKeyDown}
          />
          ${this.showClear && this._query && !this.disabled
            ? html`<button
                class="${prefixCls}-clear"
                type="button"
                aria-label="Clear"
                @click=${this._handleClear}
              ><semi-icon-close></semi-icon-close></button>`
            : nothing}
          <span class="${prefixCls}-suffix"><slot name="suffix"></slot></span>
        </div>
      </semi-trigger>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }

    semi-trigger {
      display: block;
      width: 100%;
    }

    .${p} {
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
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .${p}:hover {
      background-color: var(--semi-color-fill-1);
    }

    .${p}-focus {
      background-color: var(--semi-color-bg-2);
      border-color: var(--semi-color-focus-border);
    }

    .${p}-error {
      border-color: var(--semi-color-danger);
    }

    .${p}-warning {
      border-color: var(--semi-color-warning);
    }

    .${p}-success {
      border-color: var(--semi-color-success);
    }

    .${p}-small {
      min-height: 24px;
      padding: 0 8px;
      font-size: 12px;
    }

    .${p}-large {
      min-height: 40px;
      padding: 0 16px;
      font-size: 16px;
    }

    .${p}-disabled {
      color: var(--semi-color-disabled-text);
      background-color: var(--semi-color-disabled-fill);
    }

    .${p}-prefix,
    .${p}-suffix {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      color: var(--semi-color-text-2);
    }

    .${p}-prefix:empty,
    .${p}-suffix:empty {
      display: none;
    }

    .${p}-inset-label {
      margin-right: 8px;
      color: var(--semi-color-text-2);
    }

    .${p}-input {
      flex: 1;
      min-width: 0;
      height: 100%;
      padding: 0 4px;
      color: inherit;
      font: inherit;
      background: transparent;
      border: none;
      outline: none;
    }

    .${p}-input::placeholder {
      color: var(--semi-color-text-3);
    }

    .${p}-input:disabled {
      cursor: not-allowed;
    }

    .${p}-clear {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      padding: 0;
      color: var(--semi-color-text-3);
      font-size: 12px;
      background-color: var(--semi-color-fill-1);
      border: none;
      border-radius: 50%;
      cursor: pointer;
    }

    .${p}-dropdown {
      min-width: 200px;
      max-height: 320px;
      overflow: auto;
      padding: 4px;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
    }

    .${p}-option {
      display: flex;
      align-items: center;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 20px;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-option:hover,
    .${p}-option-active {
      background-color: var(--semi-color-fill-0);
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

    .${p}-empty,
    .${p}-loading {
      padding: 16px;
      color: var(--semi-color-text-3);
      font-size: 13px;
      text-align: center;
    }

    .${p}-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .${p}-loading-dot {
      width: 12px;
      height: 12px;
      border: 2px solid var(--semi-color-primary);
      border-right-color: transparent;
      border-radius: 50%;
      animation: ${unsafeCSS(prefixCls)}-spin 0.8s linear infinite;
    }

    @keyframes ${unsafeCSS(prefixCls)}-spin {
      to { transform: rotate(360deg); }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-auto-complete': SemiAutoComplete
  }
}
