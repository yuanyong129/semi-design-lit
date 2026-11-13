import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/spin/spin';
import '../packages/semi-ui/components/rating/rating';
import '../packages/semi-ui/components/pin-code/pin-code';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

describe('Spin', () => {
  it('renders a spinner with status semantics', async () => {
    const element = await fixture<any>(html`<semi-spin></semi-spin>`);
    const spin = element.shadowRoot.querySelector('.semi-spin');

    expect(spin).not.toBeNull();
    expect(spin.getAttribute('role')).toBe('status');
    expect(spin.getAttribute('aria-busy')).toBe('true');
    expect(spin.classList.contains('semi-spin-middle')).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-spin-icon')).not.toBeNull();
  });

  it('shows a delayed spinner and keeps wrapped content', async () => {
    const element = await fixture<any>(html`
      <semi-spin .delay=${300} tip="加载中">
        <div class="content">内容</div>
      </semi-spin>
    `);

    const spin = element.shadowRoot.querySelector('.semi-spin');
    expect(spin.classList.contains('semi-spin-hidden')).toBe(true);
    expect(element.textContent).toContain('内容');
    expect(element.classList.contains('semi-spin-host-block')).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 350));
    await element.updateComplete;
    expect(spin.classList.contains('semi-spin-hidden')).toBe(false);
  });

  it('hides the indicator but preserves content when spinning is false', async () => {
    const element = await fixture<any>(html`
      <semi-spin tip="加载中"><span>内容</span></semi-spin>
    `);
    element.spinning = false;
    await element.updateComplete;

    const spin = element.shadowRoot.querySelector('.semi-spin');
    expect(spin.classList.contains('semi-spin-hidden')).toBe(true);
    expect(spin.getAttribute('aria-busy')).toBe('false');
    expect(element.textContent).toContain('内容');
  });

  it('renders custom indicator slot', async () => {
    const element = await fixture<any>(html`
      <semi-spin><span slot="indicator" class="custom"></span></semi-spin>
    `);
    expect(element.querySelector('.custom')).not.toBeNull();
  });
});

describe('Rating', () => {
  it('renders stars with fill percentages', async () => {
    const element = await fixture<any>(html`<semi-rating .value=${3}></semi-rating>`);
    const stars = element.shadowRoot.querySelectorAll('.semi-rating-star');

    expect(stars).toHaveLength(5);
    const fills = element.shadowRoot.querySelectorAll('.semi-rating-star-fill') as NodeListOf<HTMLElement>;
    expect(fills[0].style.width).toBe('100%');
    expect(fills[2].style.width).toBe('100%');
    expect(fills[3].style.width).toBe('0%');
  });

  it('emits change on click and clears when clicking the same value', async () => {
    let detail: number | undefined;
    const element = await fixture<any>(html`
      <semi-rating .value=${2} @change=${(event: CustomEvent<{ value: number }>) => (detail = event.detail.value)}></semi-rating>
    `);
    const stars = element.shadowRoot.querySelectorAll('.semi-rating-star') as NodeListOf<HTMLElement>;

    stars[3].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 100 }));
    await element.updateComplete;
    expect(detail).toBe(4);

    element.value = detail;
    await element.updateComplete;
    stars[3].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 100 }));
    await element.updateComplete;
    expect(detail).toBe(0);
  });

  it('supports half stars based on pointer position', async () => {
    let detail: number | undefined;
    const element = await fixture<any>(html`
      <semi-rating
        .allowHalf=${true}
        .value=${2}
        @change=${(event: CustomEvent<{ value: number }>) => (detail = event.detail.value)}
      ></semi-rating>
    `);
    const star = (element.shadowRoot.querySelectorAll('.semi-rating-star') as NodeListOf<HTMLElement>)[3];
    star.getBoundingClientRect = () =>
      ({ left: 0, width: 20, top: 0, height: 20, right: 20, bottom: 20, x: 0, y: 0, toJSON() {} }) as DOMRect;

    star.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 4 }));
    await element.updateComplete;
    expect(detail).toBe(3.5);
  });

  it('supports keyboard navigation and custom characters', async () => {
    let detail: number | undefined;
    const element = await fixture<any>(html`
      <semi-rating
        .value=${3}
        .count=${4}
        .character=${'♥'}
        @change=${(event: CustomEvent<{ value: number }>) => (detail = event.detail.value)}
      ></semi-rating>
    `);
    const list = element.shadowRoot.querySelector('.semi-rating') as HTMLElement;
    expect(element.shadowRoot.querySelectorAll('.semi-rating-star')).toHaveLength(4);
    expect(list.textContent).toContain('♥');

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(detail).toBe(4);

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(detail).toBe(0);
  });

  it('ignores interaction when disabled', async () => {
    let called = false;
    const element = await fixture<any>(html`
      <semi-rating .value=${2} .disabled=${true} @change=${() => (called = true)}></semi-rating>
    `);
    const stars = element.shadowRoot.querySelectorAll('.semi-rating-star') as NodeListOf<HTMLElement>;
    stars[4].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(called).toBe(false);
    expect(element.shadowRoot.querySelector('.semi-rating').classList.contains('semi-rating-disabled')).toBe(true);
  });
});

describe('PinCode', () => {
  it('renders the configured number of cells and accepts digits', async () => {
    let detail: string | undefined;
    const element = await fixture<any>(html`
      <semi-pin-code .autoFocus=${false} @change=${(event: CustomEvent<{ value: string }>) => (detail = event.detail.value)}></semi-pin-code>
    `);
    const inputs = element.shadowRoot.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    expect(inputs).toHaveLength(6);

    inputs[0].value = '1';
    inputs[0].dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await element.updateComplete;
    expect(detail).toBe('1');
    expect(inputs[0].value).toBe('1');
  });

  it('completes when the last cell is filled', async () => {
    let complete: string | undefined;
    const element = await fixture<any>(html`
      <semi-pin-code count="4" .autoFocus=${false} @complete=${(event: CustomEvent<{ value: string }>) => (complete = event.detail.value)}></semi-pin-code>
    `);
    const inputs = element.shadowRoot.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    ['1', '2', '3', '4'].forEach((char, index) => {
      inputs[index].value = char;
      inputs[index].dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    });
    await element.updateComplete;

    expect(complete).toBe('1234');
  });

  it('distributes pasted text and emits complete', async () => {
    let complete: string | undefined;
    const element = await fixture<any>(html`
      <semi-pin-code count="4" .autoFocus=${false} @complete=${(event: CustomEvent<{ value: string }>) => (complete = event.detail.value)}></semi-pin-code>
    `);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;
    const event = new Event('paste', { bubbles: true, composed: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => '9876' } });
    input.dispatchEvent(event);
    await element.updateComplete;

    expect(complete).toBe('9876');
    expect(Array.from(element.shadowRoot.querySelectorAll('input') as NodeListOf<HTMLInputElement>).map((item) => item.value).join('')).toBe('9876');
  });

  it('rejects characters outside the number format', async () => {
    const element = await fixture<any>(html`<semi-pin-code .autoFocus=${false}></semi-pin-code>`);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(input.value).toBe('');
  });

  it('supports status, mixed format and programmatic focus', async () => {
    const element = await fixture<any>(html`
      <semi-pin-code
        count="4"
        validate-status="error"
        .format=${'mixed'}
        .defaultValue=${'A1b2'}
        .autoFocus=${false}
      ></semi-pin-code>
    `);
    const group = element.shadowRoot.querySelector('.semi-pin-code');
    expect(group.classList.contains('semi-pin-code-error')).toBe(true);
    expect(group.querySelectorAll('input')).toHaveLength(4);

    element.focus(2);
    expect(element.shadowRoot.activeElement).toBe(group.querySelectorAll('input')[2]);
  });
});
