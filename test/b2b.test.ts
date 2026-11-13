import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/time-picker/time-picker';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

function parts(element: any) {
  const trigger = element.shadowRoot.querySelector('semi-trigger') as any;
  const panel = trigger?.shadowRoot?.querySelector('semi-time-picker-panel') as any;
  const input = element.shadowRoot.querySelector('input') as HTMLInputElement;
  return { trigger, panel, input };
}

function columns(element: any): HTMLElement[] {
  return Array.from(parts(element).panel?.shadowRoot?.querySelectorAll('.semi-timepicker-panel-list') ?? []);
}

function selectItem(element: any, column: number, index: number) {
  const items = columns(element)[column].querySelectorAll<HTMLElement>('.semi-timepicker-panel-item');
  items[index].click();
}

function type(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

describe('TimePicker', () => {
  it('renders a formatted single value', async () => {
    const element = await fixture<any>(html`<semi-time-picker .value=${'10:30:00'}></semi-time-picker>`);
    const { input } = parts(element);

    expect(input.value).toBe('10:30:00');
    expect(element.shadowRoot.querySelector('.semi-timepicker-focus')).toBeNull();
    expect(element.shadowRoot.querySelector('.semi-timepicker-input')).toBeTruthy();
  });

  it('opens a panel and updates the value when an hour is selected', async () => {
    let changed: string | undefined;
    const element = await fixture<any>(html`
      <semi-time-picker
        .value=${'10:30:00'}
        @change=${(event: CustomEvent<{ value: string }>) => (changed = event.detail.value)}
      ></semi-time-picker>
    `);
    const { input, trigger } = parts(element);
    input.dispatchEvent(new FocusEvent('focus'));
    await element.updateComplete;
    expect(trigger.open).toBe(true);
    expect(columns(element)).toHaveLength(3);

    selectItem(element, 0, 12);
    await element.updateComplete;
    expect(changed).toBe('12:30:00');
    expect(input.value).toBe('12:30:00');
  });

  it('renders two panels for a time range and updates the end time', async () => {
    const element = await fixture<any>(html`
      <semi-time-picker
        type="timeRange"
        .value=${['09:00:00', '18:00:00']}
      ></semi-time-picker>
    `);
    const { input } = parts(element);

    expect(input.value).toBe('09:00:00 ~ 18:00:00');
    expect(columns(element)).toHaveLength(6);
    selectItem(element, 3, 20);
    await element.updateComplete;
    expect(input.value).toBe('09:00:00 ~ 20:00:00');
  });

  it('commits typed input on Enter and emits change', async () => {
    let changed: string | undefined;
    const element = await fixture<any>(html`
      <semi-time-picker
        .value=${'10:30:00'}
        @change=${(event: CustomEvent<{ value: string }>) => (changed = event.detail.value)}
      ></semi-time-picker>
    `);
    const { input } = parts(element);
    type(input, '11:45:00');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await element.updateComplete;

    expect(changed).toBe('11:45:00');
    expect(input.value).toBe('11:45:00');
  });

  it('marks invalid typed input on blur', async () => {
    const element = await fixture<any>(html`<semi-time-picker .value=${'10:30:00'}></semi-time-picker>`);
    const { input } = parts(element);
    type(input, 'not-a-time');
    input.dispatchEvent(new FocusEvent('blur'));
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('.semi-timepicker-invalid')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('supports 12-hour formatting and a meridiem column', async () => {
    const element = await fixture<any>(html`
      <semi-time-picker use12-hours .value=${'02:30:00 PM'}></semi-time-picker>
    `);
    const { input } = parts(element);

    expect(input.value).toBe('PM 2:30:00');
    expect(columns(element)).toHaveLength(4);
    expect(columns(element)[0].querySelector('.semi-timepicker-panel-item-selected')?.textContent).toBe('2');
    expect(columns(element)[3].querySelector('.semi-timepicker-panel-item-selected')?.textContent).toBe('下午');
  });

  it('applies step sizes and hides disabled options', async () => {
    const element = await fixture<any>(html`
      <semi-time-picker
        .minuteStep=${15}
        .hourStep=${2}
        .disabledHours=${() => [0, 2]}
        .hideDisabledOptions=${true}
        .value=${'10:30:00'}
      ></semi-time-picker>
    `);

    const hourItems = columns(element)[0].querySelectorAll('.semi-timepicker-panel-item');
    const minuteItems = columns(element)[1].querySelectorAll('.semi-timepicker-panel-item');
    expect(hourItems).toHaveLength(10);
    expect(hourItems[0].textContent?.trim()).toBe('04');
    expect(minuteItems).toHaveLength(4);
  });

  it('clears the value and emits a clear event', async () => {
    let cleared = false;
    let changed: string | undefined;
    const element = await fixture<any>(html`
      <semi-time-picker
        .value=${'10:30:00'}
        @clear=${() => (cleared = true)}
        @change=${(event: CustomEvent<{ value: string }>) => (changed = event.detail.value)}
      ></semi-time-picker>
    `);
    (element.shadowRoot.querySelector('.semi-timepicker-clear') as HTMLElement).click();
    await element.updateComplete;

    expect(cleared).toBe(true);
    expect(changed).toBe('');
    expect(parts(element).input.value).toBe('');
  });

  it('respects the disabled state', async () => {
    const element = await fixture<any>(html`<semi-time-picker disabled .value=${'10:30:00'}></semi-time-picker>`);
    expect(parts(element).input.disabled).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-timepicker-disabled')).toBeTruthy();
  });
});
