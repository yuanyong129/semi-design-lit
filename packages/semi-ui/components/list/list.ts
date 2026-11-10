import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ListSize } from './interface';
import type { SemiListItem } from './list-item';
import { listStyles } from './style/list.style';
import './list-item';
import '../empty/empty';
import '../skeleton/skeleton';

/**
 * Displays a collection of items with optional header, footer and states.
 */
@customElement('semi-list')
export class SemiList extends LitElement {
  /**
   * @zh 列表头部
   * @en List header
   */
  @property()
  header = '';

  /**
   * @zh 列表底部
   * @en List footer
   */
  @property()
  footer = '';

  /**
   * @zh 是否显示边框
   * @en Whether to show a border
   */
  @property({ type: Boolean, reflect: true })
  bordered = false;

  /**
   * @zh 是否显示分割线
   * @en Whether to show split lines
   */
  @property({ type: Boolean })
  split = true;

  /**
   * @zh 加载状态
   * @en Loading state
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * @zh 尺寸
   * @en Size
   * @defaultValue 'default'
   */
  @property()
  size: ListSize = 'default';

  /**
   * @zh 空状态文案
   * @en Empty state text
   * @defaultValue '暂无数据'
   */
  @property({ attribute: 'empty-text' })
  emptyText = '暂无数据';

  @state()
  private _hasItems = true;

  @state()
  private _hasHeader = false;

  @state()
  private _hasFooter = false;

  private get _items(): SemiListItem[] {
    return Array.from(this.querySelectorAll(':scope > semi-list-item')) as SemiListItem[];
  }

  private _syncItems(): void {
    const items = this._items;
    items.forEach((item, index) => {
      item.size = this.size;
      item.split = this.split;
      item.last = index === items.length - 1;
      item.setAttribute('role', 'listitem');
    });
  }

  private _handleItemsSlot = (event: Event): void => {
    this._hasItems = (event.target as HTMLSlotElement).assignedElements().length > 0;
    this._syncItems();
  };

  private _handleHeaderSlot = (event: Event): void => {
    this._hasHeader = (event.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private _handleFooterSlot = (event: Event): void => {
    this._hasFooter = (event.target as HTMLSlotElement).assignedElements().length > 0;
  };

  protected willUpdate(): void {
    this._hasItems = this._items.length > 0;
  }

  protected firstUpdated(): void {
    this._syncItems();
  }

  protected updated(): void {
    this._syncItems();
  }

  protected render() {
    const classes = [
      'semi-list',
      this.bordered ? 'semi-list-bordered' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class=${classes} part="list">
        <div class="semi-list-header" ?hidden=${!this.header && !this._hasHeader}>
          <slot name="header" @slotchange=${this._handleHeaderSlot}>${this.header}</slot>
        </div>
        <div class="semi-list-body" role="list">
          ${this.loading
            ? html`
                <div class="semi-list-loading" aria-busy="true">
                  ${[0, 1, 2].map(
                    () => html`
                      <div class="semi-list-loading-item">
                        <semi-skeleton active avatar rows="2"></semi-skeleton>
                      </div>
                    `
                  )}
                </div>
              `
            : html`
                <slot
                  class="semi-list-slot"
                  @slotchange=${this._handleItemsSlot}
                ></slot>
                ${!this._hasItems
                  ? html`<semi-empty description=${this.emptyText}></semi-empty>`
                  : ''}
              `}
        </div>
        <div class="semi-list-footer" ?hidden=${!this.footer && !this._hasFooter}>
          <slot name="footer" @slotchange=${this._handleFooterSlot}>${this.footer}</slot>
        </div>
      </div>
    `;
  }

  static styles = listStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-list': SemiList;
  }
}
