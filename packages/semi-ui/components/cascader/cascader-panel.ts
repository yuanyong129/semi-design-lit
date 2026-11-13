import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CascaderData, CascaderPath, CascaderValue } from './interface';
import '../../../semi-icons/build/check';
import '../../../semi-icons/build/right';

const p = unsafeCSS('semi-cascader');

export interface CascaderPanelNode {
  data: CascaderData;
  value: CascaderValue;
  label: string | TemplateResult;
  labelText: string;
  path: CascaderPath;
  key: string;
  children: CascaderPanelNode[];
  disabled: boolean;
  isLeaf: boolean;
}

export interface CascaderSearchRow {
  node: CascaderPanelNode;
  label: string;
  matchStart: number;
  matchLength: number;
}

@customElement('semi-cascader-panel')
export class SemiCascaderPanel extends LitElement {
  @property({ attribute: false })
  columns: CascaderPanelNode[][] = [];

  @property({ attribute: false })
  searchRows: CascaderSearchRow[] = [];

  @property({ attribute: false })
  selectedKeys: string[] = [];

  @property({ attribute: false })
  halfKeys: string[] = [];

  @property({ attribute: false })
  activeKey: string = '';

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ type: Boolean })
  searching: boolean = false;

  @property({ attribute: false })
  loadingKeys: string[] = [];

  @property({ attribute: false })
  emptyContent: string | TemplateResult = '暂无数据';

  @property({ attribute: false })
  topSlot?: TemplateResult;

  @property({ attribute: false })
  bottomSlot?: TemplateResult;

  private _isChecked(node: CascaderPanelNode): boolean {
    return this.selectedKeys.includes(node.key);
  }

  private _isHalf(node: CascaderPanelNode): boolean {
    return this.halfKeys.includes(node.key);
  }

  private _isLoading(node: CascaderPanelNode): boolean {
    return this.loadingKeys.includes(node.key);
  }

  private _classes(node: CascaderPanelNode, extra: string[] = []): string {
    return [
      `${p}-option`,
      node.disabled ? `${p}-option-disabled` : '',
      this._isChecked(node) ? `${p}-option-select` : '',
      this.activeKey === node.key ? `${p}-option-active` : '',
      ...extra,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private _handleClick(node: CascaderPanelNode, event: MouseEvent) {
    if (node.disabled) return;
    this.dispatchEvent(
      new CustomEvent('option-click', {
        detail: { node, event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeydown(node: CascaderPanelNode, event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (node.disabled) return;
    event.preventDefault();
    this._handleClick(node, event as unknown as MouseEvent);
  }

  private _handleCheck(node: CascaderPanelNode, event: MouseEvent) {
    event.stopPropagation();
    if (node.disabled) return;
    this.dispatchEvent(
      new CustomEvent('option-check', {
        detail: { node, event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSearchClick(row: CascaderSearchRow, event: MouseEvent) {
    if (row.node.disabled) return;
    this.dispatchEvent(
      new CustomEvent('search-select', {
        detail: { row, event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderIndicator(node: CascaderPanelNode): TemplateResult | typeof nothing {
    if (!this.multiple) {
      return this._isChecked(node)
        ? html`<semi-icon-check class="${p}-option-icon ${p}-option-icon-active"></semi-icon-check>`
        : html`<span class="${p}-option-icon ${p}-option-icon-empty"></span>`;
    }
    return html`
      <span
        class="${p}-option-label-checkbox ${this._isChecked(node) ? `${p}-option-label-checkbox-checked` : ''} ${this._isHalf(node) ? `${p}-option-label-checkbox-indeterminate` : ''}"
        aria-hidden="true"
        @click=${(event: MouseEvent) => this._handleCheck(node, event)}
      >
        ${this._isChecked(node) ? html`<semi-icon-check></semi-icon-check>` : nothing}
      </span>
    `;
  }

  private _renderOption(node: CascaderPanelNode): TemplateResult {
    return html`
      <li
        class="${this._classes(node)}"
        role="menuitem"
        tabindex=${node.disabled ? -1 : 0}
        aria-disabled=${node.disabled ? 'true' : 'false'}
        aria-expanded=${!node.isLeaf ? 'true' : 'false'}
        @click=${(event: MouseEvent) => this._handleClick(node, event)}
        @keydown=${(event: KeyboardEvent) => this._handleKeydown(node, event)}
      >
        <span class="${p}-option-label">
          ${this._renderIndicator(node)}
          <span class="${p}-option-label-text">${node.label}</span>
        </span>
        ${this._isLoading(node)
          ? html`<span class="${p}-option-spin-icon"><span class="${p}-spinner"></span></span>`
          : !node.isLeaf
            ? html`<semi-icon-right class="${p}-option-icon ${p}-option-icon-expand"></semi-icon-right>`
            : nothing}
      </li>
    `;
  }

  private _renderSearch() {
    if (!this.searchRows.length) {
      return html`<ul class="${p}-option ${p}-option-empty"><span class="${p}-option-label">${this.emptyContent}</span></ul>`;
    }
    return html`
      <ul class="${p}-option-list" role="menu">
        ${this.searchRows.map((row) => {
          const label = row.label;
          const before = label.slice(0, row.matchStart);
          const matched = label.slice(row.matchStart, row.matchStart + row.matchLength);
          const after = label.slice(row.matchStart + row.matchLength);
          return html`
            <li
              class="${this._classes(row.node, [`${p}-option-flatten`])}"
              role="menuitem"
              tabindex=${row.node.disabled ? -1 : 0}
              aria-disabled=${row.node.disabled ? 'true' : 'false'}
              @click=${(event: MouseEvent) => this._handleSearchClick(row, event)}
              @keydown=${(event: KeyboardEvent) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                this._handleSearchClick(row, event as unknown as MouseEvent);
              }}
            >
              <span class="${p}-option-label">
                <span class="${p}-option-label-text">
                  ${before}${row.matchLength
                    ? html`<span class="${p}-option-label-highlight">${matched}</span>`
                    : nothing}${after}
                </span>
              </span>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private _renderColumns() {
    if (!this.columns.length) {
      return html`<ul class="${p}-option ${p}-option-empty"><span class="${p}-option-label">${this.emptyContent}</span></ul>`;
    }
    return html`
      <div class="${p}-option-lists">
        ${this.columns.map(
          (column) => html`
            <ul class="${p}-option-list" role="menu">
              ${column.length
                ? column.map((node) => this._renderOption(node))
                : html`<li class="${p}-option ${p}-option-empty"><span class="${p}-option-label">${this.emptyContent}</span></li>`}
            </ul>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="${p}-popover" role="listbox">
        ${this.topSlot ?? nothing}
        ${this.searching ? this._renderSearch() : this._renderColumns()}
        ${this.bottomSlot ?? nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p}-popover {
      min-width: 180px;
      max-width: calc(100vw - 32px);
      padding: 4px;
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium);
      background: var(--semi-color-bg-2);
      box-shadow: var(--semi-shadow-elevated);
      color: var(--semi-color-text-0);
      box-sizing: border-box;
    }

    .${p}-option-lists {
      display: flex;
      height: 180px;
      overflow: hidden;
    }

    .${p}-option-list {
      min-width: 150px;
      max-width: 240px;
      height: 100%;
      overflow-y: auto;
      margin: 0;
      padding: 4px 0;
      list-style: none;
      box-sizing: border-box;
      border-left: 1px solid var(--semi-color-border);
    }

    .${p}-option-list:first-child {
      border-left: none;
    }

    .${p}-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      height: 32px;
      padding: 0 8px 0 12px;
      border-radius: var(--semi-border-radius-small);
      cursor: pointer;
      box-sizing: border-box;
      outline: none;
      font-size: 14px;
      white-space: nowrap;
    }

    .${p}-option:hover,
    .${p}-option-active {
      background: var(--semi-color-fill-0);
    }

    .${p}-option-select {
      color: var(--semi-color-primary);
    }

    .${p}-option-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
      background: transparent;
    }

    .${p}-option-label {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .${p}-option-label-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .${p}-option-label-highlight {
      color: var(--semi-color-primary);
      font-weight: 600;
    }

    .${p}-option-icon {
      flex: 0 0 auto;
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    .${p}-option-icon-empty {
      display: inline-block;
    }

    .${p}-option-icon-active {
      color: var(--semi-color-primary);
    }

    .${p}-option-icon-expand {
      margin-right: 0;
      color: var(--semi-color-text-2);
    }

    .${p}-option-label-checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      border: 1px solid var(--semi-color-border);
      border-radius: 3px;
      background: var(--semi-color-bg-2);
      box-sizing: border-box;
      color: #fff;
    }

    .${p}-option-label-checkbox-checked,
    .${p}-option-label-checkbox-indeterminate {
      border-color: var(--semi-color-primary);
      background: var(--semi-color-primary);
    }

    .${p}-option-label-checkbox-indeterminate::after {
      content: '';
      width: 8px;
      height: 2px;
      border-radius: 1px;
      background: #fff;
    }

    .${p}-option-label-checkbox semi-icon-check {
      width: 12px;
      height: 12px;
    }

    .${p}-option-flatten {
      height: 32px;
    }

    .${p}-option-empty {
      justify-content: center;
      color: var(--semi-color-text-2);
      cursor: default;
      height: auto;
      min-height: 40px;
    }

    .${p}-option-spin-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
    }

    .${p}-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--semi-color-primary-light-default, rgba(0, 100, 250, 0.2));
      border-top-color: var(--semi-color-primary);
      border-radius: 50%;
      animation: semi-cascader-spin 0.8s linear infinite;
    }

    @keyframes semi-cascader-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${p}-spinner {
        animation-duration: 2s;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-cascader-panel': SemiCascaderPanel;
  }
}
