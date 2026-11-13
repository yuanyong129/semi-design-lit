import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/anchor/anchor';
import '../packages/semi-ui/components/anchor/anchor-link';
import { cleanup, fixture } from './helpers';

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  Element.prototype.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const titles = (element: any) =>
  Array.from(element.shadowRoot.querySelectorAll('.semi-anchor-link-title')).map((node: any) =>
    node.textContent.trim()
  );

describe('Anchor', () => {
  it('renders links with nested indentation', async () => {
    const element = await fixture<any>(html`
      <semi-anchor
        .items=${[
          {
            href: '#a',
            title: 'A',
            children: [{ href: '#a1', title: 'A1' }],
          },
          { href: '#b', title: 'B' },
        ]}
      ></semi-anchor>
    `);

    expect(titles(element)).toEqual(['A', 'A1', 'B']);
    const nodes = element.shadowRoot.querySelectorAll('.semi-anchor-link-title');
    expect(nodes[0].style.paddingLeft).toBe('8px');
    expect(nodes[1].style.paddingLeft).toBe('16px');
  });

  it('activates the default anchor and renders the rail bar', async () => {
    const element = await fixture<any>(html`
      <div>
        <semi-anchor
          default-anchor="#a"
          .items=${[
            { href: '#a', title: 'A' },
            { href: '#b', title: 'B' },
          ]}
        ></semi-anchor>
        <div id="a">A</div>
        <div id="b">B</div>
      </div>
    `);
    const anchor = element.querySelector('semi-anchor');

    await new Promise((resolve) => setTimeout(resolve, 30));
    await anchor.updateComplete;

    expect(anchor.shadowRoot.querySelector('.semi-anchor-link-title-active').textContent.trim()).toBe('A');
    expect(anchor.shadowRoot.querySelector('.semi-anchor-slide-bar').style.display).toBe('block');
  });

  it('updates active link and emits change on click', async () => {
    const element = await fixture<any>(html`
      <div>
        <semi-anchor
          .items=${[
            { href: '#a', title: 'A' },
            { href: '#b', title: 'B' },
          ]}
        ></semi-anchor>
        <div id="a">A</div>
        <div id="b">B</div>
      </div>
    `);
    const anchor = element.querySelector('semi-anchor');
    const changes: any[] = [];
    anchor.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));

    anchor.shadowRoot.querySelectorAll('.semi-anchor-link-title')[1].click();
    await anchor.updateComplete;

    expect(anchor.shadowRoot.querySelector('.semi-anchor-link-title-active').textContent.trim()).toBe('B');
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ currentLink: '#b', previousLink: '' });
  });

  it('does not activate disabled links', async () => {
    const element = await fixture<any>(html`
      <semi-anchor
        .items=${[
          { href: '#a', title: 'A', disabled: true },
          { href: '#b', title: 'B' },
        ]}
      ></semi-anchor>
    `);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));

    element.shadowRoot.querySelectorAll('.semi-anchor-link-title')[0].click();
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('.semi-anchor-link-title-active')).toBeNull();
    expect(changes).toHaveLength(0);
  });

  it('collapses nested links until their branch is active', async () => {
    const collapsed = await fixture<any>(html`
      <semi-anchor
        auto-collapse
        .items=${[
          {
            href: '#a',
            title: 'A',
            children: [{ href: '#a1', title: 'A1' }],
          },
        ]}
      ></semi-anchor>
    `);
    expect(collapsed.shadowRoot.querySelector('.semi-anchor-sub')).toBeNull();

    cleanup();
    const expanded = await fixture<any>(html`
      <div>
        <semi-anchor
          auto-collapse
          default-anchor="#a1"
          .items=${[
            {
              href: '#a',
              title: 'A',
              children: [{ href: '#a1', title: 'A1' }],
            },
          ]}
        ></semi-anchor>
        <div id="a1">A1</div>
      </div>
    `);
    const anchor = expanded.querySelector('semi-anchor');
    await new Promise((resolve) => setTimeout(resolve, 30));
    await anchor.updateComplete;
    expect(anchor.shadowRoot.querySelector('.semi-anchor-sub')).not.toBeNull();
    expect(titles(anchor)).toEqual(['A', 'A1']);
  });

  it('collects slotted semi-anchor-link children', async () => {
    const element = await fixture<any>(html`
      <semi-anchor>
        <semi-anchor-link href="#a" title="A">
          <semi-anchor-link href="#a1" title="A1"></semi-anchor-link>
        </semi-anchor-link>
        <semi-anchor-link href="#b" title="B"></semi-anchor-link>
      </semi-anchor>
    `);
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(titles(element)).toEqual(['A', 'A1', 'B']);
  });

  it('activates a link with Enter and hides the bar for muted theme', async () => {
    const element = await fixture<any>(html`
      <semi-anchor
        rail-theme="muted"
        .items=${[
          { href: '#a', title: 'A' },
          { href: '#b', title: 'B' },
        ]}
      ></semi-anchor>
    `);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));

    element.shadowRoot
      .querySelectorAll('.semi-anchor-link-title')[0]
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await element.updateComplete;

    expect(changes).toHaveLength(1);
    expect(element.shadowRoot.querySelector('.semi-anchor-slide-bar').style.display).toBe('none');
  });
});
