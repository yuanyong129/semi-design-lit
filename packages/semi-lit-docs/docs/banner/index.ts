import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
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

@customElement('banner-docs')
class BannerDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>横幅提示</h1>
      <p>Banner 在页面顶部展示持续性提示，支持类型、标题、描述、操作与关闭。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/banner" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '类型',
        'type 支持 info / success / warning / danger。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-banner type="info" title="信息提示" description="这是一条信息提示。"></semi-banner>
            <semi-banner type="success" title="操作成功" description="配置已保存。"></semi-banner>
            <semi-banner type="warning" title="空间不足" description="存储空间即将用尽。"></semi-banner>
            <semi-banner type="danger" title="部署失败" description="请查看构建日志。"></semi-banner>
          </semi-space>
        `,
        `<semi-banner type="info" title="信息提示" description="这是一条信息提示。"></semi-banner>
<semi-banner type="success" title="操作成功" description="配置已保存。"></semi-banner>`
      )}

      ${section(
        '可关闭与操作',
        '设置 closable 显示关闭按钮，通过 action 插槽放置操作。',
        html`
          <semi-banner type="warning" title="版本更新" description="新版本已可用。" closable>
            <semi-button slot="action" size="small">查看详情</semi-button>
          </semi-banner>
        `,
        `<semi-banner type="warning" title="版本更新" description="新版本已可用。" closable>
  <semi-button slot="action" size="small">查看详情</semi-button>
</semi-banner>`
      )}

      ${section(
        '通栏',
        '设置 full-mode 后移除左右圆角与边框。',
        html`
          <semi-banner type="info" title="通栏提示" description="适用于页面级公告。" full-mode></semi-banner>
        `,
        `<semi-banner type="info" title="通栏提示" description="适用于页面级公告。" full-mode></semi-banner>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'banner-docs': BannerDocs
  }
}
