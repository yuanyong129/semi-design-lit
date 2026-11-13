import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/navigation/navigation';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

const items = [
  { itemKey: 'home', text: 'Home' },
  {
    itemKey: 'group',
    text: 'Group',
    items: [
      { itemKey: 'child', text: 'Child' },
      { itemKey: 'other', text: 'Other' },
    ],
  },
  { itemKey: 'disabled', text: 'Disabled', disabled: true },
];

const nodes = (element: any, selector: string) => Array.from(element.shadowRoot.querySelectorAll(selector)) as any[];

const byText = (element: any, selector: string, text: string) =>
  nodes(element, selector).find((node) => node.textContent.trim() === text);

describe('Navigation', () => {
  it('renders items and expanded submenu children', async () => {
    const element = await fixture<any>(html`
      <semi-navigation .items=${items} .defaultOpenKeys=${['group']}></semi-navigation>
    `);

    expect(nodes(element, '.semi-navigation-item')).toHaveLength(4);
    expect(byText(element, '.semi-navigation-item', 'Child')).toBeTruthy();
    expect(nodes(element, '.semi-navigation-sub')).toHaveLength(1);
  });

  it('selects a leaf and marks its parent branch', async () => {
    const element = await fixture<any>(html`
      <semi-navigation .items=${items} .defaultOpenKeys=${['group']}></semi-navigation>
    `);
    const changes: any[] = [];
    element.addEventListener('select', (event: Event) => changes.push((event as CustomEvent).detail));

    byText(element, '.semi-navigation-item', 'Child').click();
    await element.updateComplete;

    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ itemKey: 'child' });
    expect(changes[0].selectedKeys).toEqual(expect.arrayContaining(['child', 'group']));
    expect(byText(element, '.semi-navigation-item', 'Child').classList.contains('semi-navigation-item-selected')).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-navigation-sub-title-selected')).toBeTruthy();
  });

  it('supports multiple selection and toggling', async () => {
    const element = await fixture<any>(html`
      <semi-navigation
        multiple
        .items=${items}
        .defaultSelectedKeys=${['home']}
        .defaultOpenKeys=${['group']}
      ></semi-navigation>
    `);
    const changes: any[] = [];
    element.addEventListener('select', (event: Event) => changes.push((event as CustomEvent).detail));

    byText(element, '.semi-navigation-item', 'Child').click();
    await element.updateComplete;
    expect(changes[0].selectedKeys).toEqual(expect.arrayContaining(['home', 'child', 'group']));

    byText(element, '.semi-navigation-item', 'Child').click();
    await element.updateComplete;
    expect(changes[1].selectedKeys).not.toContain('child');
    expect(nodes(element, '.semi-navigation-item-selected').map((node) => node.textContent.trim())).toEqual(['Home']);
  });

  it('emits open-change when a submenu toggles', async () => {
    const element = await fixture<any>(html`<semi-navigation .items=${items}></semi-navigation>`);
    const changes: any[] = [];
    element.addEventListener('open-change', (event: Event) => changes.push((event as CustomEvent).detail));

    element.shadowRoot.querySelector('.semi-navigation-sub-title').click();
    await element.updateComplete;
    expect(changes[0]).toMatchObject({ itemKey: 'group', isOpen: true, openKeys: ['group'] });
    expect(byText(element, '.semi-navigation-item', 'Child')).toBeTruthy();

    element.shadowRoot.querySelector('.semi-navigation-sub-title').click();
    await element.updateComplete;
    expect(changes[1]).toMatchObject({ itemKey: 'group', isOpen: false, openKeys: [] });
    expect(byText(element, '.semi-navigation-item', 'Child')).toBeUndefined();
  });

  it('collapses the rail and hides header text', async () => {
    const element = await fixture<any>(html`
      <semi-navigation
        .items=${items}
        .header=${{ text: 'Semi Design' }}
        .footer=${{ collapseButton: true }}
      ></semi-navigation>
    `);

    element.isCollapsed = true;
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('.semi-navigation').classList.contains('semi-navigation-collapsed')).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-navigation-header-text')).toBeNull();
    expect(element.shadowRoot.querySelector('.semi-navigation-footer')).toBeTruthy();
  });

  it('opens a flyout submenu in horizontal mode', async () => {
    const element = await fixture<any>(html`
      <semi-navigation mode="horizontal" .items=${items}></semi-navigation>
    `);

    element.shadowRoot.querySelector('.semi-navigation-sub-title').click();
    await element.updateComplete;
    const flyout = element.shadowRoot.querySelector('.semi-navigation-popover');
    expect(flyout).toBeTruthy();
    expect(flyout.textContent).toContain('Child');
  });

  it('ignores disabled items', async () => {
    const element = await fixture<any>(html`<semi-navigation .items=${items}></semi-navigation>`);
    const changes: any[] = [];
    element.addEventListener('select', (event: Event) => changes.push((event as CustomEvent).detail));

    byText(element, '.semi-navigation-item', 'Disabled').click();
    await element.updateComplete;
    expect(changes).toHaveLength(0);
  });

  it('activates a leaf with the Enter key', async () => {
    const element = await fixture<any>(html`<semi-navigation .items=${items}></semi-navigation>`);
    const changes: any[] = [];
    element.addEventListener('select', (event: Event) => changes.push((event as CustomEvent).detail));

    byText(element, '.semi-navigation-item', 'Home').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    await element.updateComplete;
    expect(changes).toHaveLength(1);
    expect(changes[0].itemKey).toBe('home');
  });
});
