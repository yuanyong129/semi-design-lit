import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/calendar/calendar';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('Calendar', () => {
  it('renders the month and selects a date', async () => {
    const calendar = await fixture<any>(html`
      <semi-calendar default-value="2026-11-15"></semi-calendar>
    `);
    let detail: any;
    calendar.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    expect(calendar.shadowRoot.querySelector('.semi-calendar-month').textContent).toContain('2026 年 11 月');
    expect(calendar.shadowRoot.querySelectorAll('.semi-calendar-cell').length).toBe(42);
    expect(calendar.shadowRoot.querySelector('.semi-calendar-cell-selected').getAttribute('aria-label')).toBe('2026-11-15');

    calendar.shadowRoot.querySelector('[aria-label="2026-11-20"]').click();
    await calendar.updateComplete;

    expect(detail.value).toBe('2026-11-20');
    expect(calendar.shadowRoot.querySelector('.semi-calendar-cell-selected').getAttribute('aria-label')).toBe('2026-11-20');
  });

  it('renders events and disables dates', async () => {
    const calendar = await fixture<any>(html`
      <semi-calendar
        .value=${'2026-11-15'}
        .events=${[{ date: '2026-11-05', content: '版本发布', type: 'success' }]}
        .disabledDate=${(date: Date) => date.getDay() === 0 || date.getDay() === 6}
      ></semi-calendar>
    `);

    expect(calendar.shadowRoot.textContent).toContain('版本发布');

    const weekend = calendar.shadowRoot.querySelector('[aria-label="2026-11-21"]');
    expect(weekend.classList.contains('semi-calendar-cell-disabled')).toBe(true);
    let changed = false;
    calendar.addEventListener('change', () => (changed = true));
    weekend.click();
    await calendar.updateComplete;
    expect(changed).toBe(false);
  });

  it('switches months', async () => {
    const calendar = await fixture<any>(html`
      <semi-calendar .value=${'2026-11-15'}></semi-calendar>
    `);
    calendar.shadowRoot.querySelector('[aria-label="Next month"]').click();
    await calendar.updateComplete;
    expect(calendar.shadowRoot.querySelector('.semi-calendar-month').textContent).toContain('2026 年 12 月');
  });
});
