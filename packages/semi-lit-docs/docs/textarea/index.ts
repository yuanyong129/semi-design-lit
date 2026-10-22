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

@customElement('textarea-docs')
class TextAreaDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>文本域</h1>
      <p>TextArea 用于多行文本输入，支持尺寸、禁用、只读、字数统计与自适应高度。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/textarea" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '设置 rows 控制初始行数，placeholder 显示占位文字。',
        html`
          <semi-textarea placeholder="请输入内容" .rows=${4}></semi-textarea>
        `,
        `<semi-textarea placeholder="请输入内容" rows="4"></semi-textarea>`
      )}

      ${section(
        '字数统计',
        '设置 show-count 与 maxLength 展示字数与上限。',
        html`
          <semi-textarea placeholder="最多输入 100 字" .maxLength=${100} show-count .rows=${4}></semi-textarea>
        `,
        `<semi-textarea maxlength="100" show-count rows="4"></semi-textarea>`
      )}

      ${section(
        '自适应高度',
        '设置 autosize 后高度随内容自动增长。',
        html`
          <semi-textarea autosize .rows=${2} default-value="Semi Design 是一套设计系统。"></semi-textarea>
        `,
        `<semi-textarea autosize rows="2"></semi-textarea>`
      )}

      ${section(
        '禁用与只读',
        'disabled 禁用交互，readonly 只读但可复制。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-textarea disabled default-value="禁用状态"></semi-textarea>
            <semi-textarea readonly default-value="只读状态"></semi-textarea>
          </semi-space>
        `,
        `<semi-textarea disabled></semi-textarea>
<semi-textarea readonly></semi-textarea>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'textarea-docs': TextAreaDocs
  }
}
