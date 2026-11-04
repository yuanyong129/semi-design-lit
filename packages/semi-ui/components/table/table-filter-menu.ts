import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import { TableFilterOption } from './interface';

const prefixCls = getPrefixCls('table-filter');
const p = unsafeCSS(prefixCls);

@customElement('semi-table-filter-menu')
export class SemiTableFilterMenu extends LitElement {
  @property({ attribute: false })
  filters: TableFilterOption[] = [];

  @property({ attribute: false })
  selectedValues: Array<string | number | boolean> = [];

  @property({ type: Boolean })
  multiple: boolean = true;

  private _toggle(value: string | number | boolean) {
    const selected = new Set(this.selectedValues);
    if (this.multiple) {
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
    } else {
      selected.clear();
      if (!this.selectedValues.includes(value)) selected.add(value);
    }
    this.dispatchEvent(new CustomEvent('filterChange', {
      detail: { values: [...selected] },
      bubbles: true,
      composed: true,
    }));
  }

  private _reset() {
    this.dispatchEvent(new CustomEvent('filterChange', {
      detail: { values: [] },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="${prefixCls}" part="filter-menu">
        <div class="${prefixCls}-options">
          ${this.filters.map((filter) => html`
            <label class="${prefixCls}-option">
              <input
                type=${this.multiple ? 'checkbox' : 'radio'}
                name="table-filter"
                .checked=${this.selectedValues.includes(filter.value)}
                @change=${() => this._toggle(filter.value)}
              />
              <span>${filter.text}</span>
            </label>
          `)}
        </div>
        <div class="${prefixCls}-footer">
          <button type="button" @click=${this._reset}>重置</button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      min-width: 180px;
      padding: 4px;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
    }

    .${p}-options {
      max-height: 240px;
      overflow-y: auto;
    }

    .${p}-option {
      display: flex;
      gap: 8px;
      align-items: center;
      min-height: 32px;
      padding: 0 8px;
      color: var(--semi-color-text-0);
      font-size: 13px;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-option:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-option input {
      width: 14px;
      height: 14px;
      accent-color: var(--semi-color-primary);
      cursor: pointer;
    }

    .${p}-footer {
      display: flex;
      justify-content: flex-end;
      padding: 6px 8px 2px;
      border-top: 1px solid var(--semi-color-border);
    }

    .${p}-footer button {
      padding: 2px 8px;
      color: var(--semi-color-primary);
      font-family: inherit;
      font-size: 12px;
      background: transparent;
      border: none;
      cursor: pointer;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-table-filter-menu': SemiTableFilterMenu
  }
}
