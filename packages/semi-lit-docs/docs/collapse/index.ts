import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

@customElement('collapse-docs')
class CollapseDocs extends LitElement {
  @state()
  private _activeKeys: string[] = ['design'];

  @state()
  private _accordionKey = 'one';

  protected createRenderRoot() {
    return this;
  }

  private _onChange(event: CustomEvent<{ activeKey: string | string[] }>) {
    const key = event.detail.activeKey;
    this._activeKeys = Array.isArray(key) ? key : key ? [key] : [];
  }

  private _onAccordionChange(event: CustomEvent<{ activeKey: string | string[] }>) {
    const key = event.detail.activeKey;
    this._accordionKey = Array.isArray(key) ? key[0] ?? '' : key;
  }

  protected render() {
    return html`
      <h1>折叠面板</h1>
      <p>折叠面板用于收纳和分组内容，支持手风琴模式、图标位置与幽灵模式。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/collapse" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'activeKey 受控控制展开的面板，未设置时使用 defaultActiveKey。',
        html`
          <semi-collapse .activeKey=${this._activeKeys} @change=${this._onChange}>
            <semi-collapse-panel item-key="design" header="设计原则">
              <div>统一、清晰、可预期，是 Semi Design 的基础设计原则。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="color" header="颜色系统">
              <div>通过语义化变量组织颜色，覆盖文本、背景、边框与状态色。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="type" header="字体与排版">
              <div>使用统一的字号、行高与字重，保持信息层级清晰。</div>
            </semi-collapse-panel>
          </semi-collapse>
        `,
        `<semi-collapse active-key="design">
  <semi-collapse-panel item-key="design" header="设计原则">…</semi-collapse-panel>
  <semi-collapse-panel item-key="color" header="颜色系统">…</semi-collapse-panel>
  <semi-collapse-panel item-key="type" header="字体与排版">…</semi-collapse-panel>
</semi-collapse>`
      )}

      ${section(
        '手风琴',
        'accordion 开启手风琴模式，同时只展开一个面板。',
        html`
          <semi-collapse
            accordion
            .activeKey=${this._accordionKey}
            @change=${this._onAccordionChange}
          >
            <semi-collapse-panel item-key="one" header="第一步：创建项目">
              <div>选择模板并填写项目名称。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="two" header="第二步：配置环境">
              <div>设置运行时、依赖与构建命令。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="three" header="第三步：发布">
              <div>确认配置后发布到生产环境。</div>
            </semi-collapse-panel>
          </semi-collapse>
        `,
        `<semi-collapse accordion active-key="one">…</semi-collapse>`
      )}

      ${section(
        '图标位置与禁用',
        'expand-icon-position 控制图标位置，disabled 禁用单个面板。',
        html`
          <semi-collapse expand-icon-position="left" default-active-key="a">
            <semi-collapse-panel item-key="a" header="左侧图标">
              <div>展开图标显示在标题左侧。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="b" header="禁用面板" disabled>
              <div>该面板不可展开。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="c" header="无图标" show-arrow="false">
              <div>通过 show-arrow="false" 隐藏展开图标。</div>
            </semi-collapse-panel>
          </semi-collapse>
        `,
        `<semi-collapse expand-icon-position="left" default-active-key="a">
  <semi-collapse-panel item-key="a" header="左侧图标">…</semi-collapse-panel>
  <semi-collapse-panel item-key="b" header="禁用面板" disabled>…</semi-collapse-panel>
  <semi-collapse-panel item-key="c" header="无图标" show-arrow="false">…</semi-collapse-panel>
</semi-collapse>`
      )}

      ${section(
        '幽灵模式',
        'ghost 与 bordered 组合可去除背景和边框，适合嵌入其他容器。',
        html`
          <semi-collapse ghost .bordered=${false} default-active-key="x">
            <semi-collapse-panel item-key="x" header="无边框面板">
              <div>幽灵模式下面板与页面背景融合。</div>
            </semi-collapse-panel>
            <semi-collapse-panel item-key="y" header="第二个面板">
              <div>仍支持展开与收起。</div>
            </semi-collapse-panel>
          </semi-collapse>
        `,
        `<semi-collapse ghost .bordered=${false} default-active-key="x">…</semi-collapse>`
      )}
    `;
  }
}
