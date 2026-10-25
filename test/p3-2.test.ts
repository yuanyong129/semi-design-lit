import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/pagination/pagination';
import '../packages/semi-ui/components/date-picker/date-picker';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('Pagination', () => {
  it('renders pages and emits change', async () => {
    const pagination = await fixture<any>(html`
      <semi-pagination total="100" page-size="10"></semi-pagination>
    `);
    let detail: any;
    pagination.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    const items = pagination.shadowRoot.querySelectorAll('.semi-pagination-item');
    expect(items.length).toBeGreaterThan(1);
    expect(pagination.shadowRoot.querySelector('.semi-pagination-item-active').textContent).toBe('1');

    pagination.shadowRoot.querySelectorAll('.semi-pagination-item')[1].click();
    await pagination.updateComplete;

    expect(detail.currentPage).toBe(2);
    expect(pagination.shadowRoot.querySelector('.semi-pagination-item-active').textContent).toBe('2');
  });
});

describe('DatePicker', () => {
  it('opens the panel and selects a date', async () => {
    const picker = await fixture<any>(html`
      <semi-date-picker default-value="2026-10-25"></semi-date-picker>
    `);
    let detail: any;
    picker.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    expect(picker.shadowRoot.querySelector('.semi-date-picker-value').textContent).toContain('2026-10-25');

    picker.shadowRoot.querySelector('.semi-date-picker-selector').click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const trigger = picker.shadowRoot.querySelector('semi-trigger');
    const panel = trigger.shadowRoot.querySelector('semi-popup').querySelector('semi-date-picker-panel');
    const day = [...panel.shadowRoot.querySelectorAll('.semi-date-picker-panel-day')]
      .find((element: any) => element.textContent.trim() === '15');
    day.click();
    await picker.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(detail.value).toBe('2026-10-15');
    expect(picker.shadowRoot.querySelector('.semi-date-picker-value').textContent.trim()).toBe('2026-10-15');
    expect(trigger.shadowRoot.querySelector('semi-portal').open).toBe(false);
  });

  it('formats the selected date', async () => {
    const picker = await fixture<any>(html`
      <semi-date-picker default-value="2026-10-25" format="YYYY 年 MM 月 DD 日"></semi-date-picker>
    `);
    expect(picker.shadowRoot.querySelector('.semi-date-picker-value').textContent.trim()).toBe('2026 年 10 月 25 日');
  });
});
