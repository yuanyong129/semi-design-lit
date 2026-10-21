import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/config-provider/config-provider';
import '../packages/semi-ui/components/locale/locale-provider';
import '../packages/semi-ui/components/empty/empty';
import zhCN from '../packages/semi-ui/components/locale/lang/zh-cn';
import enUS from '../packages/semi-ui/components/locale/lang/en-us';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('LocaleProvider', () => {
  it('provides locale to descendant components', async () => {
    const provider = await fixture<any>(html`
      <semi-locale-provider .locale=${enUS}>
        <semi-empty></semi-empty>
      </semi-locale-provider>
    `);
    const empty = provider.querySelector('semi-empty');

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(empty.shadowRoot.querySelector('.semi-empty-description').textContent.trim()).toBe('No Data');
  });

  it('lets ConfigProvider.locale take precedence over LocaleProvider', async () => {
    const provider = await fixture<any>(html`
      <semi-config-provider .locale=${zhCN}>
        <semi-locale-provider .locale=${enUS}>
          <semi-empty></semi-empty>
        </semi-locale-provider>
      </semi-config-provider>
    `);
    const empty = provider.querySelector('semi-empty');

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(empty.shadowRoot.querySelector('.semi-empty-description').textContent.trim()).toBe('暂无数据');
  });
});

describe('ConfigProvider', () => {
  it('applies rtl direction to a wrapper', async () => {
    const provider = await fixture<any>(html`
      <semi-config-provider direction="rtl">
        <span>内容</span>
      </semi-config-provider>
    `);
    const wrapper = provider.shadowRoot.querySelector('.semi-rtl');

    expect(wrapper).toBeTruthy();
    expect(wrapper.getAttribute('dir')).toBe('rtl');
  });
});
