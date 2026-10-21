import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/switch/switch';
import '../packages/semi-ui/components/radio/radio';
import '../packages/semi-ui/components/radio/radio-group';
import '../packages/semi-ui/components/tag/tag';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('Switch', () => {
  it('toggles uncontrolled checked state and emits change', async () => {
    const element = await fixture<any>(html`<semi-switch></semi-switch>`);
    let detail: any;
    element.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    const button = element.shadowRoot.querySelector('button');
    button.click();
    await element.updateComplete;

    expect(button.classList.contains('semi-switch-checked')).toBe(true);
    expect(detail.checked).toBe(true);
  });
});

describe('RadioGroup', () => {
  it('updates selected radio through group context', async () => {
    const group = await fixture<any>(html`
      <semi-radio-group default-value="A">
        <semi-radio value="A">A</semi-radio>
        <semi-radio value="B">B</semi-radio>
      </semi-radio-group>
    `);
    const radios = [...group.querySelectorAll('semi-radio')];

    radios[1].shadowRoot.querySelector('input').dispatchEvent(new Event('change', { bubbles: true }));
    await group.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(radios[1].shadowRoot.querySelector('.semi-radio').classList.contains('semi-radio-checked')).toBe(true);
    expect(radios[0].shadowRoot.querySelector('.semi-radio').classList.contains('semi-radio-checked')).toBe(false);
  });
});

describe('Tag', () => {
  it('hides itself when closed', async () => {
    const tag = await fixture<any>(html`<semi-tag closable>标签</semi-tag>`);
    tag.shadowRoot.querySelector('.semi-tag-close').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await tag.updateComplete;

    expect(tag.shadowRoot.querySelector('.semi-tag')).toBeNull();
  });
});
