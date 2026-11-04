import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  TableColumn,
  TableFilterOption,
  TablePaginationConfig,
  TableRowKey,
  TableRowKeyValue,
  TableRowSelection,
  TableSortOrder,
} from './interface';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { Size } from '../_utils/constant';
import '../pagination/pagination';
import '../trigger/trigger';
import './table-filter-menu';
import '../../../semi-icons/build/loading';
import '../../../semi-icons/build/more';

const prefixCls = getPrefixCls('table');
const p = unsafeCSS(prefixCls);

@customElement('semi-table')
export class SemiTable extends LitElement {
  /**
   * @zh 列配置
   * @en Columns
   */
  @property({ attribute: false })
  columns: TableColumn[] = [];

  /**
   * @zh 数据
   * @en Data source
   */
  @property({ attribute: false })
  dataSource: any[] = [];

  /**
   * @zh 行 key
   * @en Row key
   */
  @property({ attribute: false })
  rowKey: TableRowKey = 'key';

  /**
   * @zh 是否加载中
   * @en Whether the table is loading
   */
  @property({ type: Boolean })
  loading: boolean = false;

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
  size: Size = 'default';

  /**
   * @zh 是否显示边框
   * @en Whether to show borders
   */
  @property({ type: Boolean })
  bordered: boolean = false;

  /**
   * @zh 是否显示斑马纹
   * @en Whether to show striped rows
   */
  @property({ type: Boolean })
  stripe: boolean = false;

  /**
   * @zh 分页配置，false 关闭分页
   * @en Pagination config, false to disable
   */
  @property({ attribute: false })
  pagination: boolean | TablePaginationConfig = false;

  /**
   * @zh 行选择配置
   * @en Row selection config
   */
  @property({ attribute: false })
  rowSelection?: TableRowSelection;

  /**
   * @zh 是否固定表头
   * @en Whether the header is sticky
   */
  @property({ attribute: 'sticky-header', type: Boolean })
  stickyHeader: boolean = false;

  /**
   * @zh 表格最大高度
   * @en Maximum table height
   */
  @property({ attribute: 'max-height' })
  maxHeight?: string;

  @state()
  private _sortKey?: string;

  @state()
  private _sortOrder: TableSortOrder = null;

  @state()
  private _filterValues: Record<string, Array<string | number | boolean>> = {};

  @state()
  private _page: number = 1;

  @state()
  private _selectedKeys = new Set<TableRowKeyValue>();

  connectedCallback() {
    super.connectedCallback();
    this._selectedKeys = new Set(this.rowSelection?.defaultSelectedRowKeys ?? []);
    const sorted = this.columns.find((column) => column.sortOrder);
    if (sorted) {
      this._sortKey = this._columnKey(sorted);
      this._sortOrder = sorted.sortOrder ?? null;
    }
  }

  private _columnKey(column: TableColumn): string {
    return column.key ?? column.dataIndex ?? column.title;
  }

  private _getCellValue(column: TableColumn, record: any): any {
    if (!column.dataIndex) return record[column.key ?? ''] ?? '';
    return column.dataIndex.split('.').reduce((value, key) => value?.[key], record);
  }

  private _getRowKey(record: any, index: number): TableRowKeyValue {
    if (typeof this.rowKey === 'function') return this.rowKey(record, index);
    return record?.[this.rowKey] ?? index;
  }

  private _recordKey(record: any): TableRowKeyValue {
    const index = this.dataSource.indexOf(record);
    return this._getRowKey(record, index >= 0 ? index : 0);
  }

  private _alignClass(align?: string): string {
    return align && align !== 'left' ? `${prefixCls}-cell-${align}` : '';
  }

  private get _paginationConfig(): TablePaginationConfig | undefined {
    if (!this.pagination) return undefined;
    return this.pagination === true ? {} : this.pagination;
  }

  private get _pageSize(): number {
    return Math.max(1, this._paginationConfig?.pageSize ?? 10);
  }

  private get _pageCount(): number {
    return Math.max(1, Math.ceil(this._processedData.length / this._pageSize));
  }

  private get _activePage(): number {
    return Math.min(this._pageCount, Math.max(1, this._paginationConfig?.currentPage ?? this._page));
  }

  private get _filteredData(): any[] {
    let data = this.dataSource;
    for (const [key, values] of Object.entries(this._filterValues)) {
      if (!values.length) continue;
      const column = this.columns.find((item) => this._columnKey(item) === key);
      if (!column) continue;
      data = data.filter((record) => {
        const cell = this._getCellValue(column, record);
        return values.some((value) =>
          column.onFilter ? column.onFilter(value, record) : cell === value
        );
      });
    }
    return data;
  }

  private get _processedData(): any[] {
    const data = this._filteredData;
    if (!this._sortKey || !this._sortOrder) return data;
    const column = this.columns.find((item) => this._columnKey(item) === this._sortKey);
    if (!column?.sorter) return data;

    const sorted = [...data].sort((a, b) => {
      if (typeof column.sorter === 'function') {
        return this._sortOrder === 'descend' ? -column.sorter(a, b) : column.sorter(a, b);
      }
      const left = this._getCellValue(column, a);
      const right = this._getCellValue(column, b);
      if (left === right) return 0;
      if (left === undefined || left === null) return 1;
      if (right === undefined || right === null) return -1;
      if (typeof left === 'number' && typeof right === 'number') {
        return this._sortOrder === 'descend' ? right - left : left - right;
      }
      const result = String(left).localeCompare(String(right), 'zh-CN');
      return this._sortOrder === 'descend' ? -result : result;
    });
    return sorted;
  }

  private get _pagedData(): any[] {
    if (!this._paginationConfig) return this._processedData;
    const start = (this._activePage - 1) * this._pageSize;
    return this._processedData.slice(start, start + this._pageSize);
  }

  private _orderFor(column: TableColumn): TableSortOrder {
    return this._columnKey(column) === this._sortKey ? this._sortOrder : null;
  }

  private _handleSort(column: TableColumn) {
    if (!column.sorter) return;
    const key = this._columnKey(column);
    let order: TableSortOrder;
    if (this._sortKey !== key || this._sortOrder === null) order = 'ascend';
    else if (this._sortOrder === 'ascend') order = 'descend';
    else order = null;

    this._sortKey = order ? key : undefined;
    this._sortOrder = order;
    this._page = 1;
    this.dispatchEvent(new CustomEvent('sortChange', {
      detail: { field: key, order, column },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleFilter(column: TableColumn, event: CustomEvent<{ values: Array<string | number | boolean> }>) {
    event.stopPropagation();
    const key = this._columnKey(column);
    this._filterValues = { ...this._filterValues, [key]: event.detail.values };
    this._page = 1;
    this.dispatchEvent(new CustomEvent('filterChange', {
      detail: { field: key, values: event.detail.values, column },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderFilter(column: TableColumn) {
    const key = this._columnKey(column);
    const values = this._filterValues[key] ?? [];
    return html`
      <span class="${prefixCls}-filter" @click=${(event: MouseEvent) => event.stopPropagation()}>
        <semi-trigger
          .trigger=${'click'}
          .content=${html`
            <semi-table-filter-menu
              .filters=${column.filters ?? []}
              .selectedValues=${values}
              .multiple=${column.filterMultiple ?? true}
              @filterChange=${(event: CustomEvent<{ values: Array<string | number | boolean> }>) =>
                this._handleFilter(column, event)}
            ></semi-table-filter-menu>
          `}
          .showArrow=${false}
          .popupPlain=${true}
        >
          <button
            class="${prefixCls}-filter-button ${values.length ? `${prefixCls}-filter-active` : ''}"
            type="button"
            aria-label="Filter"
          ><semi-icon-more></semi-icon-more></button>
        </semi-trigger>
      </span>
    `;
  }

  private _selectedSet(): Set<TableRowKeyValue> {
    return new Set(this.rowSelection?.selectedRowKeys ?? [...this._selectedKeys]);
  }

  private _isSelectable(record: any): boolean {
    return !this.rowSelection?.getCheckboxProps?.(record)?.disabled;
  }

  private _toggleRow(record: any, index: number) {
    if (!this.rowSelection || !this._isSelectable(record)) return;
    const key = this._recordKey(record);
    const next = this._selectedSet();
    if (next.has(key)) next.delete(key);
    else next.add(key);

    if (this.rowSelection.selectedRowKeys === undefined) {
      this._selectedKeys = next;
    }
    const keys = [...next];
    const rows = this.dataSource.filter((item) => next.has(this._recordKey(item)));
    this.dispatchEvent(new CustomEvent('selectionChange', {
      detail: { selectedRowKeys: keys, selectedRows: rows },
      bubbles: true,
      composed: true,
    }));
    this.rowSelection.onChange?.(keys, rows);
  }

  private _togglePage(pageData: any[]) {
    if (!this.rowSelection) return;
    const selectableKeys = pageData
      .filter((record) => this._isSelectable(record))
      .map((record) => this._recordKey(record));
    const next = this._selectedSet();
    const allSelected = selectableKeys.length > 0 && selectableKeys.every((key) => next.has(key));

    selectableKeys.forEach((key) => {
      if (allSelected) next.delete(key);
      else next.add(key);
    });

    if (this.rowSelection.selectedRowKeys === undefined) {
      this._selectedKeys = next;
    }
    const keys = [...next];
    const rows = this.dataSource.filter((item) => next.has(this._recordKey(item)));
    this.dispatchEvent(new CustomEvent('selectionChange', {
      detail: { selectedRowKeys: keys, selectedRows: rows },
      bubbles: true,
      composed: true,
    }));
    this.rowSelection.onChange?.(keys, rows);
  }

  private _handlePageChange(event: CustomEvent<{ currentPage: number; pageSize: number }>) {
    event.stopPropagation();
    if (this._paginationConfig?.currentPage === undefined) {
      this._page = event.detail.currentPage;
    }
    this.dispatchEvent(new CustomEvent('pageChange', {
      detail: event.detail,
      bubbles: true,
      composed: true,
    }));
    this._paginationConfig?.onChange?.(event.detail.currentPage, event.detail.pageSize);
  }

  private _renderSorter(column: TableColumn) {
    if (!column.sorter) return nothing;
    const order = this._orderFor(column);
    return html`
      <span class="${prefixCls}-sorter" aria-hidden="true">
        <span class="${prefixCls}-sorter-up ${order === 'ascend' ? `${prefixCls}-sorter-active` : ''}"></span>
        <span class="${prefixCls}-sorter-down ${order === 'descend' ? `${prefixCls}-sorter-active` : ''}"></span>
      </span>
    `;
  }

  render() {
    const pageData = this._pagedData;
    const selected = this._selectedSet();
    const pageSelectable = pageData
      .filter((record) => this._isSelectable(record))
      .map((record) => this._recordKey(record));
    const allSelected = pageSelectable.length > 0 && pageSelectable.every((key) => selected.has(key));
    const colspan = this.columns.length + (this.rowSelection ? 1 : 0);
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.size}`,
      this.bordered ? `${prefixCls}-bordered` : '',
      this.stripe ? `${prefixCls}-stripe` : '',
      this.stickyHeader ? `${prefixCls}-sticky` : '',
    ]);

    return html`
      <div
        class="${prefixCls}-wrapper"
        style=${this.maxHeight ? `max-height: ${this.maxHeight};` : nothing}
      >
        <table class="${cls}" part="table">
          <thead>
            <tr>
              ${this.rowSelection
                ? html`<th class="${prefixCls}-selection-cell">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      .checked=${allSelected}
                      @click=${(event: MouseEvent) => event.stopPropagation()}
                      @change=${() => this._togglePage(pageData)}
                    />
                  </th>`
                : nothing}
              ${this.columns.map((column) => {
                const order = this._orderFor(column);
                return html`
                  <th
                    class="${this._alignClass(column.align)} ${column.sorter ? `${prefixCls}-sortable` : ''}"
                    aria-sort=${order === 'ascend' ? 'ascending' : order === 'descend' ? 'descending' : nothing}
                    style=${column.width ? `width: ${typeof column.width === 'number' ? `${column.width}px` : column.width};` : nothing}
                    @click=${() => this._handleSort(column)}
                  >
                    <span class="${prefixCls}-th-content">
                      <span>${column.title}</span>
                      ${this._renderSorter(column)}
                      ${column.filters?.length ? this._renderFilter(column) : nothing}
                    </span>
                  </th>
                `;
              })}
            </tr>
          </thead>
          <tbody>
            ${this.loading
              ? html`<tr><td class="${prefixCls}-empty" colspan=${colspan || 1}>加载中...</td></tr>`
              : pageData.length
                ? pageData.map((record) => {
                    const key = this._recordKey(record);
                    const index = this.dataSource.indexOf(record);
                    return html`
                      <tr
                        @click=${() => this.dispatchEvent(new CustomEvent('rowClick', {
                          detail: { record, index },
                          bubbles: true,
                          composed: true,
                        }))}
                      >
                        ${this.rowSelection
                          ? html`<td class="${prefixCls}-selection-cell">
                              <input
                                type="checkbox"
                                aria-label="Select row"
                                .checked=${selected.has(key)}
                                ?disabled=${!this._isSelectable(record)}
                                @click=${(event: MouseEvent) => event.stopPropagation()}
                                @change=${() => this._toggleRow(record, index)}
                              />
                            </td>`
                          : nothing}
                        ${this.columns.map((column) => html`
                          <td class="${this._alignClass(column.align)}">
                            ${column.render
                              ? column.render(this._getCellValue(column, record), record, index)
                              : this._getCellValue(column, record)}
                          </td>
                        `)}
                      </tr>
                    `;
                  })
                : html`<tr><td class="${prefixCls}-empty" colspan=${colspan || 1}>${this.emptyText}</td></tr>`}
          </tbody>
        </table>
        ${this._paginationConfig
          ? html`
              <div class="${prefixCls}-footer">
                <semi-pagination
                  total=${this._processedData.length}
                  .pageSize=${this._pageSize}
                  .currentPage=${this._activePage}
                  .showTotal=${this._paginationConfig.showTotal ?? false}
                  @change=${(event: CustomEvent) => this._handlePageChange(event)}
                ></semi-pagination>
              </div>
            `
          : nothing}
        ${this.loading
          ? html`<div class="${prefixCls}-loading"><semi-icon-loading></semi-icon-loading></div>`
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p}-wrapper {
      position: relative;
      width: 100%;
      overflow-x: auto;
    }

    .${p} {
      width: 100%;
      border-spacing: 0;
      border-collapse: separate;
      color: var(--semi-color-text-0);
      font-size: 14px;
      text-align: left;
    }

    .${p} th {
      padding: 12px 16px;
      color: var(--semi-color-text-1);
      font-weight: 600;
      line-height: 20px;
      white-space: nowrap;
      background-color: var(--semi-color-fill-0);
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-sticky th {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .${p} td {
      padding: 12px 16px;
      line-height: 20px;
      white-space: nowrap;
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p} tbody tr:hover td {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-stripe tbody tr:nth-child(even) td {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-bordered {
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
    }

    .${p}-bordered th:not(:last-child),
    .${p}-bordered td:not(:last-child) {
      border-right: 1px solid var(--semi-color-border);
    }

    .${p}-small th,
    .${p}-small td {
      padding: 8px 12px;
      font-size: 12px;
    }

    .${p}-large th,
    .${p}-large td {
      padding: 16px 20px;
      font-size: 16px;
    }

    .${p}-cell-center {
      text-align: center;
    }

    .${p}-cell-right {
      text-align: right;
    }

    .${p}-empty {
      padding: 32px 16px !important;
      color: var(--semi-color-text-3);
      text-align: center;
    }

    .${p}-loading {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--semi-color-primary);
      font-size: 24px;
      background-color: var(--semi-color-mask-1, rgba(255, 255, 255, 0.6));
    }

    .${p}-th-content {
      display: inline-flex;
      gap: 6px;
      align-items: center;
    }

    .${p}-sortable {
      cursor: pointer;
      user-select: none;
    }

    .${p}-sorter {
      display: inline-flex;
      flex-direction: column;
      gap: 2px;
    }

    .${p}-sorter-up,
    .${p}-sorter-down {
      width: 0;
      height: 0;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      opacity: 0.35;
    }

    .${p}-sorter-up {
      border-bottom: 5px solid currentColor;
    }

    .${p}-sorter-down {
      border-top: 5px solid currentColor;
    }

    .${p}-sorter-active {
      color: var(--semi-color-primary);
      opacity: 1;
    }

    .${p}-filter {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }

    .${p}-filter-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      padding: 0;
      color: var(--semi-color-text-3);
      font-size: 14px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-filter-button:hover,
    .${p}-filter-active {
      color: var(--semi-color-primary);
      background-color: var(--semi-color-fill-1);
    }

    .${p}-selection-cell {
      width: 40px;
      text-align: center;
    }

    .${p}-selection-cell input {
      width: 14px;
      height: 14px;
      accent-color: var(--semi-color-primary);
      cursor: pointer;
    }

    .${p}-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-table': SemiTable
  }
}
