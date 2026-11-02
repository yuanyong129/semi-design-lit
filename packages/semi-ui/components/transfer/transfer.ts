import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TransferChangeDetail, TransferDirection, TransferItem, TransferKey } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import '../../../semi-icons/build/left';
import '../../../semi-icons/build/right';
import '../../../semi-icons/build/search';

const prefixCls = getPrefixCls('transfer');
const p = unsafeCSS(prefixCls);

@customElement('semi-transfer')
export class SemiTransfer extends LitElement {
  /**
   * @zh 数据源
   * @en Data source
   */
  @property({ attribute: false })
  dataSource: TransferItem[] = [];

  /**
   * @zh 右侧列表 key（受控）
   * @en Target keys (controlled)
   */
  @property({ attribute: false })
  targetKeys?: TransferKey[];

  /**
   * @zh 默认右侧列表 key
   * @en Default target keys
   */
  @property({ attribute: false })
  defaultTargetKeys: TransferKey[] = [];

  /**
   * @zh 左右列表标题
   * @en Panel titles
   */
  @property({ attribute: false })
  titles: [string, string] = ['待选', '已选'];

  /**
   * @zh 是否显示搜索
   * @en Whether to show search
   */
  @property({ attribute: 'show-search', type: Boolean })
  showSearch: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the transfer is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  @state()
  private _targetKeys = new Set<TransferKey>();

  @state()
  private _leftSelected = new Set<TransferKey>();

  @state()
  private _rightSelected = new Set<TransferKey>();

  @state()
  private _leftQuery = '';

  @state()
  private _rightQuery = '';

  connectedCallback() {
    super.connectedCallback();
    this._targetKeys = new Set(this.defaultTargetKeys);
  }

  private get _targetSet(): Set<TransferKey> {
    return new Set(this.targetKeys ?? [...this._targetKeys]);
  }

  private _sourceData(): TransferItem[] {
    const target = this._targetSet;
    return this.dataSource.filter((item) => !target.has(item.key));
  }

  private _targetData(): TransferItem[] {
    const target = this._targetSet;
    return this.dataSource.filter((item) => target.has(item.key));
  }

  private _filter(items: TransferItem[], query: string): TransferItem[] {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((item) => item.label.toLowerCase().includes(value));
  }

  private _select(item: TransferItem, side: TransferDirection) {
    if (this.disabled || item.disabled) return;
    const selected = side === 'left' ? this._leftSelected : this._rightSelected;
    if (selected.has(item.key)) selected.delete(item.key);
    else selected.add(item.key);
    if (side === 'left') this._leftSelected = new Set(selected);
    else this._rightSelected = new Set(selected);
  }

  private _selectAll(items: TransferItem[], side: TransferDirection) {
    if (this.disabled) return;
    const selectable = items.filter((item) => !item.disabled).map((item) => item.key);
    const selected = side === 'left' ? this._leftSelected : this._rightSelected;
    const allSelected = selectable.length > 0 && selectable.every((key) => selected.has(key));
    const next = new Set(selected);
    selectable.forEach((key) => {
      if (allSelected) next.delete(key);
      else next.add(key);
    });
    if (side === 'left') this._leftSelected = next;
    else this._rightSelected = next;
  }

  private _move(direction: TransferDirection) {
    if (this.disabled) return;
    const selected = direction === 'right' ? this._leftSelected : this._rightSelected;
    const keys = [...selected].filter((key) => {
      const item = this.dataSource.find((entry) => entry.key === key);
      return item && !item.disabled;
    });
    if (!keys.length) return;

    const next = this._targetSet;
    keys.forEach((key) => {
      if (direction === 'right') next.add(key);
      else next.delete(key);
    });

    if (this.targetKeys === undefined) {
      this._targetKeys = next;
    }
    if (direction === 'right') this._leftSelected = new Set();
    else this._rightSelected = new Set();

    const detail: TransferChangeDetail = {
      targetKeys: [...next],
      direction,
      moveKeys: keys,
    };
    this.dispatchEvent(new CustomEvent('change', {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  private _renderPanel(items: TransferItem[], side: TransferDirection) {
    const query = side === 'left' ? this._leftQuery : this._rightQuery;
    const filtered = this._filter(items, query);
    const selected = side === 'left' ? this._leftSelected : this._rightSelected;
    const selectable = filtered.filter((item) => !item.disabled);
    const allSelected = selectable.length > 0 && selectable.every((item) => selected.has(item.key));

    return html`
      <div class="${prefixCls}-panel" part=${side === 'left' ? 'source' : 'target'}>
        <div class="${prefixCls}-panel-header">
          <label class="${prefixCls}-check-all">
            <input
              type="checkbox"
              aria-label="Select all"
              .checked=${allSelected}
              ?disabled=${this.disabled || !selectable.length}
              @change=${() => this._selectAll(filtered, side)}
            />
            <span>${this.titles[side === 'left' ? 0 : 1]}</span>
          </label>
          <span class="${prefixCls}-count">${selected.size}/${items.length}</span>
        </div>
        ${this.showSearch
          ? html`<div class="${prefixCls}-search">
              <semi-icon-search></semi-icon-search>
              <input
                type="text"
                placeholder="搜索"
                .value=${query}
                ?disabled=${this.disabled}
                @input=${(event: Event) => {
                  const value = (event.target as HTMLInputElement).value;
                  if (side === 'left') this._leftQuery = value;
                  else this._rightQuery = value;
                }}
              />
            </div>`
          : nothing}
        <div class="${prefixCls}-list">
          ${filtered.length
            ? filtered.map((item) => html`
                <label class="${prefixCls}-item ${item.disabled ? `${prefixCls}-item-disabled` : ''}">
                  <input
                    type="checkbox"
                    .checked=${selected.has(item.key)}
                    ?disabled=${this.disabled || item.disabled}
                    @change=${() => this._select(item, side)}
                  />
                  <span class="${prefixCls}-item-label">${item.label}</span>
                </label>
              `)
            : html`<div class="${prefixCls}-empty">暂无数据</div>`}
        </div>
      </div>
    `;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      this.disabled ? `${prefixCls}-disabled` : '',
    ]);

    return html`
      <div class="${cls}" part="transfer">
        ${this._renderPanel(this._sourceData(), 'left')}
        <div class="${prefixCls}-operations">
          <button
            class="${prefixCls}-operation"
            type="button"
            aria-label="Move right"
            ?disabled=${this.disabled || !this._leftSelected.size}
            @click=${() => this._move('right')}
          ><semi-icon-right></semi-icon-right></button>
          <button
            class="${prefixCls}-operation"
            type="button"
            aria-label="Move left"
            ?disabled=${this.disabled || !this._rightSelected.size}
            @click=${() => this._move('left')}
          ><semi-icon-left></semi-icon-left></button>
        </div>
        ${this._renderPanel(this._targetData(), 'right')}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      display: flex;
      align-items: stretch;
      gap: 12px;
      width: 100%;
    }

    .${p}-panel {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
      height: 280px;
      overflow: hidden;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: 6px;
    }

    .${p}-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background-color: var(--semi-color-fill-0);
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-check-all {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      color: var(--semi-color-text-0);
      font-size: 14px;
      cursor: pointer;
    }

    .${p}-check-all input,
    .${p}-item input {
      width: 14px;
      height: 14px;
      accent-color: var(--semi-color-primary);
      cursor: pointer;
    }

    .${p}-count {
      color: var(--semi-color-text-3);
      font-size: 12px;
    }

    .${p}-search {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 8px;
      padding: 0 8px;
      color: var(--semi-color-text-3);
      background-color: var(--semi-color-fill-0);
      border-radius: 3px;
    }

    .${p}-search input {
      flex: 1;
      height: 28px;
      padding: 0;
      font-family: inherit;
      font-size: 13px;
      background: transparent;
      border: none;
      outline: none;
    }

    .${p}-list {
      flex: 1;
      padding: 4px;
      overflow-y: auto;
    }

    .${p}-item {
      display: flex;
      gap: 8px;
      align-items: center;
      min-height: 32px;
      padding: 0 8px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-item:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-item-label {
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

    .${p}-operations {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }

    .${p}-operation {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: var(--semi-color-text-1);
      font-size: 12px;
      background-color: var(--semi-color-fill-0);
      border: 1px solid var(--semi-color-border);
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-operation:hover:not(:disabled) {
      color: var(--semi-color-primary);
      border-color: var(--semi-color-primary);
    }

    .${p}-operation:disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-disabled {
      opacity: 0.7;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-transfer': SemiTransfer
  }
}
