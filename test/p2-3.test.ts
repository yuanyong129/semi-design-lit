import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/modal/modal';
import '../packages/semi-ui/components/side-sheet/side-sheet';
import { fixture, cleanup } from './helpers';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function portalOf(host: any): any {
  return host.shadowRoot.querySelector('semi-portal');
}

describe('Modal', () => {
  it('shows, locks body scroll, closes on Escape and restores scroll', async () => {
    const modal = await fixture<any>(html`
      <semi-modal title="标题"><p>内容</p></semi-modal>
    `);
    let closed = 0;
    modal.addEventListener('afterClose', () => closed++);

    modal.show();
    await modal.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(portalOf(modal).open).toBe(true);
    expect(modal.shadowRoot.querySelector('.semi-modal')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await modal.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(portalOf(modal).open).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(closed).toBe(1);
  });

  it('emits openChange when toggled', async () => {
    const modal = await fixture<any>(html`<semi-modal title="标题">内容</semi-modal>`);
    let visible: boolean | undefined;
    modal.addEventListener('openChange', (event: CustomEvent) => (visible = event.detail.visible));

    modal.show();
    await modal.updateComplete;
    expect(visible).toBe(true);

    modal.hide();
    await modal.updateComplete;
    expect(visible).toBe(false);
  });
});

describe('SideSheet', () => {
  it('renders on the requested side and closes', async () => {
    const sheet = await fixture<any>(html`
      <semi-side-sheet title="面板" placement="left" width="360">内容</semi-side-sheet>
    `);

    sheet.show();
    await sheet.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const panel = sheet.shadowRoot.querySelector('.semi-side-sheet');
    expect(portalOf(sheet).open).toBe(true);
    expect(panel.classList.contains('semi-side-sheet-left')).toBe(true);
    expect(panel.style.width).toBe('360px');

    sheet.hide();
    await sheet.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(portalOf(sheet).open).toBe(false);
  });
});
