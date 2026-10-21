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

@customElement('divider-docs')
class DividerDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>分割线</h1>
      <p>分割线用于将内容分隔为多个区域，支持水平、垂直、带文字与不同线型。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/divider" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认渲染一条水平分割线。',
        html`
          <div>
            <p>上方内容</p>
            <semi-divider></semi-divider>
            <p>下方内容</p>
          </div>
        `,
        `<p>上方内容</p>
<semi-divider></semi-divider>
<p>下方内容</p>`
      )}

      ${section(
        '垂直分割线',
        '设置 layout="vertical" 渲染垂直分割线，常用于行内内容之间。',
        html`
          <div>
            <span>文本</span>
            <semi-divider layout="vertical"></semi-divider>
            <semi-link>链接</semi-link>
            <semi-divider layout="vertical"></semi-divider>
            <semi-tag color="blue">标签</semi-tag>
          </div>
        `,
        `<span>文本</span>
<semi-divider layout="vertical"></semi-divider>
<semi-link>链接</semi-link>
<semi-divider layout="vertical"></semi-divider>
<semi-tag color="blue">标签</semi-tag>`
      )}

      ${section(
        '带文字的分割线',
        '通过默认插槽添加文字，orientation 控制文字位置：left、center、right。',
        html`
          <div>
            <semi-divider orientation="left">左侧文字</semi-divider>
            <semi-divider>居中文案</semi-divider>
            <semi-divider orientation="right">右侧文字</semi-divider>
          </div>
        `,
        `<semi-divider orientation="left">左侧文字</semi-divider>
<semi-divider>居中文案</semi-divider>
<semi-divider orientation="right">右侧文字</semi-divider>`
      )}

      ${section(
        '线型与间距',
        'type 支持 solid、dashed、dotted；margin 控制分割线上下间距。',
        html`
          <div>
            <semi-divider type="dashed"></semi-divider>
            <semi-divider type="dotted"></semi-divider>
            <semi-divider margin="24px">自定义间距</semi-divider>
          </div>
        `,
        `<semi-divider type="dashed"></semi-divider>
<semi-divider type="dotted"></semi-divider>
<semi-divider margin="24px">自定义间距</semi-divider>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'divider-docs': DividerDocs
  }
}
