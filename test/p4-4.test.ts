import { afterEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/grid';
import '../packages/semi-ui/components/layout';
import '../packages/semi-ui/components/image/image';
import '../packages/semi-ui/components/carousel/carousel';
import { cleanup, fixture } from './helpers';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Grid', () => {
  it('applies gutter, span and offset classes', async () => {
    const row = await fixture<any>(html`
      <semi-row gutter="24" align="center" justify="space-between">
        <semi-col span="6" offset="2"></semi-col>
        <semi-col span="6" push="2" pull="1"></semi-col>
      </semi-row>
    `);
    const cols = Array.from(row.querySelectorAll('semi-col')) as any[];
    await Promise.all(cols.map((col) => col.updateComplete));

    const inner = row.shadowRoot.querySelector('.semi-row');
    expect(inner.classList.contains('semi-row-wrap')).toBe(true);
    expect(inner.classList.contains('semi-row-align-center')).toBe(true);
    expect(inner.classList.contains('semi-row-justify-space-between')).toBe(true);
    expect(inner.style.getPropertyValue('--semi-grid-gutter-x')).toBe('24px');
    expect(inner.style.marginLeft).toBe('-12px');
    expect(cols[0].classList.contains('semi-col-6')).toBe(true);
    expect(cols[0].classList.contains('semi-col-offset-2')).toBe(true);
    expect(cols[1].classList.contains('semi-col-push-2')).toBe(true);
    expect(cols[1].classList.contains('semi-col-pull-1')).toBe(true);
  });

  it('supports responsive spans and block layout', async () => {
    const row = await fixture<any>(html`
      <semi-row type="block" .gutter=${[16, 8]}>
        <semi-col xs="24" sm="12" md="8" lg="6" xl="4" xxl="3"></semi-col>
      </semi-row>
    `);
    const col = row.querySelector('semi-col') as any;
    await col.updateComplete;

    expect(row.shadowRoot.querySelector('.semi-row').classList.contains('semi-row-block')).toBe(true);
    expect(row.shadowRoot.querySelector('.semi-row').style.getPropertyValue('--semi-grid-gutter-y')).toBe('8px');
    expect(col.classList.contains('semi-col-xs-24')).toBe(true);
    expect(col.classList.contains('semi-col-sm-12')).toBe(true);
    expect(col.classList.contains('semi-col-md-8')).toBe(true);
    expect(col.classList.contains('semi-col-lg-6')).toBe(true);
    expect(col.classList.contains('semi-col-xl-4')).toBe(true);
    expect(col.classList.contains('semi-col-xxl-3')).toBe(true);
  });

  it('hides a zero-span column', async () => {
    const col = await fixture<any>(html`<semi-col span="0"></semi-col>`);
    expect(col.classList.contains('semi-col-0')).toBe(true);
  });
});

describe('Layout', () => {
  it('renders a basic layout and marks sider layouts', async () => {
    const layout = await fixture<any>(html`
      <semi-layout>
        <semi-layout-header>Header</semi-layout-header>
        <semi-layout-content>Content</semi-layout-content>
        <semi-layout-footer>Footer</semi-layout-footer>
      </semi-layout>
    `);
    await layout.updateComplete;
    expect(layout.shadowRoot.querySelector('.semi-layout')).not.toBeNull();
    expect(layout.hasAttribute('data-has-sider')).toBe(false);

    const withSider = await fixture<any>(html`
      <semi-layout>
        <semi-layout-sider></semi-layout-sider>
        <semi-layout-content>Content</semi-layout-content>
      </semi-layout>
    `);
    await withSider.updateComplete;
    expect(withSider.hasAttribute('data-has-sider')).toBe(true);
  });

  it('collapses and expands from the trigger', async () => {
    const sider = await fixture<any>(html`<semi-layout-sider width="220" collapsed-width="72"></semi-layout-sider>`);
    const events: any[] = [];
    sider.addEventListener('collapse', (event: CustomEvent) => events.push(event.detail));
    const trigger = sider.shadowRoot.querySelector('.semi-layout-sider-trigger') as HTMLButtonElement;
    const aside = sider.shadowRoot.querySelector('.semi-layout-sider') as HTMLElement;

    expect(aside.style.width).toBe('220px');
    trigger.click();
    await sider.updateComplete;
    expect(aside.style.width).toBe('72px');
    expect(trigger.getAttribute('aria-label')).toBe('展开侧边栏');
    expect(events[0]).toEqual({ collapsed: true, type: 'trigger' });

    trigger.click();
    await sider.updateComplete;
    expect(aside.style.width).toBe('220px');
    expect(events[1]).toEqual({ collapsed: false, type: 'trigger' });
  });

  it('honours default-collapsed and hides the trigger', async () => {
    const sider = await fixture<any>(html`
      <semi-layout-sider default-collapsed .trigger=${false} reverse-arrow></semi-layout-sider>
    `);
    await sider.updateComplete;
    expect(sider.shadowRoot.querySelector('.semi-layout-sider').style.width).toBe('64px');
    expect(sider.shadowRoot.querySelector('.semi-layout-sider-trigger')).toBeNull();
  });
});

describe('Image', () => {
  it('renders size, fit and mask', async () => {
    const image = await fixture<any>(html`
      <semi-image src="/cover.png" alt="封面" width="320" height="180" fit="contain" preview-mask="查看"></semi-image>
    `);
    const wrapper = image.shadowRoot.querySelector('.semi-image');
    expect(wrapper.style.width).toBe('320px');
    expect(wrapper.style.height).toBe('180px');
    const img = image.shadowRoot.querySelector('.semi-image-img');
    expect(img.getAttribute('src')).toBe('/cover.png');
    expect(img.style.objectFit).toBe('contain');
    expect(image.shadowRoot.querySelector('.semi-image-mask').textContent).toContain('查看');
  });

  it('swaps to fallback and shows a clean error state', async () => {
    const image = await fixture<any>(html`
      <semi-image src="/missing.png" fallback="/fallback.png"></semi-image>
    `);
    const img = image.shadowRoot.querySelector('.semi-image-img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    await image.updateComplete;

    expect(image.shadowRoot.querySelector('.semi-image-img').getAttribute('src')).toBe('/fallback.png');
    expect(image.shadowRoot.querySelector('.semi-image-fallback')).toBeNull();

    image.shadowRoot.querySelector('.semi-image-img').dispatchEvent(new Event('load'));
    await image.updateComplete;
    expect(image.shadowRoot.querySelector('.semi-image-img').getAttribute('src')).toBe('/fallback.png');
  });

  it('shows the built-in error state without a fallback and can preview', async () => {
    const image = await fixture<any>(html`<semi-image src="/missing.png"></semi-image>`);
    image.shadowRoot.querySelector('.semi-image-img').dispatchEvent(new Event('error'));
    await image.updateComplete;

    expect(image.shadowRoot.querySelector('.semi-image-img')).toBeNull();
    expect(image.shadowRoot.querySelector('.semi-image-fallback').textContent).toContain('图片加载失败');

    const preview = await fixture<any>(html`<semi-image src="/cover.png"></semi-image>`);
    (preview.shadowRoot.querySelector('.semi-image') as HTMLElement).click();
    await preview.updateComplete;
    expect(preview.shadowRoot.querySelector('.semi-image-preview')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');

    (preview.shadowRoot.querySelector('.semi-image-preview-close') as HTMLButtonElement).click();
    await preview.updateComplete;
    expect(preview.shadowRoot.querySelector('.semi-image-preview')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('Carousel', () => {
  it('renders slides, indicators and moves with next/prev', async () => {
    const carousel = await fixture<any>(html`
      <semi-carousel height="240">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </semi-carousel>
    `);
    await carousel.updateComplete;
    const slides = Array.from(carousel.children) as HTMLElement[];
    const events: any[] = [];
    carousel.addEventListener('change', (event: CustomEvent) => events.push(event.detail));

    expect(carousel.shadowRoot.querySelector('.semi-carousel').style.height).toBe('240px');
    expect(slides[0].classList.contains('semi-carousel-item-active')).toBe(true);
    expect(carousel.shadowRoot.querySelectorAll('.semi-carousel-indicator').length).toBe(3);

    carousel.next();
    await carousel.updateComplete;
    expect(slides[1].classList.contains('semi-carousel-item-active')).toBe(true);
    expect(slides[1].getAttribute('aria-hidden')).toBe('false');
    expect(events[0].current).toBe(1);
    expect(events[0].prev).toBe(0);

    carousel.prev();
    carousel.prev();
    await carousel.updateComplete;
    expect(slides[2].classList.contains('semi-carousel-item-active')).toBe(true);
  });

  it('supports controlled index, indicator clicks and slider indicators', async () => {
    const carousel = await fixture<any>(html`
      <semi-carousel .current=${2} indicator-type="slider" show-arrow="never">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </semi-carousel>
    `);
    await carousel.updateComplete;
    const slides = Array.from(carousel.children) as HTMLElement[];
    expect(slides[2].classList.contains('semi-carousel-item-active')).toBe(true);
    expect(carousel.shadowRoot.querySelector('.semi-carousel-slider-bar').style.width).toContain('100%');
    expect(carousel.shadowRoot.querySelectorAll('.semi-carousel-arrow').length).toBe(0);

    const dots = await fixture<any>(html`
      <semi-carousel>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </semi-carousel>
    `);
    await dots.updateComplete;
    (dots.shadowRoot.querySelectorAll('.semi-carousel-indicator')[1] as HTMLButtonElement).click();
    await dots.updateComplete;
    expect((dots.children[1] as HTMLElement).classList.contains('semi-carousel-item-active')).toBe(true);
  });

  it('loops by default, clamps without loop and autoplays', async () => {
    const carousel = await fixture<any>(html`
      <semi-carousel>
        <div>One</div>
        <div>Two</div>
      </semi-carousel>
    `);
    carousel.prev();
    await carousel.updateComplete;
    expect((carousel.children[1] as HTMLElement).classList.contains('semi-carousel-item-active')).toBe(true);

    carousel.loop = false;
    carousel.goTo(9);
    await carousel.updateComplete;
    expect((carousel.children[1] as HTMLElement).classList.contains('semi-carousel-item-active')).toBe(true);

    carousel.goTo(0);
    await carousel.updateComplete;
    expect((carousel.children[0] as HTMLElement).classList.contains('semi-carousel-item-active')).toBe(true);

    vi.useFakeTimers();
    carousel.autoplay = true;
    carousel.interval = 500;
    await carousel.updateComplete;
    vi.advanceTimersByTime(500);
    await carousel.updateComplete;
    expect((carousel.children[1] as HTMLElement).classList.contains('semi-carousel-item-active')).toBe(true);
  });
});
