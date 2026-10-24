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

@customElement('popover-docs')
class PopoverDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>气泡卡片</h1>
      <p>Popover 在点击触发元素时显示带标题的卡片内容，底层使用 Trigger + Popup。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/popover" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '设置 title 与 content，点击触发元素打开卡片。',
        html`
          <semi-popover title="Semi Design" content="Semi Design 是由抖音前端团队和 UED 团队共同设计开发并维护的设计系统。">
            <semi-button type="primary">点击查看</semi-button>
          </semi-popover>
        `,
        `<semi-popover title="Semi Design" content="Semi Design 是...">
  <semi-button type="primary">点击查看</semi-button>
</semi-popover>`
      )}

      ${section(
        '位置',
        'position 支持 top / bottom / left / right，align 控制对齐。',
        html`
          <semi-space>
            <semi-popover title="Top" content="上方弹出" position="top">
              <semi-button>Top</semi-button>
            </semi-popover>
            <semi-popover title="Right" content="右侧弹出" position="right" align="start">
              <semi-button>Right</semi-button>
            </semi-popover>
            <semi-popover title="Left" content="左侧弹出" position="left">
              <semi-button>Left</semi-button>
            </semi-popover>
          </semi-space>
        `,
        `<semi-popover title="Top" content="上方弹出" position="top">
  <semi-button>Top</semi-button>
</semi-popover>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'popover-docs': PopoverDocs
  }
}
