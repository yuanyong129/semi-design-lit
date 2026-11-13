import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/scroll-list/scroll-list';
import '../packages/semi-ui/components/scroll-list/scroll-list-item';
import type { ScrollListSelectDetail } from '../packages/semi-ui/components/scroll-list/interface';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

const items = [
  { value: 'a', text: '甲' },
  { value: 'b', text: '乙' },
  { value: 'c', text: '丙', disabled: true },
  { value: 'd', text: '丁' },
];

const itemOf = (element: any) =>
  element.querySelector('semi-scroll-list-item') as any;

describe('ScrollList', () => {
  it('applies a numeric body-height attribute and renders header/footer', async () => {
    const element = await fixture<any>(html`
      <semi-scroll-list body-height="240" .header=${'选择版本'} .footer=${'共 4 项'}>
        <semi-scroll-list-item .items=${items}></semi-scroll-list-item>
      </semi-scroll-list>
    `);

    const body = element.shadowRoot.querySelector('.semi-scrolllist-body') as HTMLElement;
    expect(body.style.height).toBe('240px');
    expect(body.style.getPropertyValue('--semi-scrolllist-body-height')).toBe('240px');
    expect(element.shadowRoot.querySelector('.semi-scrolllist-header')?.textContent).toContain('选择版本');
    expect(element.shadowRoot.querySelector('.semi-scrolllist-footer')?.textContent).toContain('共 4 项');
  });

  it('renders normal options, marks the selected item and emits select on click', async () => {
    const element = await fixture<any>(html`
      <semi-scroll-list body-height="240">
        <semi-scroll-list-item .items=${items} selected-index="1"></semi-scroll-list-item>
      </semi-scroll-list>
    `);
    const item = itemOf(element);
    await item.updateComplete;

    const options = item.shadowRoot.querySelectorAll('li');
    expect(options.length).toBe(4);
    expect(options[1].classList.contains('semi-scrolllist-item-sel')).toBe(true);

    let detail: ScrollListSelectDetail | undefined;
    item.addEventListener('select', (event: CustomEvent<ScrollListSelectDetail>) => {
      detail = event.detail;
    });
    (options[3] as HTMLElement).click();
    await item.updateComplete;

    expect(detail?.index).toBe(3);
    expect(detail?.item.value).toBe('d');
    expect(options[3].classList.contains('semi-scrolllist-item-sel')).toBe(true);
  });

  it('ignores disabled options', async () => {
    const element = await fixture<any>(html`
      <semi-scroll-list body-height="240">
        <semi-scroll-list-item .items=${items} selected-index="1"></semi-scroll-list-item>
      </semi-scroll-list>
    `);
    const item = itemOf(element);
    await item.updateComplete;

    let count = 0;
    item.addEventListener('select', () => {
      count += 1;
    });
    (item.shadowRoot.querySelectorAll('li')[2] as HTMLElement).click();
    await item.updateComplete;

    expect(count).toBe(0);
    expect(item.selectedIndex).toBe(1);
  });

  it('renders the wheel selector, shades and centering padding', async () => {
    const element = await fixture<any>(html`
      <semi-scroll-list body-height="240">
        <semi-scroll-list-item mode="wheel" .items=${items} selected-index="2"></semi-scroll-list-item>
      </semi-scroll-list>
    `);
    const item = itemOf(element);
    await item.updateComplete;

    const root = item.shadowRoot;
    expect(root.querySelectorAll('.semi-scrolllist-shade').length).toBe(2);
    expect(root.querySelector('.semi-scrolllist-selector')).not.toBeNull();
    const pads = root.querySelectorAll('.semi-scrolllist-wheel-pad');
    expect(pads.length).toBe(2);
    expect(item.style.getPropertyValue('--semi-scrolllist-wheel-padding')).toBe('102px');
    expect(root.querySelector('.semi-scrolllist-item-wheel')).not.toBeNull();
  });

  it('keeps the selected index within the option range', async () => {
    const element = await fixture<any>(html`
      <semi-scroll-list body-height="240">
        <semi-scroll-list-item .items=${items} selected-index="99"></semi-scroll-list-item>
      </semi-scroll-list>
    `);
    const item = itemOf(element);
    await item.updateComplete;

    expect(item.shadowRoot.querySelectorAll('li.semi-scrolllist-item-sel').length).toBe(1);
    expect(item.shadowRoot.querySelectorAll('li')[3].classList.contains('semi-scrolllist-item-sel')).toBe(true);
  });
});
