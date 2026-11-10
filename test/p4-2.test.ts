import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/breadcrumb/breadcrumb';
import '../packages/semi-ui/components/breadcrumb/breadcrumb-item';
import '../packages/semi-ui/components/steps/steps';
import '../packages/semi-ui/components/collapse/collapse';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

describe('Breadcrumb', () => {
  it('renders items and marks the current page', async () => {
    const element = await fixture<any>(html`
      <semi-breadcrumb separator="›">
        <semi-breadcrumb-item href="/">首页</semi-breadcrumb-item>
        <semi-breadcrumb-item>组件</semi-breadcrumb-item>
        <semi-breadcrumb-item current>面包屑</semi-breadcrumb-item>
      </semi-breadcrumb>
    `);

    const items = element.querySelectorAll('semi-breadcrumb-item');
    expect(items).toHaveLength(3);
    expect(element.shadowRoot.querySelector('nav')?.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(items[0].shadowRoot.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(items[1].shadowRoot.querySelector('a')).toBeNull();
    expect(items[2].shadowRoot.querySelector('[aria-current="page"]')).not.toBeNull();
    expect(element.shadowRoot.querySelector('nav').style.getPropertyValue('--semi-breadcrumb-separator')).toContain('›');
  });

  it('supports compact mode and disabled items', async () => {
    const element = await fixture<any>(html`
      <semi-breadcrumb compact>
        <semi-breadcrumb-item disabled>禁用</semi-breadcrumb-item>
        <semi-breadcrumb-item>末项</semi-breadcrumb-item>
      </semi-breadcrumb>
    `);

    expect(element.hasAttribute('compact')).toBe(true);
    expect(element.shadowRoot.querySelector('.semi-breadcrumb').classList.contains('semi-breadcrumb-compact')).toBe(true);
    expect(element.querySelector('semi-breadcrumb-item').hasAttribute('disabled')).toBe(true);
  });
});

describe('Steps', () => {
  const stepsTemplate = () => html`
    <semi-steps current="1" clickable>
      <semi-step title="创建"></semi-step>
      <semi-step title="配置"></semi-step>
      <semi-step title="完成"></semi-step>
    </semi-steps>
  `;

  it('computes finish, process and wait states', async () => {
    const element = await fixture<any>(stepsTemplate());
    await element.updateComplete;
    const steps = Array.from(element.querySelectorAll('semi-step')) as any[];
    await Promise.all(steps.map((step) => step.updateComplete));

    expect(steps[0].shadowRoot.querySelector('.semi-step-finish')).not.toBeNull();
    expect(steps[1].shadowRoot.querySelector('.semi-step-process')).not.toBeNull();
    expect(steps[2].shadowRoot.querySelector('.semi-step-wait')).not.toBeNull();
    expect(steps[2].shadowRoot.querySelector('.semi-step-tail')).toBeNull();
  });

  it('applies an explicit status and supports dot / vertical modes', async () => {
    const element = await fixture<any>(html`
      <semi-steps current="1" status="error" type="dot" direction="vertical">
        <semi-step title="一"></semi-step>
        <semi-step title="二"></semi-step>
      </semi-steps>
    `);
    await element.updateComplete;
    const steps = Array.from(element.querySelectorAll('semi-step')) as any[];
    await Promise.all(steps.map((step) => step.updateComplete));

    expect(steps[1].shadowRoot.querySelector('.semi-step-error')).not.toBeNull();
    expect(steps[1].shadowRoot.querySelector('.semi-step-dot .semi-step-dot')).not.toBeNull();
    expect(steps[0].shadowRoot.querySelector('.semi-step-vertical')).not.toBeNull();
  });

  it('switches steps when clickable', async () => {
    const element = await fixture<any>(stepsTemplate());
    await element.updateComplete;
    const steps = Array.from(element.querySelectorAll('semi-step')) as any[];
    await Promise.all(steps.map((step) => step.updateComplete));

    let detail: any;
    element.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail;
    });
    steps[2].shadowRoot.querySelector('.semi-step').click();
    await element.updateComplete;

    expect(element.current).toBe(2);
    expect(detail.current).toBe(2);
  });

  it('supports nav type', async () => {
    const element = await fixture<any>(html`
      <semi-steps type="nav" current="0">
        <semi-step title="基本"></semi-step>
        <semi-step title="完成"></semi-step>
      </semi-steps>
    `);
    await element.updateComplete;
    const steps = Array.from(element.querySelectorAll('semi-step')) as any[];
    await Promise.all(steps.map((step) => step.updateComplete));

    expect(steps[0].shadowRoot.querySelector('.semi-step-nav')).not.toBeNull();
    steps[1].shadowRoot.querySelector('.semi-step').click();
    await element.updateComplete;
    expect(element.current).toBe(1);
  });
});

describe('Collapse', () => {
  it('expands the default panel and toggles another panel', async () => {
    const element = await fixture<any>(html`
      <semi-collapse default-active-key="a">
        <semi-collapse-panel item-key="a" header="A">内容 A</semi-collapse-panel>
        <semi-collapse-panel item-key="b" header="B">内容 B</semi-collapse-panel>
      </semi-collapse>
    `);
    await element.updateComplete;
    const panels = Array.from(element.querySelectorAll('semi-collapse-panel')) as any[];
    await Promise.all(panels.map((panel) => panel.updateComplete));

    expect(panels[0].shadowRoot.querySelector('.semi-collapse-panel-active')).not.toBeNull();
    expect(panels[1].shadowRoot.querySelector('.semi-collapse-panel-active')).toBeNull();

    let detail: any;
    element.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail;
    });
    panels[1].shadowRoot.querySelector('.semi-collapse-header').click();
    await element.updateComplete;
    await panels[1].updateComplete;

    expect(panels[0].shadowRoot.querySelector('.semi-collapse-panel-active')).not.toBeNull();
    expect(panels[1].shadowRoot.querySelector('.semi-collapse-panel-active')).not.toBeNull();
    expect(detail.activeKey).toEqual(['a', 'b']);
  });

  it('supports accordion mode and controlled activeKey', async () => {
    const element = await fixture<any>(html`
      <semi-collapse accordion .activeKey=${'a'}>
        <semi-collapse-panel item-key="a" header="A">A</semi-collapse-panel>
        <semi-collapse-panel item-key="b" header="B">B</semi-collapse-panel>
      </semi-collapse>
    `);
    await element.updateComplete;
    const panels = Array.from(element.querySelectorAll('semi-collapse-panel')) as any[];
    await Promise.all(panels.map((panel) => panel.updateComplete));

    expect(panels[0].shadowRoot.querySelector('.semi-collapse-panel-active')).not.toBeNull();

    let detail: any;
    element.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail;
    });
    panels[1].shadowRoot.querySelector('.semi-collapse-header').click();
    await element.updateComplete;

    // Controlled: visual state waits for the parent to update activeKey.
    expect(panels[0].shadowRoot.querySelector('.semi-collapse-panel-active')).not.toBeNull();
    expect(detail.activeKey).toBe('b');

    element.activeKey = 'b';
    await element.updateComplete;
    await panels[1].updateComplete;
    expect(panels[0].shadowRoot.querySelector('.semi-collapse-panel-active')).toBeNull();
    expect(panels[1].shadowRoot.querySelector('.semi-collapse-panel-active')).not.toBeNull();
  });

  it('supports icon position and ghost mode', async () => {
    const element = await fixture<any>(html`
      <semi-collapse ghost expand-icon-position="left" default-active-key="a">
        <semi-collapse-panel item-key="a" header="A">A</semi-collapse-panel>
      </semi-collapse>
    `);
    await element.updateComplete;
    const panel = element.querySelector('semi-collapse-panel') as any;
    await panel.updateComplete;

    expect(panel.ghost).toBe(true);
    expect(panel.shadowRoot.querySelector('.semi-collapse-icon-right')).toBeNull();
    expect(element.shadowRoot.querySelector('.semi-collapse-ghost')).not.toBeNull();
  });
});
