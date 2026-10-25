import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/select/select';
import '../packages/semi-ui/components/table/table';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

function selectTrigger(select: any): any {
  return select.shadowRoot.querySelector('semi-trigger');
}

function selectMenu(select: any): any {
  const trigger = selectTrigger(select);
  return trigger.shadowRoot.querySelector('semi-popup')?.querySelector('semi-select-menu');
}

describe('Select', () => {
  it('opens the dropdown and selects a single option', async () => {
    const select = await fixture<any>(html`
      <semi-select
        .options=${[
          { label: 'Semi', value: 'semi' },
          { label: 'Arco', value: 'arco' },
        ]}
        placeholder="请选择"
      ></semi-select>
    `);
    let detail: any;
    select.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    select.shadowRoot.querySelector('.semi-select-selector').click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const menu = selectMenu(select);
    const options = menu.shadowRoot.querySelectorAll('.semi-select-option');
    options[1].click();
    await select.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(detail.value).toBe('arco');
    expect(select.shadowRoot.querySelector('.semi-select-value').textContent).toBe('Arco');
    expect(selectTrigger(select).shadowRoot.querySelector('semi-portal').open).toBe(false);
  });

  it('supports multiple selection tags', async () => {
    const select = await fixture<any>(html`
      <semi-select
        multiple
        .options=${[
          { label: 'Semi', value: 'semi' },
          { label: 'Arco', value: 'arco' },
        ]}
      ></semi-select>
    `);

    select.shadowRoot.querySelector('.semi-select-selector').click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const menu = selectMenu(select);
    const options = menu.shadowRoot.querySelectorAll('.semi-select-option');
    options[0].click();
    await select.updateComplete;
    options[1].click();
    await select.updateComplete;

    expect(select.shadowRoot.querySelectorAll('.semi-select-tag').length).toBe(2);
  });
});

describe('Table', () => {
  it('renders columns, data and custom cells', async () => {
    const table = await fixture<any>(html`
      <semi-table
        .columns=${[
          { title: '名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'status', render: (value: string) => html`<strong>${value}</strong>` },
        ]}
        .dataSource=${[
          { key: '1', name: 'Semi', status: '运行中' },
          { key: '2', name: 'Arco', status: '已归档' },
        ]}
      ></semi-table>
    `);

    expect(table.shadowRoot.querySelectorAll('tbody tr').length).toBe(2);
    expect(table.shadowRoot.textContent).toContain('Semi');
    expect(table.shadowRoot.querySelector('strong').textContent).toBe('运行中');
  });

  it('renders empty state', async () => {
    const table = await fixture<any>(html`
      <semi-table
        .columns=${[{ title: '名称', dataIndex: 'name' }]}
        .dataSource=${[]}
        empty-text="没有数据"
      ></semi-table>
    `);

    expect(table.shadowRoot.querySelector('.semi-table-empty').textContent).toContain('没有数据');
  });
});
