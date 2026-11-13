import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/tag-input/tag-input';
import '../packages/semi-ui/components/back-top/back-top';
import '../packages/semi-ui/components/float-button/float-button';
import '../packages/semi-ui/components/collapsible/collapsible';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

function setInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

function press(input: HTMLInputElement, key: string): void {
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
}

describe('TagInput', () => {
  it('renders tags and folds overflow into +N', async () => {
    const element = await fixture<any>(html`
      <semi-tag-input .defaultValue=${['设计', '前端', '组件']} max-tag-count="2"></semi-tag-input>
    `);

    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(2);
    expect(element.shadowRoot.querySelector('.semi-tagInput-rest')?.textContent).toContain('+1');
  });

  it('adds a tag on Enter and emits add/change', async () => {
    let changed: string[] | undefined;
    let added: string[] | undefined;
    const element = await fixture<any>(html`
      <semi-tag-input
        .defaultValue=${['设计']}
        @change=${(event: CustomEvent<{ value: string[] }>) => (changed = event.detail.value)}
        @add=${(event: CustomEvent<{ value: string[] }>) => (added = event.detail.value)}
      ></semi-tag-input>
    `);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;

    setInput(input, '前端');
    await element.updateComplete;
    press(input, 'Enter');
    await element.updateComplete;

    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(2);
    expect(changed).toEqual(['设计', '前端']);
    expect(added).toEqual(['前端']);
    expect(input.value).toBe('');
  });

  it('splits multiple tags by custom separators', async () => {
    const element = await fixture<any>(html`
      <semi-tag-input .separator=${['/', '，']}></semi-tag-input>
    `);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;

    setInput(input, '设计/前端，组件');
    await element.updateComplete;
    press(input, 'Enter');
    await element.updateComplete;

    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(3);
  });

  it('removes the last tag when Backspace is pressed on empty input', async () => {
    const element = await fixture<any>(html`
      <semi-tag-input .defaultValue=${['设计', '前端']}></semi-tag-input>
    `);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;

    press(input, 'Backspace');
    await element.updateComplete;

    const tags = [...element.shadowRoot.querySelectorAll('semi-tag')].map((tag) => tag.textContent?.trim());
    expect(tags).toEqual(['设计']);
  });

  it('truncates at max and emits exceed', async () => {
    let exceeded: string[] | undefined;
    const element = await fixture<any>(html`
      <semi-tag-input
        .defaultValue=${['a']}
        max="2"
        @exceed=${(event: CustomEvent<{ value: string[] }>) => (exceeded = event.detail.value)}
      ></semi-tag-input>
    `);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;

    setInput(input, 'b');
    await element.updateComplete;
    press(input, 'Enter');
    await element.updateComplete;
    setInput(input, 'c');
    await element.updateComplete;
    press(input, 'Enter');
    await element.updateComplete;

    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(2);
    expect(exceeded).toEqual(['a', 'b', 'c']);
  });

  it('clears tags through the clear button', async () => {
    let changed: string[] | undefined;
    const element = await fixture<any>(html`
      <semi-tag-input
        .defaultValue=${['设计']}
        show-clear
        @change=${(event: CustomEvent<{ value: string[] }>) => (changed = event.detail.value)}
      ></semi-tag-input>
    `);
    const clear = element.shadowRoot.querySelector('.semi-tagInput-clearBtn') as HTMLButtonElement;

    clear.click();
    await element.updateComplete;

    expect(element.shadowRoot.querySelectorAll('semi-tag')).toHaveLength(0);
    expect(changed).toEqual([]);
  });

  it('keeps the input and tags disabled', async () => {
    const element = await fixture<any>(html`
      <semi-tag-input disabled .defaultValue=${['设计']} show-clear></semi-tag-input>
    `);
    const input = element.shadowRoot.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-tagInput-clearBtn')).toBeNull();
  });
});

describe('BackTop', () => {
  it('appears after scrolling and scrolls back to top on click', async () => {
    const target = document.createElement('div');
    target.style.cssText = 'height: 100px; overflow: auto;';
    target.innerHTML = '<div style="height: 400px"></div>';
    document.body.appendChild(target);

    const element = await fixture<any>(html`
      <semi-back-top
        .target=${() => target}
        visibility-height="100"
        duration="0"
      ></semi-back-top>
    `);
    target.scrollTop = 200;
    target.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const button = element.shadowRoot.querySelector('button');
    expect(button).not.toBeNull();

    let clickTarget: unknown;
    element.addEventListener('back-top-click', (event: CustomEvent<{ target: unknown }>) => {
      clickTarget = event.detail.target;
    });
    button.click();
    await element.updateComplete;

    expect(target.scrollTop).toBe(0);
    expect(clickTarget).toBe(target);
    expect(element.shadowRoot.querySelector('button')).toBeNull();
  });

  it('stays hidden below the visibility threshold', async () => {
    const target = document.createElement('div');
    target.style.cssText = 'height: 100px; overflow: auto;';
    target.innerHTML = '<div style="height: 400px"></div>';
    document.body.appendChild(target);

    const element = await fixture<any>(html`
      <semi-back-top .target=${() => target} visibility-height="300"></semi-back-top>
    `);
    target.scrollTop = 120;
    target.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('button')).toBeNull();
  });
});

describe('FloatButton', () => {
  it('renders shape, size and colorful classes', async () => {
    const element = await fixture<any>(html`
      <semi-float-button shape="square" size="large" colorful></semi-float-button>
    `);
    const button = element.shadowRoot.querySelector('.semi-float-button') as HTMLElement;

    expect(button.classList.contains('semi-float-button-square')).toBe(true);
    expect(button.classList.contains('semi-float-button-large')).toBe(true);
    expect(button.classList.contains('semi-float-button-colorful')).toBe(true);
  });

  it('wraps the button with a badge', async () => {
    const element = await fixture<any>(html`
      <semi-float-button .badge=${{ count: 5 }}></semi-float-button>
    `);
    const badge = element.shadowRoot.querySelector('semi-badge') as any;
    await badge.updateComplete;

    expect(badge.shadowRoot.querySelector('.semi-badge-count')?.textContent).toContain('5');
  });

  it('renders an anchor for href and disables interaction when disabled', async () => {
    const link = await fixture<any>(html`
      <semi-float-button href="#target"></semi-float-button>
    `);
    expect(link.shadowRoot.querySelector('a')?.getAttribute('href')).toBe('#target');

    const disabled = await fixture<any>(html`
      <semi-float-button disabled></semi-float-button>
    `);
    const button = disabled.shadowRoot.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});

describe('Collapsible', () => {
  it('animates open and unmounts content when closed', async () => {
    const element = await fixture<any>(html`
      <semi-collapsible .duration=${0}>
        <div class="body">内容</div>
      </semi-collapsible>
    `);
    const wrapper = element.shadowRoot.querySelector('.semi-collapsible-wrapper') as HTMLElement;

    expect(wrapper.style.height).toBe('0px');
    expect(element.querySelector('.body')).not.toBeNull();

    element.isOpen = true;
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(wrapper.style.height).toBe('auto');
    expect(element.textContent).toContain('内容');

    element.isOpen = false;
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(wrapper.style.height).toBe('0px');
    expect(element.shadowRoot.querySelector('.semi-collapsible-inner slot')).toBeNull();
  });

  it('keeps the configured height when closed', async () => {
    const element = await fixture<any>(html`
      <semi-collapsible collapse-height="48" .duration=${0}>
        <div class="body">内容</div>
      </semi-collapsible>
    `);
    const wrapper = element.shadowRoot.querySelector('.semi-collapsible-wrapper') as HTMLElement;

    expect(wrapper.style.height).toBe('48px');
    expect(element.shadowRoot.querySelector('.semi-collapsible-inner slot')).not.toBeNull();
  });

  it('keeps content mounted with keep-dom after closing', async () => {
    const element = await fixture<any>(html`
      <semi-collapsible keep-dom .duration=${0}>
        <div class="body">内容</div>
      </semi-collapsible>
    `);
    element.isOpen = true;
    await element.updateComplete;
    element.isOpen = false;
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(element.shadowRoot.querySelector('.semi-collapsible-inner slot')).not.toBeNull();
  });

  it('defers the first render with lazy-render', async () => {
    const element = await fixture<any>(html`
      <semi-collapsible lazy-render .duration=${0}>
        <div class="body">延迟内容</div>
      </semi-collapsible>
    `);
    expect(element.shadowRoot.querySelector('.semi-collapsible-inner slot')).toBeNull();

    element.isOpen = true;
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(element.shadowRoot.querySelector('.semi-collapsible-inner slot')).not.toBeNull();
  });

  it('emits motion-end after open and close', async () => {
    let count = 0;
    const element = await fixture<any>(html`
      <semi-collapsible .duration=${0} @motion-end=${() => (count += 1)}>
        <div>内容</div>
      </semi-collapsible>
    `);
    element.isOpen = true;
    await element.updateComplete;
    element.isOpen = false;
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(count).toBe(2);
  });
});
