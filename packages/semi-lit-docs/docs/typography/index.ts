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

@customElement('typography-docs')
class TypographyDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>排版</h1>
      <p>Typography 提供标题、文本与段落，支持语义色、字重、删除线、下划线与复制。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/typography" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '标题',
        '使用 heading 控制 h1 - h6，标题默认加粗并保持块级布局。',
        html`
          <semi-typography-title heading="1">Semi Design</semi-typography-title>
          <semi-typography-title heading="2">快速开始</semi-typography-title>
          <semi-typography-title heading="3">安装</semi-typography-title>
        `,
        `<semi-typography-title heading="1">Semi Design</semi-typography-title>`
      )}

      ${section(
        '文本',
        'type 控制语义色，strong / italic / underline / delete 组合文本样式。',
        html`
          <semi-space direction="vertical">
            <semi-typography-text>默认文本</semi-typography-text>
            <semi-typography-text type="secondary">次要文本</semi-typography-text>
            <semi-typography-text type="success" strong>成功文本</semi-typography-text>
            <semi-typography-text type="danger" delete>删除文本</semi-typography-text>
            <semi-typography-text underline>下划线文本</semi-typography-text>
            <semi-typography-text code>npm install</semi-typography-text>
          </semi-space>
        `,
        `<semi-typography-text type="secondary">次要文本</semi-typography-text>`
      )}

      ${section(
        '段落与复制',
        'Paragraph 用于正文；copyable 会显示复制按钮并触发 copy 事件。',
        html`
          <semi-typography-paragraph copyable>
            Semi Design 是由抖音前端团队和 UED 团队共同设计开发并维护的设计系统。
          </semi-typography-paragraph>
        `,
        `<semi-typography-paragraph copyable>
  Semi Design 是由抖音前端团队和 UED 团队共同设计开发并维护的设计系统。
</semi-typography-paragraph>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'typography-docs': TypographyDocs
  }
}
