import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TableColumn, TableRowKey } from './interface';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { Size } from '../_utils/constant';
import '../../../semi-icons/build/loading';

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

  private _getCellValue(column: TableColumn, record: any): any {
    if (!column.dataIndex) return record[column.key ?? ''] ?? '';
    return column.dataIndex.split('.').reduce((value, key) => value?.[key], record);
  }

  private _getRowKey(record: any, index: number): string | number {
    if (typeof this.rowKey === 'function') return this.rowKey(record, index);
    return record?.[this.rowKey] ?? index;
  }

  private _alignClass(align?: string): string {
    return align && align !== 'left' ? `${prefixCls}-cell-${align}` : '';
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.size}`,
      this.bordered ? `${prefixCls}-bordered` : '',
      this.stripe ? `${prefixCls}-stripe` : '',
    ]);

    return html`
      <div class="${prefixCls}-wrapper">
        <table class="${cls}" part="table">
          <thead>
            <tr>
              ${this.columns.map((column) => html`
                <th
                  class="${this._alignClass(column.align)}"
                  style=${column.width ? `width: ${typeof column.width === 'number' ? `${column.width}px` : column.width};` : nothing}
                >${column.title}</th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${this.loading
              ? html`<tr><td class="${prefixCls}-empty" colspan=${this.columns.length || 1}>加载中...</td></tr>`
              : this.dataSource.length
                ? this.dataSource.map((record, index) => html`
                    <tr
                      key=${this._getRowKey(record, index)}
                      @click=${() => this.dispatchEvent(new CustomEvent('rowClick', {
                        detail: { record, index },
                        bubbles: true,
                        composed: true,
                      }))}
                    >
                      ${this.columns.map((column) => html`
                        <td class="${this._alignClass(column.align)}">
                          ${column.render
                            ? column.render(this._getCellValue(column, record), record, index)
                            : this._getCellValue(column, record)}
                        </td>
                      `)}
                    </tr>
                  `)
                : html`<tr><td class="${prefixCls}-empty" colspan=${this.columns.length || 1}>${this.emptyText}</td></tr>`}
          </tbody>
        </table>
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-table': SemiTable
  }
}
