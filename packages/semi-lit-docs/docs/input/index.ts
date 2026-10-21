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
        '设置 show-clear 后，有内容且输入框悬浮或聚焦时显示清除按钮。',
        html`
          <semi-input default-value="Semi Design" show-clear placeholder="请输入内容"></semi-input>
        `,
        `<semi-input default-value="Semi Design" show-clear></semi-input>`
      )}

      ${section(
        '密码模式',
        '设置 mode="password" 显示密码显隐按钮，配合 eye 图标切换输入框类型。',
        html`
          <semi-input mode="password" default-value="Semi@123" placeholder="请输入密码"></semi-input>
        `,
        `<semi-input mode="password" default-value="Semi@123"></semi-input>`
      )}

      ${section(
        '前后置标签',
        '通过 addon-before 与 addon-after 添加标签（属性方式）。',
        html`
          <semi-input placeholder="semi.design" .addonBefore=${'https://'} .addonAfter=${'.com'}></semi-input>
        `,
        `<semi-input placeholder="semi.design"></semi-input>`
      )}

      ${section(
        '校验状态与禁用',
        'validate-status 支持 default、warning、error、success；disabled 与 readonly 禁用交互。',
        html`
          <semi-space direction="vertical">
            <semi-input validate-status="warning" default-value="警告状态"></semi-input>
            <semi-input validate-status="error" default-value="错误状态"></semi-input>
            <semi-input validate-status="success" default-value="成功状态"></semi-input>
            <semi-input disabled value="禁用状态"></semi-input>
            <semi-input readonly value="只读状态"></semi-input>
          </semi-space>
        `,
        `<semi-input validate-status="warning" default-value="警告状态"></semi-input>
<semi-input validate-status="error" default-value="错误状态"></semi-input>
<semi-input validate-status="success" default-value="成功状态"></semi-input>
<semi-input disabled value="禁用状态"></semi-input>
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
