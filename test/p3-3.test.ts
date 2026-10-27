import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/tabs/tabs';
import '../packages/semi-ui/components/tree/tree';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

const tabs = [
  { key: 'design', label: '设计', content: '设计内容' },
  { key: 'develop', label: '开发', content: '开发内容' },
  { key: 'disabled', label: '禁用', content: '禁用内容', disabled: true },
];

describe('Tabs', () => {
  it('switches active tab and content', async () => {
    const element = await fixture<any>(html`
      <semi-tabs .tabs=${tabs}></semi-tabs>
    `);
    let detail: any;
    element.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    expect(element.shadowRoot.querySelector('.semi-tabs-tab-active').textContent).toBe('设计');
    expect(element.shadowRoot.querySelector('.semi-tabs-content').textContent).toContain('设计内容');

    element.shadowRoot.querySelectorAll('.semi-tabs-tab')[1].click();
    await element.updateComplete;

    expect(detail.activeKey).toBe('develop');
    expect(element.shadowRoot.querySelector('.semi-tabs-content').textContent).toContain('开发内容');
  });

  it('does not switch to disabled tab', async () => {
    const element = await fixture<any>(html`
      <semi-tabs .tabs=${tabs}></semi-tabs>
    `);
    element.shadowRoot.querySelectorAll('.semi-tabs-tab')[2].click();
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('.semi-tabs-tab-active').textContent).toBe('设计');
  });
});

const treeData = [
  {
    key: 'design',
    label: '设计系统',
    children: [
      { key: 'semi', label: 'Semi Design' },
      { key: 'arco', label: 'Arco Design' },
    ],
  },
  {
    key: 'components',
    label: '组件',
    children: [
      { key: 'button', label: 'Button 按钮' },
      { key: 'table', label: 'Table 表格' },
    ],
  },
];

describe('Tree', () => {
  it('expands and collapses nodes', async () => {
    const element = await fixture<any>(html`
      <semi-tree .treeData=${treeData} default-expand-all></semi-tree>
    `);

    expect(element.shadowRoot.textContent).toContain('Semi Design');
    element.shadowRoot.querySelector('.semi-tree-switcher').click();
    await element.updateComplete;
    expect(element.shadowRoot.textContent).not.toContain('Semi Design');

    element.shadowRoot.querySelector('.semi-tree-switcher').click();
    await element.updateComplete;
    expect(element.shadowRoot.textContent).toContain('Semi Design');
  });

  it('selects a node and supports multiple selection', async () => {
    const element = await fixture<any>(html`
      <semi-tree .treeData=${treeData} default-expand-all multiple></semi-tree>
    `);
    let detail: any;
    element.addEventListener('select', (event: CustomEvent) => (detail = event.detail));

    const labels = element.shadowRoot.querySelectorAll('.semi-tree-label');
    labels[1].click();
    await element.updateComplete;
    expect(detail.selectedKeys).toContain('semi');

    labels[2].click();
    await element.updateComplete;
    expect(detail.selectedKeys).toEqual(['semi', 'arco']);
  });
});
