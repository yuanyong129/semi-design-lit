import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block demo-block-wide">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

const menuItem = (label: string, active = false) => html`
  <div
    style="padding: 10px 20px; font-size: 14px; cursor: pointer; color: ${active
      ? 'var(--semi-color-primary)'
      : 'var(--semi-color-text-1)'}; background: ${active ? 'var(--semi-color-primary-light-default)' : 'transparent'};"
  >
    ${label}
  </div>
`;

@customElement('layout-docs')
class LayoutDocs extends LitElement {
  @state()
  private _collapsed = false;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>布局</h1>
      <p>布局组件用于快速搭建页面骨架，包含 Layout、Header、Sider、Content 与 Footer，可组合出上下、左右及嵌套结构。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/layout" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本结构',
        '最常用的上中下布局，Header 与 Footer 固定高度，Content 自动撑满剩余空间。',
        html`
          <semi-layout style="height: 220px; border: 1px solid var(--semi-color-border); border-radius: 6px; overflow: hidden;">
            <semi-layout-header>Header</semi-layout-header>
            <semi-layout-content>Content</semi-layout-content>
            <semi-layout-footer>Footer</semi-layout-footer>
          </semi-layout>
        `,
        `<semi-layout>
  <semi-layout-header>Header</semi-layout-header>
  <semi-layout-content>Content</semi-layout-content>
  <semi-layout-footer>Footer</semi-layout-footer>
</semi-layout>`
      )}

      ${section(
        '侧边栏布局',
        '在 Layout 中直接放置 semi-layout-sider，布局会自动切换为左右结构，Sider 默认带收起按钮。',
        html`
          <semi-layout style="height: 320px; border: 1px solid var(--semi-color-border); border-radius: 6px; overflow: hidden;">
            <semi-layout-sider width="200" collapsed-width="64">
              <div style="padding: 18px 20px 12px; font-size: 15px; font-weight: 600;">Semi Design</div>
              ${menuItem('工作台', true)} ${menuItem('组件')} ${menuItem('主题')} ${menuItem('设置')}
            </semi-layout-sider>
            <semi-layout>
              <semi-layout-header style="padding: 0 24px; height: 56px;">Header</semi-layout-header>
              <semi-layout-content>Content</semi-layout-content>
              <semi-layout-footer style="padding: 16px 24px;">Footer</semi-layout-footer>
            </semi-layout>
          </semi-layout>
        `,
        `<semi-layout>
  <semi-layout-sider width="200" collapsed-width="64">
    <div>菜单</div>
  </semi-layout-sider>
  <semi-layout>
    <semi-layout-header>Header</semi-layout-header>
    <semi-layout-content>Content</semi-layout-content>
    <semi-layout-footer>Footer</semi-layout-footer>
  </semi-layout>
</semi-layout>`
      )}

      ${section(
        '受控收起',
        'collapsed 可受控控制侧边栏宽度，配合 collapsed-width 与 trigger 使用。',
        html`
          <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
            <semi-button size="small" @click=${() => (this._collapsed = !this._collapsed)}>
              ${this._collapsed ? '展开侧边栏' : '收起侧边栏'}
            </semi-button>
            <semi-tag color="blue">${this._collapsed ? '64px' : '200px'}</semi-tag>
          </div>
          <semi-layout style="height: 260px; border: 1px solid var(--semi-color-border); border-radius: 6px; overflow: hidden;">
            <semi-layout-sider
              width="200"
              collapsed-width="64"
              .collapsed=${this._collapsed}
              .trigger=${false}
            >
              <div style="padding: 18px 20px; font-size: 15px; font-weight: 600;">
                ${this._collapsed ? 'S' : 'Semi Design'}
              </div>
              ${menuItem('工作台', true)} ${menuItem('组件')} ${menuItem('主题')}
            </semi-layout-sider>
            <semi-layout>
              <semi-layout-content style="padding: 24px;">受控侧边栏内容区</semi-layout-content>
            </semi-layout>
          </semi-layout>
        `,
        `<semi-layout-sider
  width="200"
  collapsed-width="64"
  .collapsed=\${collapsed}
  .trigger=\${false}
>
  …
</semi-layout-sider>`
      )}

      ${section(
        '响应式收起',
        'breakpoint 指定断点，屏幕宽度小于断点时侧边栏自动收起，并派发 collapse 事件。',
        html`
          <semi-layout style="height: 240px; border: 1px solid var(--semi-color-border); border-radius: 6px; overflow: hidden;">
            <semi-layout-sider width="180" collapsed-width="56" breakpoint="lg">
              <div style="padding: 16px 18px; font-size: 14px; font-weight: 600;">响应式侧边栏</div>
              ${menuItem('菜单一', true)} ${menuItem('菜单二')}
            </semi-layout-sider>
            <semi-layout>
              <semi-layout-content style="padding: 24px;">调整浏览器宽度至 1200px 以下可观察自动收起。</semi-layout-content>
            </semi-layout>
          </semi-layout>
        `,
        `<semi-layout-sider breakpoint="lg" width="180" collapsed-width="56">
  …
</semi-layout-sider>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'layout-docs': LayoutDocs;
  }
}
