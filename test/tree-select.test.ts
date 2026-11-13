import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/tree-select/tree-select';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

const tree = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' },
          { value: 'yuhang', label: '余杭' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [{ value: 'xuanwu', label: '玄武' }],
      },
    ],
  },
];

function root(element: any): HTMLElement {
  return element.shadowRoot.querySelector('.semi-tree-select');
}

function popup(element: any): any {
  const trigger = element.shadowRoot.querySelector('semi-trigger') as any;
  return trigger?.shadowRoot?.querySelector('semi-tree-select-popup');
}

function treeElement(element: any): any {
  return popup(element)?.shadowRoot?.querySelector('semi-tree');
}

function labels(element: any): HTMLElement[] {
  return Array.from(treeElement(element)?.shadowRoot?.querySelectorAll('.semi-tree-label') ?? []);
}

function label(element: any, text: string): HTMLElement {
  const match = labels(element).find((item) => item.textContent?.trim() === text);
  if (!match) throw new Error(`label not found: ${text}`);
  return match;
}

function nodeFor(element: any, text: string): HTMLElement {
  const item = label(element, text).closest('.semi-tree-node');
  if (!item) throw new Error(`node not found: ${text}`);
  return item as HTMLElement;
}

async function settle(element: any) {
  await element.updateComplete;
  await popup(element)?.updateComplete;
  await treeElement(element)?.updateComplete;
}

async function open(element: any) {
  root(element).click();
  await settle(element);
}

describe('TreeSelect', () => {
  it('shows a selected value and selects a leaf', async () => {
    let changed: unknown;
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${tree}
        .value=${'xihu'}
        .defaultExpandedKeys=${['zhejiang', 'hangzhou']}
        @change=${(event: CustomEvent) => {
          changed = event.detail.value;
          element.value = event.detail.value;
        }}
      ></semi-tree-select>
    `);
    expect(root(element).textContent).toContain('西湖');
    await open(element);
    expect(labels(element).map((item) => item.textContent?.trim())).toContain('浙江');
    label(element, '余杭').click();
    await settle(element);
    expect(changed).toBe('yuhang');
    expect(root(element).textContent).toContain('余杭');
  });

  it('expands non-leaf nodes without changing unless change-on-select', async () => {
    let changes = 0;
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${tree}
        .value=${'xihu'}
        .defaultExpandedKeys=${['zhejiang', 'hangzhou']}
        @change=${() => (changes += 1)}
      ></semi-tree-select>
    `);
    await open(element);
    label(element, '杭州').click();
    await settle(element);
    expect(changes).toBe(0);
    expect(labels(element).map((item) => item.textContent?.trim())).toContain('余杭');

    const selectable = await fixture<any>(html`
      <semi-tree-select .treeData=${tree} .changeOnSelect=${true} .value=${'xihu'} .defaultExpandedKeys=${['zhejiang', 'hangzhou']}></semi-tree-select>
    `);
    let selected: unknown;
    selectable.addEventListener('select', (event: CustomEvent) => {
      selected = event.detail.value;
    });
    await open(selectable);
    label(selectable, '杭州').click();
    await settle(selectable);
    expect(selected).toBe('hangzhou');
  });

  it('checks parents, merges descendants into tags, and unchecks', async () => {
    let value: unknown;
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${tree}
        .multiple=${true}
        .value=${['xihu']}
        @change=${(event: CustomEvent) => {
          value = event.detail.value;
          element.value = event.detail.value;
        }}
      ></semi-tree-select>
    `);
    await open(element);
    const check = () => nodeFor(element, '浙江').querySelector<HTMLElement>('.semi-tree-checkbox');
    check()?.click();
    await settle(element);
    expect(value).toEqual(['zhejiang']);
    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(1);

    check()?.click();
    await settle(element);
    expect(value).toEqual([]);
    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(0);
  });

  it('filters tree nodes from the popup search box', async () => {
    let searched: string | undefined;
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${tree}
        .value=${'xihu'}
        filter-tree-node
        @search=${(event: CustomEvent) => (searched = event.detail.value)}
      ></semi-tree-select>
    `);
    await open(element);
    const input = popup(element).shadowRoot.querySelector('.semi-tree-select-search-input') as HTMLInputElement;
    input.value = '杭';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await settle(element);
    expect(searched).toBe('杭');
    const texts = labels(element).map((item) => item.textContent?.trim() ?? '');
    expect(texts).toContain('杭州');
    expect(texts).toContain('余杭');
    expect(texts).not.toContain('江苏');
  });

  it('loads children asynchronously', async () => {
    const data = [{ value: 'east', label: '华东区域' }];
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${data}
        .loadData=${async (node: any) => {
          node.children = [{ value: 'city-a', label: '城市 A' }];
        }}
      ></semi-tree-select>
    `);
    await open(element);
    nodeFor(element, '华东区域').querySelector<HTMLElement>('.semi-tree-switcher')?.click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await settle(element);
    expect(labels(element).map((item) => item.textContent?.trim())).toContain('城市 A');
  });

  it('maps custom data fields with key-maps', async () => {
    const custom = [
      { id: 'design', name: '设计', kids: [{ id: 'visual', name: '视觉设计' }] },
    ];
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${custom}
        .keyMaps=${{ value: 'id', label: 'name', children: 'kids' }}
        .value=${'visual'}
      ></semi-tree-select>
    `);
    expect(root(element).textContent).toContain('视觉设计');
    await open(element);
    expect(labels(element).map((item) => item.textContent?.trim())).toContain('设计');
  });

  it('clears the value when show-clear is set', async () => {
    let cleared = false;
    const element = await fixture<any>(html`
      <semi-tree-select
        .treeData=${tree}
        .value=${'xihu'}
        .showClear=${true}
        @clear=${() => (cleared = true)}
      ></semi-tree-select>
    `);
    root(element).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await element.updateComplete;
    (element.shadowRoot as ShadowRoot).querySelector<HTMLElement>('.semi-tree-select-clear')?.click();
    await element.updateComplete;
    expect(cleared).toBe(true);
  });

  it('does not open when disabled', async () => {
    const element = await fixture<any>(html`
      <semi-tree-select .treeData=${tree} .value=${'xihu'} disabled></semi-tree-select>
    `);
    await open(element);
    expect(root(element).getAttribute('aria-expanded')).toBe('false');
  });
});
