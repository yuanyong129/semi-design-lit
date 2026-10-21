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

@customElement('input-docs')
class InputDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>输入框</h1>
      <p>输入框用于接收用户的文本输入，支持前后缀、清除、尺寸与不同状态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/input" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 placeholder 设置占位文案，输入时触发 change 事件。',
        html`<semi-input placeholder="请输入内容"></semi-input>`,
        `<semi-input placeholder="请输入内容"></semi-input>`
      )}

      ${section(
        '尺寸',
        '支持 large、default、small 三种尺寸。',
        html`
          <semi-space direction="vertical">
            <semi-input size="large" placeholder="Large"></semi-input>
            <semi-input placeholder="Default"></semi-input>
            <semi-input size="small" placeholder="Small"></semi-input>
          </semi-space>
        `,
        `<semi-input size="large" placeholder="Large"></semi-input>
<semi-input placeholder="Default"></semi-input>
<semi-input size="small" placeholder="Small"></semi-input>`
      )}

      ${section(
        '前后缀',
        '通过 slot="prefix" 与 slot="suffix" 添加前缀和后缀内容。',
        html`
          <semi-input placeholder="搜索内容">
            <semi-icon-star slot="prefix"></semi-icon-star>
            <span slot="suffix" style="font-size: 12px; color: var(--semi-color-text-2);">Semi</span>
          </semi-input>
        `,
        `<semi-input placeholder="搜索内容">
  <semi-icon-star slot="prefix"></semi-icon-star>
  <span slot="suffix">Semi</span>
</semi-input>`
      )}

      ${section(
        '可清除',
        '设置 show-clear 后，有内容时显示清除按钮。',
        html`
          <semi-input default-value="Semi Design" show-clear placeholder="请输入内容"></semi-input>
        `,
        `<semi-input default-value="Semi Design" show-clear></semi-input>`
      )}

      ${section(
        '前后置标签',
        '通过 addon-before 与 addon-after 添加标签（属性方式）。',
        html`
          <semi-input placeholder="https://semi.design" .addonBefore=${'https://'} .addonAfter=${'.com'}></semi-input>
        `,
        `<semi-input placeholder="https://semi.design"></semi-input>`
      )}

      ${section(
        '禁用与错误',
        '设置 disabled 禁用输入框，设置 error 展示错误状态。',
        html`
          <semi-space direction="vertical">
            <semi-input disabled value="禁用状态"></semi-input>
            <semi-input error value="错误状态"></semi-input>
            <semi-input readonly value="只读状态"></semi-input>
          </semi-space>
        `,
        `<semi-input disabled value="禁用状态"></semi-input>
<semi-input error value="错误状态"></semi-input>
<semi-input readonly value="只读状态"></semi-input>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-docs': InputDocs
  }
}
