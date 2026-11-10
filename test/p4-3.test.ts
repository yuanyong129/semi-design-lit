import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/descriptions/descriptions';
import '../packages/semi-ui/components/list/list';
import '../packages/semi-ui/components/timeline/timeline';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

describe('Descriptions', () => {
  it('renders label/value pairs and applies column count', async () => {
    const element = await fixture<any>(html`
      <semi-descriptions column="2" bordered>
        <semi-descriptions-item label="姓名">张三</semi-descriptions-item>
        <semi-descriptions-item label="部门">设计中心</semi-descriptions-item>
        <semi-descriptions-item label="地址" span="2">杭州市余杭区</semi-descriptions-item>
      </semi-descriptions>
    `);
    await element.updateComplete;
    const items = Array.from(element.querySelectorAll('semi-descriptions-item')) as any[];
    await Promise.all(items.map((item) => item.updateComplete));

    expect(element.shadowRoot.querySelector('.semi-descriptions-bordered')).not.toBeNull();
    expect(element.shadowRoot.querySelector('.semi-descriptions').style.getPropertyValue('--semi-descriptions-columns')).toBe('2');
    expect(items[0].shadowRoot.querySelector('.semi-descriptions-label').textContent).toContain('姓名');
    expect(items[0].textContent).toContain('张三');
    expect(items[2].style.getPropertyValue('--semi-descriptions-item-span')).toBe('2');
  });

  it('supports vertical direction, size and alignment', async () => {
    const element = await fixture<any>(html`
      <semi-descriptions column="3" direction="vertical" size="small" align="center">
        <semi-descriptions-item label="任务">验收</semi-descriptions-item>
      </semi-descriptions>
    `);
    await element.updateComplete;
    const item = element.querySelector('semi-descriptions-item') as any;
    await item.updateComplete;

    const inner = item.shadowRoot.querySelector('.semi-descriptions-item');
    expect(inner.classList.contains('semi-descriptions-item-vertical')).toBe(true);
    expect(inner.classList.contains('semi-descriptions-item-small')).toBe(true);
    expect(inner.classList.contains('semi-descriptions-item-center')).toBe(true);
  });
});

describe('List', () => {
  it('renders items with header, footer and split state', async () => {
    const element = await fixture<any>(html`
      <semi-list bordered header="动态" footer="共 2 条">
        <semi-list-item title="第一条" description="描述一" extra="刚刚"></semi-list-item>
        <semi-list-item title="第二条" description="描述二"></semi-list-item>
      </semi-list>
    `);
    await element.updateComplete;
    const items = Array.from(element.querySelectorAll('semi-list-item')) as any[];
    await Promise.all(items.map((item) => item.updateComplete));

    expect(element.shadowRoot.querySelector('.semi-list-bordered')).not.toBeNull();
    expect(element.shadowRoot.querySelector('.semi-list-header').textContent).toContain('动态');
    expect(element.shadowRoot.querySelector('.semi-list-footer').textContent).toContain('共 2 条');
    expect(items[0].shadowRoot.querySelector('.semi-list-item-description').textContent).toContain('描述一');
    expect(items[0].shadowRoot.querySelector('.semi-list-item-extra').textContent).toContain('刚刚');
    expect(items[1].shadowRoot.querySelector('.semi-list-item-last')).not.toBeNull();
  });

  it('shows skeleton rows while loading', async () => {
    const element = await fixture<any>(html`
      <semi-list loading header="加载中">
        <semi-list-item title="内容"></semi-list-item>
      </semi-list>
    `);
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('.semi-list-loading')).not.toBeNull();
    expect(element.shadowRoot.querySelector('.semi-list-loading')?.getAttribute('aria-busy')).toBe('true');
    expect(element.shadowRoot.querySelectorAll('semi-skeleton')).toHaveLength(3);
  });

  it('renders the empty state when there are no items', async () => {
    const element = await fixture<any>(html`
      <semi-list empty-text="暂无待办事项"></semi-list>
    `);
    await element.updateComplete;
    await element.updateComplete;

    const empty = element.shadowRoot.querySelector('semi-empty');
    expect(empty).not.toBeNull();
    expect(empty.getAttribute('description')).toBe('暂无待办事项');
  });

  it('supports custom item slots and actions', async () => {
    const element = await fixture<any>(html`
      <semi-list>
        <semi-list-item title="带操作">
          <semi-icon-star slot="avatar"></semi-icon-star>
          <a slot="actions" href="#">查看</a>
        </semi-list-item>
      </semi-list>
    `);
    await element.updateComplete;
    const item = element.querySelector('semi-list-item') as any;
    await item.updateComplete;
    await item.updateComplete;

    expect(item.shadowRoot.querySelector('.semi-list-item-avatar').hasAttribute('hidden')).toBe(false);
    expect(item.shadowRoot.querySelector('.semi-list-item-actions').hasAttribute('hidden')).toBe(false);
  });
});

describe('Timeline', () => {
  it('assigns alternate sides and marks the last item', async () => {
    const element = await fixture<any>(html`
      <semi-timeline mode="alternate">
        <semi-timeline-item time="09:00">一</semi-timeline-item>
        <semi-timeline-item time="10:00">二</semi-timeline-item>
        <semi-timeline-item time="11:00">三</semi-timeline-item>
      </semi-timeline>
    `);
    await element.updateComplete;
    const items = Array.from(element.querySelectorAll('semi-timeline-item')) as any[];
    await Promise.all(items.map((item) => item.updateComplete));

    expect(items[0].shadowRoot.querySelector('.semi-timeline-item-left')).not.toBeNull();
    expect(items[1].shadowRoot.querySelector('.semi-timeline-item-right')).not.toBeNull();
    expect(items[0].shadowRoot.querySelector('.semi-timeline-item-alternate')).not.toBeNull();
    expect(items[2].shadowRoot.querySelector('.semi-timeline-item-last')).not.toBeNull();
  });

  it('reverses visual order and keeps the tail on the last visual item', async () => {
    const element = await fixture<any>(html`
      <semi-timeline reverse>
        <semi-timeline-item time="09:00">一</semi-timeline-item>
        <semi-timeline-item time="10:00">二</semi-timeline-item>
        <semi-timeline-item time="11:00">三</semi-timeline-item>
      </semi-timeline>
    `);
    await element.updateComplete;
    const items = Array.from(element.querySelectorAll('semi-timeline-item')) as any[];
    await Promise.all(items.map((item) => item.updateComplete));

    expect(items[0].style.getPropertyValue('--semi-timeline-order')).toBe('2');
    expect(items[2].style.getPropertyValue('--semi-timeline-order')).toBe('0');
    expect(items[0].shadowRoot.querySelector('.semi-timeline-item-last')).not.toBeNull();
    expect(items[1].shadowRoot.querySelector('.semi-timeline-item-last')).toBeNull();
  });

  it('supports node colors and custom dot content', async () => {
    const element = await fixture<any>(html`
      <semi-timeline>
        <semi-timeline-item time="09:00" color="green" .dot=${html`<span class="custom-dot">✓</span>`}>
          成功
        </semi-timeline-item>
        <semi-timeline-item time="10:00" color="red">失败</semi-timeline-item>
      </semi-timeline>
    `);
    await element.updateComplete;
    const items = Array.from(element.querySelectorAll('semi-timeline-item')) as any[];
    await Promise.all(items.map((item) => item.updateComplete));

    const dot = items[0].shadowRoot.querySelector('.semi-timeline-dot');
    expect(dot.style.background).toContain('--semi-color-success');
    expect(dot.querySelector('.custom-dot')?.textContent).toBe('✓');
    expect(items[1].shadowRoot.querySelector('.semi-timeline-dot').style.background).toContain('--semi-color-danger');
  });

  it('supports right-aligned mode', async () => {
    const element = await fixture<any>(html`
      <semi-timeline mode="right">
        <semi-timeline-item time="09:00">内容</semi-timeline-item>
      </semi-timeline>
    `);
    await element.updateComplete;
    const item = element.querySelector('semi-timeline-item') as any;
    await item.updateComplete;

    expect(item.shadowRoot.querySelector('.semi-timeline-item-right')).not.toBeNull();
  });
});
