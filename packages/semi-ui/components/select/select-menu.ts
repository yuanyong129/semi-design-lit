import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { SelectOption, SelectValue } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import '../../../semi-icons/build/check';

const prefixCls = getPrefixCls('select');
const p = unsafeCSS(prefixCls);

@customElement('semi-select-menu')
export class SemiSelectMenu extends LitElement {
  @property({ attribute: false })
  options: SelectOption[] = [];

  @property({ attribute: false })
  selectedValues: SelectValue[] = [];

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ type: Boolean })
  filter: boolean = false;

  @property({ attribute: 'empty-text' })
  emptyText: string = '暂无数据';

  @state()
  private _query: string = '';

  @query('input')
  private _input?: HTMLInputElement;

  protected firstUpdated() {
    if (this.filter) {
      this._input?.focus();
    }
  }

  private get _filteredOptions(): SelectOption[] {
    const query = this._query.trim().toLowerCase();
    if (!query) return this.options;
    return this.options.filter((option) => option.label.toLowerCase().includes(query));
  }

  private _handleSelect(option: SelectOption, event: MouseEvent) {
    if (option.disabled) return;
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('select', {
      detail: { option, event },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleSearch(event: Event) {
    this._query = (event.target as HTMLInputElement).value;
  }

  render() {
    const options = this._filteredOptions;

    return html`
      <div class="${prefixCls}-dropdown" part="dropdown">
        ${this.filter
          ? html`<div class="${prefixCls}-search">
              <input
                class="${prefixCls}-search-input"
                type="text"
                placeholder="搜索"
                .value=${this._query}
                @input=${this._handleSearch}
                @click=${(event: MouseEvent) => event.stopPropagation()}
              />
            </div>`
          : nothing}
        <div class="${prefixCls}-options" role="listbox">
          ${options.length
            ? options.map((option) => {
                const selected = this.selectedValues.includes(option.value);
                return html`
                  <div
                    class="${prefixCls}-option ${selected ? `${prefixCls}-option-selected` : ''} ${option.disabled ? `${prefixCls}-option-disabled` : ''}"
                    role="option"
                    aria-selected=${selected ? 'true' : 'false'}
                    aria-disabled=${option.disabled ? 'true' : nothing}
                    @click=${(event: MouseEvent) => this._handleSelect(option, event)}
                  >
                    <span class="${prefixCls}-option-label">${option.label}</span>
                    ${selected ? html`<semi-icon-check></semi-icon-check>` : nothing}
                  </div>
                `;
              })
            : html`<div class="${prefixCls}-empty">${this.emptyText}</div>`}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-select-menu': SemiSelectMenu
  }
}
