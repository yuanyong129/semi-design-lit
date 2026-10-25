import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import { Size } from '../_utils/constant';
import '../../../semi-icons/build/left';
import '../../../semi-icons/build/right';

const prefixCls = getPrefixCls('pagination');
const p = unsafeCSS(prefixCls);

type PageItem = number | 'prev-ellipsis' | 'next-ellipsis';

@customElement('semi-pagination')
export class SemiPagination extends LitElement {
  /**
   * @zh 总条数
   * @en Total count
   */
  @property({ type: Number })
  total: number = 0;

  /**
   * @zh 每页条数
   * @en Page size
   */
  @property({ attribute: 'page-size', type: Number })
  pageSize: number = 10;

  /**
   * @zh 当前页（受控）
   * @en Current page (controlled)
   */
  @property({ attribute: 'current-page', type: Number })
  currentPage?: number;

  /**
   * @zh 默认当前页
   * @en Default current page
   */
  @property({ attribute: 'default-current-page', type: Number })
  defaultCurrentPage: number = 1;

  /**
   * @zh 是否显示总条数
   * @en Whether to show total count
   */
  @property({ attribute: 'show-total', type: Boolean })
  showTotal: boolean = false;

  /**
   * @zh 尺寸
   * @en Size
   */
  @property()
  size: Size = 'default';

  /**
   * @zh 是否禁用
   * @en Whether the pagination is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  @state()
  private _current: number = 1;

  connectedCallback() {
    super.connectedCallback();
    this._current = this.defaultCurrentPage;
  }

  private get _pageCount(): number {
    return Math.max(1, Math.ceil(this.total / Math.max(1, this.pageSize)));
  }

  private get _activePage(): number {
    return Math.min(this._pageCount, Math.max(1, this.currentPage ?? this._current));
  }

  private _pages(): PageItem[] {
    const count = this._pageCount;
    const current = this._activePage;
    if (count <= 7) {
      return Array.from({ length: count }, (_, index) => index + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, 'next-ellipsis', count];
    }
    if (current >= count - 3) {
      return [1, 'prev-ellipsis', count - 4, count - 3, count - 2, count - 1, count];
    }
    return [1, 'prev-ellipsis', current - 1, current, current + 1, 'next-ellipsis', count];
  }

  private _go(page: number) {
    if (this.disabled) return;
    const next = Math.min(this._pageCount, Math.max(1, page));
    if (next === this._activePage) return;

    if (this.currentPage === undefined) {
      this._current = next;
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { currentPage: next, pageSize: this.pageSize },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderPage(item: PageItem) {
    if (typeof item !== 'number') {
      return html`<span class="${prefixCls}-ellipsis" aria-hidden="true">···</span>`;
    }
    return html`
      <button
        class="${prefixCls}-item ${item === this._activePage ? `${prefixCls}-item-active` : ''}"
        type="button"
        aria-current=${item === this._activePage ? 'page' : nothing}
        ?disabled=${this.disabled}
        @click=${() => this._go(item)}
      >${item}</button>
    `;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.size}`,
      this.disabled ? `${prefixCls}-disabled` : '',
    ]);

    return html`
      <div class="${cls}" part="pagination">
        ${this.showTotal
          ? html`<span class="${prefixCls}-total">共 ${this.total} 条</span>`
          : nothing}
        <div class="${prefixCls}-pages">
          <button
            class="${prefixCls}-prev"
            type="button"
            aria-label="Previous page"
            ?disabled=${this.disabled || this._activePage <= 1}
            @click=${() => this._go(this._activePage - 1)}
          ><semi-icon-left></semi-icon-left></button>
          ${this._pages().map((item) => this._renderPage(item))}
          <button
            class="${prefixCls}-next"
            type="button"
            aria-label="Next page"
            ?disabled=${this.disabled || this._activePage >= this._pageCount}
            @click=${() => this._go(this._activePage + 1)}
          ><semi-icon-right></semi-icon-right></button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--semi-color-text-1);
      font-size: 14px;
    }

    .${p}-total {
      flex-shrink: 0;
      color: var(--semi-color-text-2);
      white-space: nowrap;
    }

    .${p}-pages {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .${p}-item,
    .${p}-prev,
    .${p}-next {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: 32px;
      height: 32px;
      padding: 0 6px;
      color: var(--semi-color-text-1);
      font-family: inherit;
      font-size: 14px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-item:hover,
    .${p}-prev:hover,
    .${p}-next:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-item-active {
      color: var(--semi-color-primary);
      font-weight: 600;
      background-color: var(--semi-color-primary-light-default);
    }

    .${p}-prev:disabled,
    .${p}-next:disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-ellipsis {
      min-width: 24px;
      color: var(--semi-color-text-3);
      text-align: center;
    }

    .${p}-small .${p}-item,
    .${p}-small .${p}-prev,
    .${p}-small .${p}-next {
      min-width: 24px;
      height: 24px;
      font-size: 12px;
    }

    .${p}-large .${p}-item,
    .${p}-large .${p}-prev,
    .${p}-large .${p}-next {
      min-width: 40px;
      height: 40px;
      font-size: 16px;
    }

    .${p}-disabled {
      opacity: 0.6;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-pagination': SemiPagination
  }
}
