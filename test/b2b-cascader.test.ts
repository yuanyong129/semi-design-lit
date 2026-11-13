import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/cascader/cascader';
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
  return element.shadowRoot.querySelector('.semi-cascader');
}

function panel(element: any): any {
  const trigger = element.shadowRoot.querySelector('semi-trigger') as any;
  return trigger?.shadowRoot?.querySelector('semi-cascader-panel');
}

function options(element: any): HTMLElement[] {
  return Array.from(panel(element)?.shadowRoot?.querySelectorAll('.semi-cascader-option') ?? []);
}

function option(element: any, text: string): HTMLElement {
  const match = options(element).find((item) => item.textContent?.includes(text));
  if (!match) throw new Error(`option not found: ${text}`);
  return match;
}

async function open(element: any) {
  root(element).click();
  await element.updateComplete;
  await panel(element)?.updateComplete;
}

describe('Cascader', () => {
  it('renders a selected path and expands columns along it', async () => {
    const element = await fixture<any>(html`
      <semi-cascader .treeData=${tree} .value=${['zhejiang', 'hangzhou', 'xihu']}></semi-cascader>
    `);
    expect(root(element).textContent).toContain('浙江 / 杭州 / 西湖');
    await open(element);
    expect(panel(element).columns).toHaveLength(3);
    expect(option(element, '西湖').classList.contains('semi-cascader-option-select')).toBe(true);
  });

  it('selects a leaf, emits change and select, and closes', async () => {
    let changed: unknown;
    let selected: unknown;
    const element = await fixture<any>(html`
      <semi-cascader
        .treeData=${tree}
        .value=${['zhejiang', 'hangzhou', 'xihu']}
        @change=${(event: CustomEvent) => (changed = event.detail.value)}
        @select=${(event: CustomEvent) => (selected = event.detail.value)}
      ></semi-cascader>
    `);
    await open(element);
    option(element, '余杭').click();
    await element.updateComplete;
    expect(changed).toEqual(['zhejiang', 'hangzhou', 'yuhang']);
    expect(selected).toEqual(['zhejiang', 'hangzhou', 'yuhang']);
    expect(panel(element).searching).toBe(false);
  });

  it('expands a non-leaf without changing value by default', async () => {
    let changes = 0;
    const element = await fixture<any>(html`
      <semi-cascader
        .treeData=${tree}
        .value=${['zhejiang', 'hangzhou', 'xihu']}
        @change=${() => (changes += 1)}
      ></semi-cascader>
    `);
    await open(element);
    option(element, '江苏').click();
    await element.updateComplete;
    await panel(element).updateComplete;
    expect(changes).toBe(0);
    expect(panel(element).columns).toHaveLength(2);
    expect(option(element, '南京')).toBeTruthy();
  });

  it('selects a non-leaf when change-on-select is enabled', async () => {
    let changed: unknown;
    const element = await fixture<any>(html`
      <semi-cascader
        change-on-select
        .treeData=${tree}
        .value=${['zhejiang', 'hangzhou', 'xihu']}
        @change=${(event: CustomEvent) => (changed = event.detail.value)}
      ></semi-cascader>
    `);
    await open(element);
    option(element, '江苏').click();
    await element.updateComplete;
    expect(changed).toEqual(['jiangsu']);
  });

  it('checks multiple parents, merges descendants, and removes tags', async () => {
    let value: unknown;
    const element = await fixture<any>(html`
      <semi-cascader
        multiple
        .treeData=${tree}
        .value=${[['zhejiang', 'hangzhou', 'xihu']]}
        @change=${(event: CustomEvent) => (value = event.detail.value)}
      ></semi-cascader>
    `);
    await open(element);
    const checkbox = option(element, '浙江').querySelector<HTMLElement>('.semi-cascader-option-label-checkbox');
    checkbox?.click();
    await element.updateComplete;
    expect(value).toEqual([['zhejiang']]);
    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(1);

    const tag = element.shadowRoot.querySelector('semi-tag') as any;
    const close = tag?.shadowRoot?.querySelector('.semi-tag-close') as HTMLElement | null;
    close?.click();
    await element.updateComplete;
    expect(value).toEqual([]);
  });

  it('filters leaf paths and highlights the matched text', async () => {
    const element = await fixture<any>(html`
      <semi-cascader filter-tree-node .treeData=${tree}></semi-cascader>
    `);
    await open(element);
    const input = element.shadowRoot.querySelector('.semi-cascader-search-input') as HTMLInputElement;
    input.value = '杭';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;
    await panel(element).updateComplete;
    expect(panel(element).searchRows).toHaveLength(2);
    expect(panel(element).shadowRoot.querySelectorAll('.semi-cascader-option-flatten')).toHaveLength(2);
    expect(panel(element).shadowRoot.querySelector('.semi-cascader-option-label-highlight')?.textContent).toBe('杭');
  });

  it('maps custom value/label/children fields through key-maps', async () => {
    const customTree = [
      { id: 'a', name: '设计', kids: [{ id: 'b', name: '视觉' }] },
    ];
    const element = await fixture<any>(html`
      <semi-cascader
        .treeData=${customTree}
        .keyMaps=${{ value: 'id', label: 'name', children: 'kids' }}
        .value=${['a', 'b']}
      ></semi-cascader>
    `);
    expect(root(element).textContent).toContain('设计 / 视觉');
    await open(element);
    expect(option(element, '视觉').classList.contains('semi-cascader-option-select')).toBe(true);
  });

  it('loads children asynchronously and renders the resolved nodes', async () => {
    const asyncTree = [{ value: 'east', label: '华东' }];
    let loaded: unknown;
    const loadData = async (path: any[]) => {
      loaded = path.map((item) => item.value);
      asyncTree[0] = {
        ...asyncTree[0],
        children: [{ value: 'east-a', label: '城市 A' }],
      } as any;
      element.requestUpdate();
    };
    const element = await fixture<any>(html`
      <semi-cascader .treeData=${asyncTree} .loadData=${loadData}></semi-cascader>
    `);
    await open(element);
    option(element, '华东').click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    await panel(element).updateComplete;
    expect(loaded).toEqual(['east']);
    expect(option(element, '城市 A')).toBeTruthy();
  });

  it('clears value and emits change when the clear button is clicked', async () => {
    let changed: unknown;
    const element = await fixture<any>(html`
      <semi-cascader
        show-clear
        .treeData=${tree}
        .value=${['zhejiang', 'hangzhou', 'xihu']}
        @change=${(event: CustomEvent) => (changed = event.detail.value)}
      ></semi-cascader>
    `);
    await open(element);
    root(element).dispatchEvent(new MouseEvent('mouseenter'));
    await element.updateComplete;
    const clear = element.shadowRoot.querySelector('.semi-cascader-clearbtn') as HTMLElement;
    clear.click();
    await element.updateComplete;
    expect(changed).toEqual([]);
  });

  it('does not open when disabled', async () => {
    const element = await fixture<any>(html`<semi-cascader disabled .treeData=${tree}></semi-cascader>`);
    await open(element);
    expect(root(element).classList.contains('semi-cascader-focus')).toBe(false);
    expect(panel(element).columns).toHaveLength(1);
  });
});
