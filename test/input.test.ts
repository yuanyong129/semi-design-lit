import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/input/input';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('SemiInput', () => {
  it('shows the clear button on hover/focus and clears uncontrolled value', async () => {
    const input = await fixture<any>(html`
      <semi-input default-value="Semi Design" show-clear></semi-input>
    `);
    const wrapper = input.shadowRoot.querySelector('.semi-input-wrapper');
    const nativeInput = input.shadowRoot.querySelector('input');

    wrapper.dispatchEvent(new MouseEvent('mouseenter'));
    await input.updateComplete;

    const clear = input.shadowRoot.querySelector('.semi-input-clearbtn');
    expect(clear).toBeTruthy();

    let detail: any;
    input.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail;
    });
    clear.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await input.updateComplete;

    expect(nativeInput.value).toBe('');
    expect(detail.value).toBe('');
    expect(detail.fromClearBtn).toBe(true);
  });

  it('toggles password visibility in password mode', async () => {
    const input = await fixture<any>(html`
      <semi-input mode="password" default-value="secret"></semi-input>
    `);
    const nativeInput = input.shadowRoot.querySelector('input');
    const modeButton = input.shadowRoot.querySelector('.semi-input-modebtn');

    expect(nativeInput.type).toBe('password');
    modeButton.click();
    await input.updateComplete;
    expect(nativeInput.type).toBe('text');
  });

  it('honours maxLength with getValueLength', async () => {
    const input = await fixture<any>(html`
      <semi-input maxLength="3" .getValueLength=${(value: string) => value.length}></semi-input>
    `);
    const nativeInput = input.shadowRoot.querySelector('input');

    nativeInput.value = 'abcdef';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await input.updateComplete;

    expect(nativeInput.value).toBe('abc');
  });
});
