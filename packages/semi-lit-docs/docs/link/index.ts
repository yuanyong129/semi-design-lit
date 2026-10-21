import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
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

@customElement('link-docs')
class LinkDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>链接</h1>
      <p>链接用于页面跳转或触发操作，支持多种主题、下划线与图标。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/typography" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认主题为 primary，点击可跳转到 href。',
        html`
          <semi-space wrap>
            <semi-link href="https://semi.design" target="_blank">Semi Design</semi-link>
            <semi-link href="https://lit.dev" target="_blank">Lit</semi-link>
          </semi-space>
        `,
        `<semi-link href="https://semi.design" target="_blank">Semi Design</semi-link>`
      )}

      ${section(
        '链接主题',
        '支持 primary、secondary、tertiary、success、warning、danger 主题。',
        html`
          <semi-space wrap>
            <semi-link theme="primary">Primary</semi-link>
            <semi-link theme="secondary">Secondary</semi-link>
            <semi-link theme="tertiary">Tertiary</semi-link>
            <semi-link theme="success">Success</semi-link>
            <semi-link theme="warning">Warning</semi-link>
            <semi-link theme="danger">Danger</semi-link>
          </semi-space>
        `,
        `<semi-link theme="primary">Primary</semi-link>
<semi-link theme="secondary">Secondary</semi-link>
<semi-link theme="tertiary">Tertiary</semi-link>
<semi-link theme="success">Success</semi-link>
<semi-link theme="warning">Warning</semi-link>
<semi-link theme="danger">Danger</semi-link>`
      )}

      ${section(
        '下划线',
        '设置 underline 显示下划线。',
        html`
          <semi-space wrap>
            <semi-link underline>带下划线的链接</semi-link>
            <semi-link underline theme="danger">危险链接</semi-link>
          </semi-space>
        `,
        `<semi-link underline>带下划线的链接</semi-link>`
      )}

      ${section(
        '禁用状态',
        '设置 disabled 后链接不可点击。',
        html`
          <semi-space wrap>
            <semi-link disabled>禁用链接</semi-link>
            <semi-link disabled underline>禁用链接</semi-link>
          </semi-space>
        `,
        `<semi-link disabled>禁用链接</semi-link>`
      )}

      ${section(
        '带图标的链接',
        '通过 slot="icon" 添加图标。',
        html`
          <semi-space wrap>
            <semi-link>
              <semi-icon-link slot="icon"></semi-icon-link>链接图标
            </semi-link>
            <semi-link theme="danger">
              <semi-icon-delete slot="icon"></semi-icon-delete>删除
            </semi-link>
          </semi-space>
        `,
        `<semi-link>
  <semi-icon-link slot="icon"></semi-icon-link>链接图标
</semi-link>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-docs': LinkDocs
  }
}
