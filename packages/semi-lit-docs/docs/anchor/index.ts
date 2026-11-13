import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { AnchorChangeDetail, AnchorItem } from '@semi-ui';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

const stageStyle =
  'display:flex; gap:24px; height:260px; padding:16px; box-sizing:border-box; border:1px solid var(--semi-color-border); border-radius:8px; background:var(--semi-color-bg-2);';
const scrollerStyle = 'flex:1; min-width:0; overflow:auto; padding-right:12px;';
const blockStyle =
  'height:150px; padding:12px 16px; margin-bottom:12px; box-sizing:border-box; border:1px solid var(--semi-color-border); border-radius:6px; background:var(--semi-color-fill-0);';

const basicItems: AnchorItem[] = [
  { href: '#anchor-overview', title: '概览' },
  { href: '#anchor-usage', title: '使用方式' },
  { href: '#anchor-api', title: 'API' },
  { href: '#anchor-faq', title: '常见问题' },
];

const nestedItems: AnchorItem[] = [
  {
    href: '#anchor-nested-start',
    title: '快速开始',
    children: [
      { href: '#anchor-nested-install', title: '安装' },
      { href: '#anchor-nested-usage', title: '基础用法' },
    ],
  },
  {
    href: '#anchor-nested-api',
    title: 'API',
    children: [
      { href: '#anchor-nested-props', title: '属性' },
      { href: '#anchor-nested-events', title: '事件' },
      { href: '#anchor-nested-slots', title: '插槽' },
    ],
  },
];

const themeItems: AnchorItem[] = [
  { href: '#anchor-theme-overview', title: '概览' },
  { href: '#anchor-theme-usage', title: '使用方式' },
  { href: '#anchor-theme-api', title: 'API' },
  { href: '#anchor-theme-faq', title: '常见问题' },
];

const eventItems: AnchorItem[] = [
  { href: '#anchor-event-overview', title: '概览' },
  { href: '#anchor-event-usage', title: '使用方式' },
  { href: '#anchor-event-api', title: 'API' },
  { href: '#anchor-event-faq', title: '常见问题' },
];

@customElement('anchor-docs')
class AnchorDocs extends LitElement {
  @state()
  private _current = '#anchor-event-overview';

  protected createRenderRoot() {
    return this;
  }

  private _getContainerA = () => this.querySelector<HTMLElement>('.anchor-scroll-a') as HTMLElement;

  private _getContainerB = () => this.querySelector<HTMLElement>('.anchor-scroll-b') as HTMLElement;

  private _getContainerC = () => this.querySelector<HTMLElement>('.anchor-scroll-c') as HTMLElement;

  private _getContainerD = () => this.querySelector<HTMLElement>('.anchor-scroll-d') as HTMLElement;

  private _onChange(event: CustomEvent<AnchorChangeDetail>) {
    this._current = event.detail.currentLink;
  }

  private _currentTitle(): string {
    const all = eventItems.flatMap((item) => [item, ...(item.children ?? [])]);
    return all.find((item) => item.href === this._current)?.title ?? '未选中';
  }

  protected render() {
    return html`
      <h1>锚点</h1>
      <p>锚点用于在长页面中定位内容，滚动时自动高亮当前区域，支持嵌套层级与自定义滚动容器。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/anchor" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'items 提供锚点结构，getContainer 指定滚动容器；滚动容器时当前锚点会自动切换。',
        html`
          <div style=${stageStyle}>
            <semi-anchor
              .items=${basicItems}
              default-anchor="#anchor-overview"
              .getContainer=${this._getContainerA}
              style="width:132px; flex:none"
            ></semi-anchor>
            <div class="anchor-scroll-a" style=${scrollerStyle}>
              <div id="anchor-overview" style=${blockStyle}><strong>概览</strong><p>锚点会根据滚动位置高亮当前内容。</p></div>
              <div id="anchor-usage" style=${blockStyle}><strong>使用方式</strong><p>通过 items 或子元素声明链接。</p></div>
              <div id="anchor-api" style=${blockStyle}><strong>API</strong><p>支持 offset-top、target-offset、scroll-motion 等属性。</p></div>
              <div id="anchor-faq" style=${blockStyle}><strong>常见问题</strong><p>滚动容器需要是可滚动元素。</p></div>
            </div>
          </div>
        `,
        `<div class="scroll-container" style="height: 260px; overflow: auto">
  <div id="overview">概览</div>
  <div id="usage">使用方式</div>
</div>
<semi-anchor
  .items=\${items}
  .getContainer=\${() => document.querySelector('.scroll-container')}
></semi-anchor>`
      )}

      ${section(
        '嵌套与自动收起',
        '嵌套链接按 8px 层级缩进；auto-collapse 只展开当前链接所在的分支。',
        html`
          <div style=${stageStyle}>
            <semi-anchor
              .items=${nestedItems}
              auto-collapse
              default-anchor="#anchor-nested-install"
              .getContainer=${this._getContainerB}
              style="width:150px; flex:none"
            ></semi-anchor>
            <div class="anchor-scroll-b" style=${scrollerStyle}>
              <div id="anchor-nested-start" style=${blockStyle}><strong>快速开始</strong><p>安装与基础用法。</p></div>
              <div id="anchor-nested-install" style=${blockStyle}><strong>安装</strong><p>通过包管理器安装。</p></div>
              <div id="anchor-nested-usage" style=${blockStyle}><strong>基础用法</strong><p>引入组件并声明 items。</p></div>
              <div id="anchor-nested-api" style=${blockStyle}><strong>API</strong><p>属性、事件与插槽。</p></div>
              <div id="anchor-nested-props" style=${blockStyle}><strong>属性</strong><p>items、getContainer 等。</p></div>
              <div id="anchor-nested-events" style=${blockStyle}><strong>事件</strong><p>change 事件。</p></div>
              <div id="anchor-nested-slots" style=${blockStyle}><strong>插槽</strong><p>semi-anchor-link 子元素。</p></div>
            </div>
          </div>
        `,
        `<semi-anchor auto-collapse .items=\${items}></semi-anchor>

<semi-anchor>
  <semi-anchor-link href="#start" title="快速开始">
    <semi-anchor-link href="#install" title="安装"></semi-anchor-link>
  </semi-anchor-link>
</semi-anchor>`
      )}

      ${section(
        '尺寸与主题',
        'size 控制字号与滑轨高度，rail-theme 控制滑轨颜色；muted 会隐藏滑轨。',
        html`
          <div style=${stageStyle}>
            <div style="display:flex; flex-direction:column; gap:8px; width:96px; flex:none">
              <semi-anchor
                .items=${themeItems}
                size="small"
                rail-theme="tertiary"
                .getContainer=${this._getContainerC}
              ></semi-anchor>
              <semi-anchor
                .items=${themeItems}
                rail-theme="muted"
                .getContainer=${this._getContainerC}
              ></semi-anchor>
            </div>
            <div class="anchor-scroll-c" style=${scrollerStyle}>
              <div id="anchor-theme-overview" style=${blockStyle}><strong>概览</strong><p>同一滚动容器可以驱动多个锚点。</p></div>
              <div id="anchor-theme-usage" style=${blockStyle}><strong>使用方式</strong><p>size 与 rail-theme 可组合。</p></div>
              <div id="anchor-theme-api" style=${blockStyle}><strong>API</strong><p>muted 主题不显示滑轨。</p></div>
              <div id="anchor-theme-faq" style=${blockStyle}><strong>常见问题</strong><p>滚动容器需要设置 overflow。</p></div>
            </div>
          </div>
        `,
        `<semi-anchor size="small" rail-theme="tertiary" .items=\${items}></semi-anchor>
<semi-anchor rail-theme="muted" .items=\${items}></semi-anchor>`
      )}

      ${section(
        '偏移与事件',
        'target-offset 控制滚动停靠偏移；change 事件返回当前与上一个锚点。',
        html`
          <p style="margin:0 0 8px; color:var(--semi-color-text-2)">当前锚点：${this._currentTitle()}</p>
          <div style=${stageStyle}>
            <semi-anchor
              .items=${eventItems}
              default-anchor="#anchor-event-overview"
              target-offset="12"
              scroll-motion
              .getContainer=${this._getContainerD}
              @change=${this._onChange}
              style="width:132px; flex:none"
            ></semi-anchor>
            <div class="anchor-scroll-d" style=${scrollerStyle}>
              <div id="anchor-event-overview" style=${blockStyle}><strong>概览</strong><p>滚动查看事件。</p></div>
              <div id="anchor-event-usage" style=${blockStyle}><strong>使用方式</strong><p>点击或滚动都会更新。</p></div>
              <div id="anchor-event-api" style=${blockStyle}><strong>API</strong><p>targetOffset 设置停靠偏移。</p></div>
              <div id="anchor-event-faq" style=${blockStyle}><strong>常见问题</strong><p>change 只在真正切换时触发。</p></div>
            </div>
          </div>
        `,
        `<semi-anchor
  target-offset="12"
  scroll-motion
  .items=\${items}
  @change=\${handleChange}
></semi-anchor>`
      )}
    `;
  }
}
