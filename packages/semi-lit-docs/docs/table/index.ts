import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

@customElement('table-docs')
class TableDocs extends LitElement {
  @state()
  private _loading = false;

  @state()
  private _selected: Array<string | number> = [];

  private get _columns() {
    return [
      { title: '名称', dataIndex: 'name' },
      { title: '类型', dataIndex: 'type' },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value: string) => html`<semi-tag color=${value === '运行中' ? 'green' : 'grey'}>${value}</semi-tag>`,
      },
      { title: '更新时间', dataIndex: 'updatedAt', align: 'right' },
    ];
  }

  private get _data() {
    return [
      { key: '1', name: 'Semi Design', type: '设计系统', status: '运行中', updatedAt: '2026-10-25' },
      { key: '2', name: 'Semi Design Lit', type: '组件库', status: '运行中', updatedAt: '2026-10-24' },
      { key: '3', name: 'Legacy Theme', type: '主题', status: '已归档', updatedAt: '2026-09-12' },
    ];
  }

  private get _sortableColumns() {
    return [
      { title: '名称', dataIndex: 'name', sorter: true },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value: string) => html`<semi-tag color=${value === '运行中' ? 'green' : 'grey'}>${value}</semi-tag>`,
      },
      { title: '更新时间', dataIndex: 'updatedAt', align: 'right', sorter: true },
    ];
  }

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>表格</h1>
      <p>Table 根据列配置展示数据，支持自定义单元格、边框、斑马纹与加载状态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/table" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 columns 与 dataSource 渲染表格，render 可返回 Lit 模板。',
        html`
          <semi-table .columns=${this._columns} .dataSource=${this._data}></semi-table>
        `,
        `<semi-table .columns=\${columns} .dataSource=\${data}></semi-table>`
      )}

      ${section(
        '排序、分页与行选择',
        'sorter 列点击表头排序，pagination 开启分页，rowSelection 开启行选择。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
            <semi-table
              size="small"
              .columns=${this._sortableColumns}
              .dataSource=${this._data}
              .pagination=${{ pageSize: 2, showTotal: true }}
              .rowSelection=${{}}
              @selectionChange=${(event: CustomEvent) => (this._selected = event.detail.selectedRowKeys)}
            ></semi-table>
            <semi-tag>已选：${this._selected.length ? this._selected.join('、') : '无'}</semi-tag>
          </div>
        `,
        `<semi-table .columns=\${columns} .dataSource=\${data}
  .pagination=\${{ pageSize: 2, showTotal: true }}
  .rowSelection=\${{}}></semi-table>`
      )}

      ${section(
        '边框与斑马纹',
        '设置 bordered 与 stripe 调整表格外观。',
        html`
          <semi-table bordered stripe .columns=${this._columns} .dataSource=${this._data}></semi-table>
        `,
        `<semi-table bordered stripe .columns=\${columns} .dataSource=\${data}></semi-table>`
      )}

      ${section(
        '加载与空状态',
        'loading 展示加载遮罩，无数据时展示 empty-text。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-button @click=${() => (this._loading = !this._loading)}>
              ${this._loading ? '结束加载' : '模拟加载'}
            </semi-button>
            <semi-table ?loading=${this._loading} .columns=${this._columns} .dataSource=${this._data}></semi-table>
            <semi-table .columns=${this._columns} .dataSource=${[]} empty-text="还没有数据"></semi-table>
          </semi-space>
        `,
        `<semi-table loading .columns=\${columns} .dataSource=\${data}></semi-table>
<semi-table .columns=\${columns} .dataSource=\${[]} empty-text="还没有数据"></semi-table>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-docs': TableDocs
  }
}
