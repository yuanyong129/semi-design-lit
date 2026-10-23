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

@customElement('tooltip-docs')
class TooltipDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>文字提示</h1>
      <p>Tooltip 在悬浮或聚焦时显示简短说明，底层使用 Trigger + Popup。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/tooltip" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '设置 content 后，悬浮触发元素显示提示。',
        html`
          <semi-tooltip content="这是一段提示文字">
            <semi-button>悬浮查看</semi-button>
          </semi-tooltip>
        `,
        `<semi-tooltip content="这是一段提示文字">
  <semi-button>悬浮查看</semi-button>
</semi-tooltip>`
      )}

      ${section(
        '位置',
        'position 支持 top / bottom / left / right。',
        html`
          <semi-space>
            <semi-tooltip content="Top" position="top"><semi-button>Top</semi-button></semi-tooltip>
            <semi-tooltip content="Bottom" position="bottom"><semi-button>Bottom</semi-button></semi-tooltip>
            <semi-tooltip content="Left" position="left"><semi-button>Left</semi-button></semi-tooltip>
            <semi-tooltip content="Right" position="right"><semi-button>Right</semi-button></semi-tooltip>
          </semi-space>
        `,
        `<semi-tooltip content="Top" position="top">
  <semi-button>Top</semi-button>
</semi-tooltip>`
      )}

      ${section(
        '无箭头',
        '通过 show-arrow="false" 隐藏箭头。',
        html`
          <semi-tooltip content="没有箭头" .showArrow=${false}>
            <semi-button>无箭头</semi-button>
          </semi-tooltip>
        `,
        `<semi-tooltip content="没有箭头" .showArrow=\${false}>
  <semi-button>无箭头</semi-button>
</semi-tooltip>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tooltip-docs': TooltipDocs
  }
}
