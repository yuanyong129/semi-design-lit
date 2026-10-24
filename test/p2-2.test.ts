import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/popover/popover';
import '../packages/semi-ui/components/popconfirm/popconfirm';
import '../packages/semi-ui/components/dropdown/dropdown';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

function portalOf(host: any): any {
  return host.shadowRoot.querySelector('semi-trigger').shadowRoot.querySelector('semi-portal');
}

describe('Popover', () => {
  it('opens on click and renders title/content', async () => {
    const popover = await fixture<any>(html`
      <semi-popover title="标题" content="内容">
        <button>打开</button>
      </semi-popover>
    `);
    popover.querySelector('button').click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(portalOf(popover).open).toBe(true);
    const popup = popover.shadowRoot.querySelector('semi-trigger').shadowRoot.querySelector('semi-popup');
    expect(popup.textContent).toContain('标题');
    expect(popup.textContent).toContain('内容');
  });
});

describe('Popconfirm', () => {
  it('emits ok and closes when confirming', async () => {
    const popconfirm = await fixture<any>(html`
      <semi-popconfirm title="删除确认" content="确定吗？">
        <button>删除</button>
      </semi-popconfirm>
    `);
    let confirmed = 0;
    popconfirm.addEventListener('ok', () => confirmed++);

    popconfirm.querySelector('button').click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const trigger = popconfirm.shadowRoot.querySelector('semi-trigger');
    const buttons = trigger.shadowRoot.querySelector('semi-popup').querySelectorAll('semi-button');
    buttons[1].shadowRoot.querySelector('button').click();
    await popconfirm.updateComplete;
    await trigger.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(confirmed).toBe(1);
    expect(trigger.shadowRoot.querySelector('semi-portal').open).toBe(false);
  });
});

describe('Dropdown', () => {
  it('selects an option and closes', async () => {
    const dropdown = await fixture<any>(html`
      <semi-dropdown .options=${[
        { label: '复制', value: 'copy' },
        { label: '编辑', value: 'edit' },
      ]}>
        <button>更多</button>
      </semi-dropdown>
    `);
    let selected: any;
    dropdown.addEventListener('select', (event: CustomEvent) => (selected = event.detail));

    dropdown.querySelector('button').click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const trigger = dropdown.shadowRoot.querySelector('semi-trigger');
    const menu = trigger.shadowRoot.querySelector('semi-popup').querySelector('semi-dropdown-menu');
    menu.shadowRoot.querySelectorAll('.semi-dropdown-item')[1].click();
    await dropdown.updateComplete;
    await trigger.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(selected.value).toBe('edit');
    expect(trigger.shadowRoot.querySelector('semi-portal').open).toBe(false);
  });
});
