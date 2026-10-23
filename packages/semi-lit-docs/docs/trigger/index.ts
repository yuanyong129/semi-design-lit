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

@customElement('trigger-docs')
class TriggerDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>触发器</h1>
      <p>Trigger 负责管理浮层的触发方式、显示状态、位置计算与关闭行为。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/other/trigger" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '点击触发',
        'trigger="click" 点击触发元素打开浮层；点击外部或按 Esc 关闭。',
        html`
          <semi-trigger
            trigger="click"
            position="bottom"
            .content=${html`<div style="max-width: 220px;">这是一个通过 Trigger 渲染的浮层内容。</div>`}
          >
            <semi-button type="primary">点击触发</semi-button>
          </semi-trigger>
        `,
        `<semi-trigger trigger="click" position="bottom" .content=\${content}>
  <semi-button type="primary">点击触发</semi-button>
</semi-trigger>`
      )}

      ${section(
        '悬浮触发',
        'trigger="hover" 悬浮打开，离开触发元素与浮层后关闭。',
        html`
          <semi-trigger trigger="hover" position="top" .content=${'悬浮显示的内容'}>
            <semi-button>悬浮触发</semi-button>
          </semi-trigger>
        `,
        `<semi-trigger trigger="hover" position="top" content="悬浮显示的内容">
  <semi-button>悬浮触发</semi-button>
</semi-trigger>`
      )}

      ${section(
        '位置与对齐',
        'position 支持 top / bottom / left / right，align 支持 start / center / end。',
        html`
          <semi-space>
            <semi-trigger trigger="click" position="top" align="start" .content=${'top start'}>
              <semi-button>上</semi-button>
            </semi-trigger>
            <semi-trigger trigger="click" position="right" .content=${'right center'}>
              <semi-button>右</semi-button>
            </semi-trigger>
            <semi-trigger trigger="click" position="left" .content=${'left center'}>
              <semi-button>左</semi-button>
            </semi-trigger>
          </semi-space>
        `,
        `<semi-trigger trigger="click" position="top" align="start" content="top start">
  <semi-button>上</semi-button>
</semi-trigger>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'trigger-docs': TriggerDocs
  }
}
