import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/overflow-list/overflow-list';
import type { OverflowItem } from '../packages/semi-ui/components/overflow-list/interface';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

const items: OverflowItem[] = [
  { key: 'a', label: '设计' },
  { key: 'b', label: '研发' },
  { key: 'c', label: '产品' },
  { key: 'd', label: '运营' },
  { key: 'e', label: '市场' },
  { key: 'f', label: '销售' },
];

const forceLayout = async (element: any, width = 120, itemWidth = 40) => {
  const list = element.shadowRoot.querySelector('.semi-overflow-list') as HTMLElement;
  Object.defineProperty(list, 'clientWidth', { value: width, configurable: true });
  element.shadowRoot
    .querySelectorAll('.semi-overflow-list-measure .semi-overflow-list-item')
    .forEach((node: HTMLElement) => {
      Object.defineProperty(node, 'offsetWidth', { value: itemWidth, configurable: true });
    });
  element.recalculate();
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await element.updateComplete;
};

const directItems = (element: any): HTMLElement[] =>
  Array.from(element.shadowRoot.querySelectorAll('.semi-overflow-list > .semi-overflow-list-item'));

describe('OverflowList', () => {
  it('collapses overflow at the end and emits the hidden items', async () => {
    let hidden: OverflowItem[] | undefined;
    const element = await fixture<any>(html`
      <semi-overflow-list
        .items=${items}
        .onOverflow=${(overflow: OverflowItem[]) => {
          hidden = overflow;
        }}
      ></semi-overflow-list>
    `);
    await forceLayout(element);

    expect(directItems(element).length).toBe(1);
    expect(element.shadowRoot.querySelector('.semi-overflow-list-overflow')?.textContent).toContain('+5');
    expect(hidden?.length).toBe(5);
    expect(hidden?.[0].label).toBe('研发');
  });

  it('collapses from the start in the correct order', async () => {
    const element = await fixture<any>(html`
      <semi-overflow-list collapse-from="start" .items=${items}></semi-overflow-list>
    `);
    await forceLayout(element);

    const root = element.shadowRoot.querySelector('.semi-overflow-list') as HTMLElement;
    expect(root.firstElementChild?.classList.contains('semi-overflow-list-overflow')).toBe(true);
    expect(directItems(element).at(-1)?.textContent).toContain('销售');
  });

  it('honours min-visible-items even when space is insufficient', async () => {
    const element = await fixture<any>(html`
      <semi-overflow-list min-visible-items="3" .items=${items}></semi-overflow-list>
    `);
    await forceLayout(element, 80, 40);

    expect(directItems(element).length).toBe(3);
    expect(element.shadowRoot.querySelector('.semi-overflow-list-overflow')?.textContent).toContain('+3');
  });

  it('supports custom visible and overflow renderers', async () => {
    const element = await fixture<any>(html`
      <semi-overflow-list
        .items=${items}
        .visibleItemRenderer=${(item: OverflowItem) => html`<strong>${item.label}</strong>`}
        .overflowRenderer=${(hidden: OverflowItem[]) => html`<button>还有 ${hidden.length} 项</button>`}
      ></semi-overflow-list>
    `);
    await forceLayout(element);

    expect(element.shadowRoot.querySelector('.semi-overflow-list-item strong')).not.toBeNull();
    expect(element.shadowRoot.querySelector('.semi-overflow-list-overflow button')?.textContent).toContain('还有 5 项');
  });

  it('renders all items without an overflow slot in scroll mode', async () => {
    const element = await fixture<any>(html`
      <semi-overflow-list render-mode="scroll" .items=${items}></semi-overflow-list>
    `);

    expect(element.shadowRoot.querySelector('.semi-overflow-list-scroll')).not.toBeNull();
    expect(directItems(element).length).toBe(6);
    expect(element.shadowRoot.querySelector('.semi-overflow-list-overflow')).toBeNull();
  });
});
