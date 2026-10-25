import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/progress/progress';
import '../packages/semi-ui/components/skeleton/skeleton';
import '../packages/semi-ui/components/banner/banner';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('Progress', () => {
  it('renders a line progress with width, info and aria value', async () => {
    const progress = await fixture<any>(html`
      <semi-progress percent="40"></semi-progress>
    `);
    const root = progress.shadowRoot.querySelector('.semi-progress');
    const fill = progress.shadowRoot.querySelector('.semi-progress-fill');

    expect(root.getAttribute('aria-valuenow')).toBe('40');
    expect(fill.style.width).toBe('40%');
    expect(progress.shadowRoot.querySelector('.semi-progress-info').textContent).toBe('40%');
  });

  it('supports custom format and circle type', async () => {
    const progress = await fixture<any>(html`
      <semi-progress type="circle" percent="75" .format=${(p: number) => `${p} / 100 项`}></semi-progress>
    `);

    expect(progress.shadowRoot.querySelector('.semi-progress-circle')).toBeTruthy();
    expect(progress.shadowRoot.querySelector('.semi-progress-info').textContent).toBe('75 / 100 项');
    expect(progress.shadowRoot.querySelector('circle.semi-progress-circle-fill')).toBeTruthy();
  });
});

describe('Skeleton', () => {
  it('renders placeholder rows while loading and content after loading', async () => {
    const skeleton = await fixture<any>(html`
      <semi-skeleton avatar rows="3"><span class="content">内容</span></semi-skeleton>
    `);
    expect(skeleton.shadowRoot.querySelectorAll('.semi-skeleton-row').length).toBe(3);
    expect(skeleton.shadowRoot.querySelector('.semi-skeleton-avatar')).toBeTruthy();

    skeleton.loading = false;
    await skeleton.updateComplete;
    expect(skeleton.shadowRoot.querySelector('.semi-skeleton')).toBeNull();
    expect(skeleton.querySelector('.content')).toBeTruthy();
  });
});

describe('Banner', () => {
  it('renders type, title and closes', async () => {
    const banner = await fixture<any>(html`
      <semi-banner type="warning" title="提示" description="内容" closable></semi-banner>
    `);
    let closed = 0;
    banner.addEventListener('close', () => closed++);

    const root = banner.shadowRoot.querySelector('.semi-banner');
    expect(root.classList.contains('semi-banner-warning')).toBe(true);
    expect(root.textContent).toContain('提示');

    banner.shadowRoot.querySelector('.semi-banner-close').click();
    await banner.updateComplete;

    expect(closed).toBe(1);
    expect(banner.shadowRoot.querySelector('.semi-banner')).toBeNull();
  });
});
