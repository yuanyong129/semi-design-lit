import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/slider/slider';
import '../packages/semi-ui/components/auto-complete/auto-complete';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

function handles(element: any): HTMLElement[] {
  return Array.from(element.shadowRoot.querySelectorAll('[role="slider"]'));
}

function values(element: any): string[] {
  return handles(element).map((handle) => handle.getAttribute('aria-valuenow') ?? '');
}

function key(handle: HTMLElement, value: string): void {
  handle.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, composed: true }));
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

function autoCompleteParts(element: any) {
  const trigger = element.shadowRoot.querySelector('semi-trigger') as any;
  const menu = trigger?.shadowRoot?.querySelector('semi-auto-complete-menu') as any;
  const input = element.shadowRoot.querySelector('input') as HTMLInputElement;
  return { trigger, menu, input };
}

describe('Slider', () => {
  it('renders a single value and a proportional track', async () => {
    const element = await fixture<any>(html`<semi-slider .value=${30}></semi-slider>`);
    const track = element.shadowRoot.querySelector('.semi-slider-track') as HTMLElement;

    expect(handles(element)).toHaveLength(1);
    expect(values(element)).toEqual(['30']);
    expect(track.getAttribute('style')).toContain('width:30%');
  });

  it('sorts a range value and renders two handles', async () => {
    const element = await fixture<any>(html`<semi-slider range .value=${[60, 20]}></semi-slider>`);
    const track = element.shadowRoot.querySelector('.semi-slider-track') as HTMLElement;

    expect(handles(element)).toHaveLength(2);
    expect(values(element)).toEqual(['20', '60']);
    expect(track.getAttribute('style')).toContain('width:40%');
  });

  it('changes by keyboard and emits change / change-complete', async () => {
    let changed: number | undefined;
    let completed: number | undefined;
    const element = await fixture<any>(html`
      <semi-slider
        .value=${20}
        step="10"
        @change=${(event: CustomEvent<{ value: number }>) => (changed = event.detail.value)}
        @change-complete=${(event: CustomEvent<{ value: number }>) => (completed = event.detail.value)}
      ></semi-slider>
    `);
    key(handles(element)[0], 'ArrowRight');
    await element.updateComplete;

    expect(changed).toBe(30);
    expect(completed).toBe(30);
    expect(values(element)).toEqual(['30']);
  });

  it('clamps keyboard changes to min / max', async () => {
    const element = await fixture<any>(html`<semi-slider .value=${5} min="0" max="10"></semi-slider>`);
    key(handles(element)[0], 'Home');
    await element.updateComplete;
    expect(values(element)).toEqual(['0']);

    key(handles(element)[0], 'End');
    await element.updateComplete;
    expect(values(element)).toEqual(['10']);
  });

  it('keeps range handles in order when using the keyboard', async () => {
    const element = await fixture<any>(html`<semi-slider range .value=${[20, 30]}></semi-slider>`);
    key(handles(element)[0], 'End');
    await element.updateComplete;
    expect(values(element)).toEqual(['30', '30']);

    key(handles(element)[1], 'Home');
    await element.updateComplete;
    expect(values(element)).toEqual(['30', '30']);
  });

  it('renders vertical orientation with min at the bottom', async () => {
    const element = await fixture<any>(html`<semi-slider vertical .value=${25}></semi-slider>`);
    const handle = handles(element)[0];
    const track = element.shadowRoot.querySelector('.semi-slider-track') as HTMLElement;

    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('style')).toContain('top:75%');
    expect(track.getAttribute('style')).toContain('bottom:0');
    expect(track.getAttribute('style')).toContain('height:25%');
  });

  it('renders marks and hides the track when included is false', async () => {
    const element = await fixture<any>(html`
      <semi-slider
        .included=${false}
        .value=${50}
        .marks=${{ 0: '0', 50: '50', 100: '100' }}
        show-boundary
      ></semi-slider>
    `);

    expect(element.shadowRoot.querySelectorAll('.semi-slider-dot')).toHaveLength(3);
    expect(element.shadowRoot.querySelectorAll('.semi-slider-mark')).toHaveLength(3);
    expect(element.shadowRoot.querySelector('.semi-slider-track')).toBeNull();
    expect(element.shadowRoot.querySelector('.semi-slider-boundary')).not.toBeNull();
  });

  it('disables keyboard and focus when disabled', async () => {
    const element = await fixture<any>(html`<semi-slider disabled .value=${30}></semi-slider>`);
    const handle = handles(element)[0];
    key(handle, 'ArrowRight');
    await element.updateComplete;

    expect(values(element)).toEqual(['30']);
    expect(handle.getAttribute('tabindex')).toBe('-1');
  });
});

describe('AutoComplete', () => {
  it('opens on focus and renders the current data without filtering', async () => {
    const element = await fixture<any>(html`
      <semi-auto-complete .data=${['Apple', 'Banana']}></semi-auto-complete>
    `);
    const { trigger, menu, input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await element.updateComplete;
    await trigger.updateComplete;

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(menu.shadowRoot.querySelectorAll('.semi-autoComplete-option')).toHaveLength(2);
  });

  it('emits search before change without filtering data itself', async () => {
    const events: string[] = [];
    let searchValue = '';
    let changed = '';
    const element = await fixture<any>(html`
      <semi-auto-complete
        .data=${['Apple', 'Banana']}
        @search=${(event: CustomEvent<{ inputValue: string }>) => {
          searchValue = event.detail.inputValue;
          events.push('search');
        }}
        @change=${(event: CustomEvent<{ value: string }>) => {
          changed = event.detail.value;
          events.push('change');
        }}
      ></semi-auto-complete>
    `);
    const { input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    type(input, 'App');
    await element.updateComplete;

    expect(events).toEqual(['search', 'change']);
    expect(searchValue).toBe('App');
    expect(changed).toBe('App');
    expect(element.data).toEqual(['Apple', 'Banana']);
  });

  it('selects an option by click and emits select / change', async () => {
    let selected = '';
    let changed = '';
    const element = await fixture<any>(html`
      <semi-auto-complete
        .data=${[{ value: 'apple', label: '苹果' }, { value: 'banana', label: '香蕉' }]}
        @select=${(event: CustomEvent<{ value: string }>) => (selected = event.detail.value)}
        @change=${(event: CustomEvent<{ value: string }>) => (changed = event.detail.value)}
      ></semi-auto-complete>
    `);
    const { trigger, menu, input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await element.updateComplete;
    await trigger.updateComplete;
    menu.shadowRoot.querySelector('.semi-autoComplete-option')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true })
    );
    await element.updateComplete;

    expect(selected).toBe('apple');
    expect(changed).toBe('apple');
    expect(input.value).toBe('apple');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports keyboard navigation and Enter selection', async () => {
    let selected = '';
    const element = await fixture<any>(html`
      <semi-auto-complete
        .data=${['First', 'Second']}
        @select=${(event: CustomEvent<{ value: string }>) => (selected = event.detail.value)}
      ></semi-auto-complete>
    `);
    const { trigger, input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await element.updateComplete;
    await trigger.updateComplete;

    expect(selected).toBe('First');
  });

  it('clears the value and reopens with empty search / change', async () => {
    const events: string[] = [];
    const element = await fixture<any>(html`
      <semi-auto-complete
        .data=${['Apple']}
        show-clear
        @search=${() => events.push('search')}
        @change=${() => events.push('change')}
        @clear=${() => events.push('clear')}
      ></semi-auto-complete>
    `);
    const { trigger, input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    type(input, 'Ap');
    await element.updateComplete;
    const clear = element.shadowRoot.querySelector('.semi-autoComplete-clear') as HTMLButtonElement;
    expect(clear).not.toBeNull();
    clear.click();
    await element.updateComplete;
    await trigger.updateComplete;

    expect(input.value).toBe('');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(events.slice(-3)).toEqual(['clear', 'search', 'change']);
  });

  it('keeps the dropdown open on blur and shows loading / empty content', async () => {
    const element = await fixture<any>(html`
      <semi-auto-complete
        .data=${[]}
        empty-content="没有匹配项"
        loading
      ></semi-auto-complete>
    `);
    const { trigger, menu, input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await element.updateComplete;
    await trigger.updateComplete;

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(menu.shadowRoot.querySelector('.semi-autoComplete-loading')?.textContent).toContain('加载中');
  });

  it('shows empty content when there is no data', async () => {
    const element = await fixture<any>(html`
      <semi-auto-complete .data=${[]} empty-content="没有匹配项"></semi-auto-complete>
    `);
    const { trigger, menu, input } = autoCompleteParts(element);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await element.updateComplete;
    await trigger.updateComplete;

    expect(menu.shadowRoot.querySelector('.semi-autoComplete-empty')?.textContent).toContain('没有匹配项');
  });

  it('disables the input', async () => {
    const element = await fixture<any>(html`<semi-auto-complete disabled></semi-auto-complete>`);
    const { input } = autoCompleteParts(element);
    expect(input.disabled).toBe(true);
  });
});
