import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/table/table';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

const columns = [
  { title: '名称', dataIndex: 'name', sorter: true },
  { title: '类型', dataIndex: 'type' },
];

const data = [
  { key: '1', name: 'C', type: '一' },
  { key: '2', name: 'A', type: '二' },
  { key: '3', name: 'B', type: '三' },
];

describe('Table enhancements', () => {
  it('sorts rows when clicking a sortable header', async () => {
    const table = await fixture<any>(html`
      <semi-table .columns=${columns} .dataSource=${data}></semi-table>
    `);

    table.shadowRoot.querySelector('thead th').click();
    await table.updateComplete;
    expect(table.shadowRoot.querySelector('tbody tr td').textContent.trim()).toBe('A');

    table.shadowRoot.querySelector('thead th').click();
    await table.updateComplete;
    expect(table.shadowRoot.querySelector('tbody tr td').textContent.trim()).toBe('C');
  });

  it('paginates data and emits pageChange', async () => {
    const table = await fixture<any>(html`
      <semi-table
        .columns=${columns}
        .dataSource=${data}
        .pagination=${{ pageSize: 2 }}
      ></semi-table>
    `);
    let detail: any;
    table.addEventListener('pageChange', (event: CustomEvent) => (detail = event.detail));

    expect(table.shadowRoot.querySelectorAll('tbody tr').length).toBe(2);
    const pagination = table.shadowRoot.querySelector('semi-pagination');
    const next = pagination.shadowRoot.querySelector('.semi-pagination-next');
    next.click();
    await table.updateComplete;

    expect(detail.currentPage).toBe(2);
    expect(table.shadowRoot.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('selects rows and all rows on the page', async () => {
    const table = await fixture<any>(html`
      <semi-table
        .columns=${columns}
        .dataSource=${data}
        .rowSelection=${{}}
      ></semi-table>
    `);
    let detail: any;
    table.addEventListener('selectionChange', (event: CustomEvent) => (detail = event.detail));

    table.shadowRoot.querySelectorAll('tbody input')[0].click();
    await table.updateComplete;
    expect(detail.selectedRowKeys).toEqual(['1']);

    table.shadowRoot.querySelector('thead input').click();
    await table.updateComplete;
    expect(detail.selectedRowKeys.length).toBe(3);
  });
});
