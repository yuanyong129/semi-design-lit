import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import type { TreeNode, TreeNodeKey } from '../tree/interface';
import '../tree/tree';

const prefixCls = getPrefixCls('tree-select');
const p = unsafeCSS(prefixCls);

@customElement('semi-tree-select-popup')
export class SemiTreeSelectPopup extends LitElement {
  @property({ attribute: false })
  treeData: TreeNode[] = [];

  @property({ attribute: false })
  expandedKeys: TreeNodeKey[] = [];

  @property({ attribute: false })
  selectedKeys: TreeNodeKey[] = [];

  @property({ attribute: false })
  checkedKeys: TreeNodeKey[] = [];

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ type: Boolean })
  checkable: boolean = false;

  @property({ type: Boolean })
  checkStrictly: boolean = false;

  @property({ attribute: false })
  loadData?: (node: TreeNode) => Promise<unknown>;

  @property({ attribute: 'empty-text' })
  emptyText: string = '暂无数据';

  @property({ type: Boolean })
  searchable: boolean = false;

  @property({ attribute: 'search-value' })
  searchValue: string = '';

  @property({ attribute: 'search-placeholder' })
  searchPlaceholder?: string;

  @property({ attribute: false })
  topSlot?: TemplateResult;

  @property({ attribute: false })
  bottomSlot?: TemplateResult;

  @state()
  private _value = '';

  connectedCallback() {
    super.connectedCallback();
    this._value = this.searchValue;
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('searchValue')) this._value = this.searchValue;
  }

  /** Focus the search field when present. */
  focusSearch() {
    this.renderRoot.querySelector<HTMLInputElement>(`.${p}-search-input`)?.focus();
  }

  private _handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    this._value = value;
    this.dispatchEvent(new CustomEvent('search-input', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  };

  render() {
    return html`
      <div class="${p}-popover" role="listbox">
        ${this.topSlot ?? nothing}
        ${this.searchable
          ? html`<div class="${p}-search">
              <input
                class="${p}-search-input"
                .value=${this._value}
                placeholder=${this.searchPlaceholder ?? ''}
                @input=${this._handleInput}
              />
            </div>`
          : nothing}
        <div class="${p}-tree">
          <semi-tree
            .treeData=${this.treeData}
            .expandedKeys=${this.expandedKeys}
            .selectedKeys=${this.selectedKeys}
            .checkedKeys=${this.checkedKeys}
            .multiple=${this.multiple}
            .checkable=${this.checkable}
            .checkStrictly=${this.checkStrictly}
            .selectable=${!this.checkable}
            .emptyText=${this.emptyText}
            .loadData=${this.loadData}
          ></semi-tree>
        </div>
        ${this.bottomSlot ?? nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p}-popover {
      box-sizing: border-box;
      min-width: 240px;
      max-width: 360px;
      overflow: hidden;
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
      box-sizing: border-box;
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

    .${p}-tree {
      max-height: 320px;
      padding: 4px;
      overflow: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tree-select-popup': SemiTreeSelectPopup;
  }
}
