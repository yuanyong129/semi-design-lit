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

@customElement('skeleton-docs')
class SkeletonDocs extends LitElement {
  @state()
  private _loading = true;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>骨架屏</h1>
      <p>Skeleton 在内容加载前展示占位结构，支持头像、标题、段落与闪烁动画。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/skeleton" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'loading 为 true 时展示骨架屏，关闭后展示默认插槽内容。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-button @click=${() => (this._loading = !this._loading)}>
              ${this._loading ? '显示内容' : '显示骨架屏'}
            </semi-button>
            <semi-skeleton ?loading=${this._loading} avatar .rows=${3}>
              <div style="display: flex; gap: 16px;">
                <div style="width: 40px; height: 40px; background: var(--semi-color-fill-0); border-radius: 50%;"></div>
                <div>
                  <h3 style="margin: 0 0 8px;">Semi Design</h3>
                  <p style="margin: 0; color: var(--semi-color-text-2);">这是加载完成后的内容。</p>
                </div>
              </div>
            </semi-skeleton>
          </semi-space>
        `,
        `<semi-skeleton loading avatar rows="3">
  <div>加载完成后的内容</div>
</semi-skeleton>`
      )}

      ${section(
        '动画',
        '设置 active 后骨架块显示闪烁动画。',
        html`
          <semi-skeleton active avatar .rows=${4}></semi-skeleton>
        `,
        `<semi-skeleton active avatar rows="4"></semi-skeleton>`
      )}

      ${section(
        '自定义占位',
        '通过 placeholder 属性替换默认骨架结构。',
        html`
          <semi-skeleton loading .placeholder=${html`<div style="padding: 16px; background: var(--semi-color-fill-0);">自定义占位内容</div>`}></semi-skeleton>
        `,
        `<semi-skeleton loading .placeholder=\${html\`<div>加载中...</div>\`}></semi-skeleton>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'skeleton-docs': SkeletonDocs
  }
}
