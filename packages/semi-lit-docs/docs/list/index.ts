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

@customElement('list-docs')
class ListDocs extends LitElement {
  @state()
  private _loading = true;

  protected createRenderRoot() {
    return this;
  }

  private _toggleLoading = (): void => {
    this._loading = !this._loading;
  };

  protected render() {
    return html`
      <h1>列表</h1>
      <p>列表用于展示一组结构化的连续内容，支持头像、标题、描述、附加信息与操作区。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/list" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '组合 semi-list-item 展示头像、标题、描述和操作。',
        html`
          <semi-list header="项目动态" footer="共 3 条记录">
            <semi-list-item title="设计系统周会" description="同步本周组件进展与下周计划。" extra="2 天前">
              <semi-avatar slot="avatar" size="small" color="#2f9e44">周</semi-avatar>
              <semi-link slot="actions" href="#">查看详情</semi-link>
            </semi-list-item>
            <semi-list-item title="组件验收完成" description="Table 与 Tree 的新能力已通过验收。" extra="昨天">
              <semi-avatar slot="avatar" size="small" color="#1677ff">验</semi-avatar>
              <semi-link slot="actions" href="#">查看详情</semi-link>
            </semi-list-item>
            <semi-list-item title="文档站更新" description="新增 Breadcrumb、Steps 与 Collapse 文档。" extra="刚刚">
              <semi-avatar slot="avatar" size="small" color="#f59f00">文</semi-avatar>
              <semi-link slot="actions" href="#">查看详情</semi-link>
            </semi-list-item>
          </semi-list>
        `,
        `<semi-list header="项目动态" footer="共 3 条记录">
  <semi-list-item title="设计系统周会" description="…" extra="2 天前">
    <semi-avatar slot="avatar" size="small">周</semi-avatar>
    <semi-link slot="actions" href="#">查看详情</semi-link>
  </semi-list-item>
</semi-list>`
      )}

      ${section(
        '带边框',
        'bordered 为列表增加外边框，split 控制条目之间的分割线。',
        html`
          <semi-list bordered header="待办事项">
            <semi-list-item title="完善 List 文档" description="补充基本用法与加载状态示例。" extra="今天">
              <semi-tag slot="extra" color="blue">进行中</semi-tag>
            </semi-list-item>
            <semi-list-item title="检查 E2E 用例" description="覆盖列表空状态与加载状态。" extra="明天">
              <semi-tag slot="extra" color="orange">待开始</semi-tag>
            </semi-list-item>
          </semi-list>
        `,
        `<semi-list bordered header="待办事项">
  <semi-list-item title="完善 List 文档" description="…" extra="今天">
    <semi-tag slot="extra" color="blue">进行中</semi-tag>
  </semi-list-item>
</semi-list>`
      )}

      ${section(
        '加载状态',
        'loading 为 true 时展示骨架屏占位。',
        html`
          <semi-list .loading=${this._loading} header="加载示例">
            <semi-list-item title="内容加载中" description="加载完成后展示真实数据。"></semi-list-item>
          </semi-list>
          <div style="margin-top: 12px;">
            <semi-button size="small" @click=${this._toggleLoading}>切换加载</semi-button>
          </div>
        `,
        `<semi-list loading header="加载示例">
  <semi-list-item title="内容加载中" description="…"></semi-list-item>
</semi-list>`
      )}

      ${section(
        '空状态',
        '没有子项时展示内置空状态。',
        html`<semi-list empty-text="暂无待办事项"></semi-list>`,
        `<semi-list empty-text="暂无待办事项"></semi-list>`
      )}

      ${section(
        '紧凑尺寸',
        'size="small" 减小间距，适合信息密度较高的场景。',
        html`
          <semi-list size="small" bordered>
            <semi-list-item title="构建产物" description="dist/semi-ui.js" extra="1.2 MB"></semi-list-item>
            <semi-list-item title="文档产物" description="dist/docs" extra="860 KB"></semi-list-item>
            <semi-list-item title="图标产物" description="dist/icons" extra="120 KB"></semi-list-item>
          </semi-list>
        `,
        `<semi-list size="small" bordered>
  <semi-list-item title="构建产物" description="dist/semi-ui.js" extra="1.2 MB"></semi-list-item>
</semi-list>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'list-docs': ListDocs;
  }
}
