import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/card/card';
import '../packages/semi-ui/components/avatar/avatar';
import '../packages/semi-ui/components/badge/badge';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

describe('Card', () => {
  it('renders title, header extra, body and footer', async () => {
    const element = await fixture<any>(html`
      <semi-card title="设计系统">
        <span slot="header-extra">Extra</span>
        <p>卡片内容</p>
        <div slot="footer">底部内容</div>
      </semi-card>
    `);

    expect(element.shadowRoot.querySelector('.semi-card-header-title').textContent).toBe('设计系统');
    expect(element.shadowRoot.querySelector('.semi-card-header-extra')).not.toBeNull();
    expect(element.shadowRoot.querySelector('.semi-card-body')).not.toBeNull();
    expect(element.shadowRoot.querySelector('.semi-card-footer')).not.toBeNull();
    expect(element.textContent).toContain('卡片内容');
    expect(element.textContent).toContain('底部内容');
  });

  it('supports border, shadow and loading options', async () => {
    const element = await fixture<any>(html`
      <semi-card
        title="加载中"
        .bordered=${false}
        shadows="hover"
        .loading=${true}
      ></semi-card>
    `);

    const card = element.shadowRoot.querySelector('.semi-card');
    expect(card.classList.contains('semi-card-bordered')).toBe(false);
    expect(card.classList.contains('semi-card-shadows-hover')).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-card-body semi-skeleton')).not.toBeNull();
  });

  it('renders actions', async () => {
    const element = await fixture<any>(html`
      <semi-card .actions=${[html`喜欢`, html`收藏`, html`更多`]}></semi-card>
    `);

    const actions = element.shadowRoot.querySelectorAll('.semi-card-action');
    expect(actions).toHaveLength(3);
    expect(actions[0].textContent?.trim()).toBe('喜欢');
  });
});

describe('Avatar', () => {
  it('renders preset and numeric sizes', async () => {
    const large = await fixture<any>(html`<semi-avatar size="large">L</semi-avatar>`);
    expect(large.shadowRoot.querySelector('.semi-avatar').classList.contains('semi-avatar-large')).toBe(true);
    expect(large.shadowRoot.querySelector('.semi-avatar').style.width).toBe('56px');

    const numeric = await fixture<any>(html`<semi-avatar size="48">48</semi-avatar>`);
    expect(numeric.shadowRoot.querySelector('.semi-avatar').style.width).toBe('48px');
    expect(numeric.shadowRoot.querySelector('.semi-avatar').classList.contains('semi-avatar-48')).toBe(false);
  });

  it('renders shape and background color', async () => {
    const element = await fixture<any>(html`
      <semi-avatar shape="square" color="#2f9e44">A</semi-avatar>
    `);

    const avatar = element.shadowRoot.querySelector('.semi-avatar');
    expect(avatar.classList.contains('semi-avatar-square')).toBe(true);
    expect(avatar.style.backgroundColor).toBeTruthy();
  });

  it('falls back to slot content when the image fails', async () => {
    const element = await fixture<any>(html`
      <semi-avatar src="/missing.png" alt="Semi">S</semi-avatar>
    `);

    expect(element.shadowRoot.querySelector('img')).not.toBeNull();
    element.shadowRoot.querySelector('img').dispatchEvent(new Event('error'));
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('img')).toBeNull();
    expect(element.shadowRoot.querySelector('slot')).not.toBeNull();
    expect(element.textContent).toContain('S');
  });

  it('renders fallback text when empty', async () => {
    const element = await fixture<any>(html`<semi-avatar fallback="SD"></semi-avatar>`);

    expect(element.shadowRoot.querySelector('slot').textContent).toContain('SD');
  });
});

describe('Badge', () => {
  it('shows counts and overflow suffix', async () => {
    const element = await fixture<any>(html`
      <semi-badge count="120" overflow-count="99">
        <semi-avatar>S</semi-avatar>
      </semi-badge>
    `);

    expect(element.shadowRoot.querySelector('.semi-badge-count').textContent?.trim()).toBe('99+');
  });

  it('hides zero unless show-zero is set', async () => {
    const hidden = await fixture<any>(html`<semi-badge count="0"></semi-badge>`);
    expect(hidden.shadowRoot.querySelector('.semi-badge-count')).toBeNull();

    const shown = await fixture<any>(html`<semi-badge count="0" show-zero></semi-badge>`);
    expect(shown.shadowRoot.querySelector('.semi-badge-count').textContent?.trim()).toBe('0');
  });

  it('renders a dot', async () => {
    const element = await fixture<any>(html`<semi-badge dot></semi-badge>`);

    const dot = element.shadowRoot.querySelector('.semi-badge-count');
    expect(dot.classList.contains('semi-badge-dot')).toBe(true);
    expect(dot.textContent?.trim()).toBe('');
  });

  it('renders a standalone status', async () => {
    const element = await fixture<any>(html`
      <semi-badge status="success" text="运行成功"></semi-badge>
    `);

    const status = element.shadowRoot.querySelector('.semi-badge-status');
    expect(status.classList.contains('semi-badge-status-success')).toBe(true);
    expect(status.textContent).toContain('运行成功');
    expect(element.shadowRoot.querySelector('.semi-badge-count')).toBeNull();
  });

  it('applies the badge color type', async () => {
    const element = await fixture<any>(html`
      <semi-badge count="5" type="success">
        <semi-avatar>S</semi-avatar>
      </semi-badge>
    `);

    expect(
      element.shadowRoot.querySelector('.semi-badge-count').classList.contains('semi-badge-count-success')
    ).toBe(true);
  });
});
