import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/button/button';
import '../packages/semi-ui/components/button/button-group';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('SemiButton', () => {
  it('renders Semi button classes for type, theme and size', async () => {
    const button = await fixture<any>(html`
      <semi-button type="primary" theme="solid" size="small">按钮</semi-button>
    `);
    const inner = button.shadowRoot.querySelector('button');

    expect(inner.classList.contains('semi-button')).toBe(true);
    expect(inner.classList.contains('semi-button-primary')).toBe(true);
    expect(inner.classList.contains('semi-button-solid')).toBe(true);
    expect(inner.classList.contains('semi-button-size-small')).toBe(true);
  });

  it('emits click and blocks clicks when disabled', async () => {
    let clicked = 0;
    const button = await fixture<any>(html`
      <semi-button @click=${() => clicked++}>按钮</semi-button>
    `);
    const inner = button.shadowRoot.querySelector('button');

    inner.click();
    expect(clicked).toBe(1);

    button.disabled = true;
    await button.updateComplete;
    inner.click();
    expect(clicked).toBe(1);
  });
});
