import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/portal/portal';
import '../packages/semi-ui/components/popup/popup';
import '../packages/semi-ui/components/trigger/trigger';
import '../packages/semi-ui/components/tooltip/tooltip';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('Portal', () => {
  it('renders content and toggles visibility', async () => {
    const portal = await fixture<any>(html`
      <semi-portal><span class="portal-content">内容</span></semi-portal>
    `);
    const surface = portal.shadowRoot.querySelector('.semi-portal');

    expect(surface.hasAttribute('hidden')).toBe(false);
    expect(portal.querySelector('.portal-content').textContent).toBe('内容');

    portal.open = false;
    await portal.updateComplete;
    expect(surface.hasAttribute('hidden')).toBe(true);
  });
});

describe('Popup', () => {
  it('renders position, arrow and role', async () => {
    const popup = await fixture<any>(html`<semi-popup position="top" role="tooltip">内容</semi-popup>`);
    const surface = popup.shadowRoot.querySelector('.semi-popup');

    expect(surface.classList.contains('semi-popup-top')).toBe(true);
    expect(surface.getAttribute('role')).toBe('tooltip');
    expect(popup.shadowRoot.querySelector('.semi-popup-arrow')).toBeTruthy();
  });
});

describe('Trigger', () => {
  it('opens on click, emits openChange, and closes on Escape', async () => {
    const trigger = await fixture<any>(html`
      <semi-trigger trigger="click" content="浮层内容">
        <button>打开</button>
      </semi-trigger>
    `);
    let detail: any;
    trigger.addEventListener('openChange', (event: CustomEvent) => (detail = event.detail));

    trigger.querySelector('button').click();
    await trigger.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const portal = trigger.shadowRoot.querySelector('semi-portal');
    expect(portal.open).toBe(true);
    expect(detail.open).toBe(true);
    expect(trigger.shadowRoot.querySelector('semi-portal').querySelector('semi-popup')).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await trigger.updateComplete;

    expect(portal.open).toBe(false);
    expect(detail.open).toBe(false);
  });

  it('uses hover delay for tooltip triggers', async () => {
    const tooltip = await fixture<any>(html`
      <semi-tooltip content="提示" .mouseEnterDelay=${0}>
        <button>悬浮</button>
      </semi-tooltip>
    `);
    const trigger = tooltip.shadowRoot.querySelector('semi-trigger');

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((resolve) => setTimeout(resolve, 20));
    await trigger.updateComplete;

    expect(trigger.shadowRoot.querySelector('semi-portal').open).toBe(true);
    expect(trigger.popupRole).toBe('tooltip');
  });
});
