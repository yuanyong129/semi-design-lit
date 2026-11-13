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

const stageStyle =
  'position: relative; height: 150px; border: 1px dashed var(--semi-color-border); border-radius: 8px; background: var(--semi-color-fill-0);';
const buttonStyle = 'position: absolute; right: 24px; bottom: 24px;';

@customElement('float-button-docs')
class FloatButtonDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>悬浮按钮</h1>
      <p>悬浮按钮固定在页面右下角，支持圆形、方形、尺寸、彩色、徽标与链接。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/floatButton" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'shape 支持 round、square，size 支持 small、default、large，colorful 使用渐变背景。',
        html`
          <div style=${stageStyle}>
            <semi-float-button style=${buttonStyle}>
              <semi-icon-plus slot="icon"></semi-icon-plus>
            </semi-float-button>
            <semi-float-button style="position: absolute; right: 82px; bottom: 24px" shape="square">
              <semi-icon-edit slot="icon"></semi-icon-edit>
            </semi-float-button>
            <semi-float-button style="position: absolute; right: 24px; bottom: 82px" size="small">
              <semi-icon-star slot="icon"></semi-icon-star>
            </semi-float-button>
            <semi-float-button
              style="position: absolute; right: 82px; bottom: 82px"
              size="large"
              colorful
            >
              <semi-icon-heart-fill slot="icon"></semi-icon-heart-fill>
            </semi-float-button>
          </div>
        `,
        `<semi-float-button>
  <semi-icon-plus slot="icon"></semi-icon-plus>
</semi-float-button>
<semi-float-button shape="square" size="small"></semi-float-button>
<semi-float-button size="large" colorful></semi-float-button>`
      )}

      ${section(
        '徽标',
        'badge 传入徽标配置，支持 count、dot、overflow-count 与 type。',
        html`
          <div style=${stageStyle}>
            <semi-float-button style=${buttonStyle} .badge=${{ count: 5 }}>
              <semi-icon-plus slot="icon"></semi-icon-plus>
            </semi-float-button>
            <semi-float-button
              style="position: absolute; right: 86px; bottom: 24px"
              .badge=${{ dot: true }}
            >
              <semi-icon-edit slot="icon"></semi-icon-edit>
            </semi-float-button>
            <semi-float-button
              style="position: absolute; right: 24px; bottom: 86px"
              .badge=${{ count: 120, overflowCount: 99, type: 'primary' }}
            >
              <semi-icon-star slot="icon"></semi-icon-star>
            </semi-float-button>
          </div>
        `,
        `<semi-float-button .badge=\${{ count: 5 }}>
  <semi-icon-plus slot="icon"></semi-icon-plus>
</semi-float-button>
<semi-float-button .badge=\${{ dot: true }}></semi-float-button>
<semi-float-button .badge=\${{ count: 120, overflowCount: 99 }}></semi-float-button>`
      )}

      ${section(
        '链接与禁用',
        'href 让按钮具备链接能力，disabled 阻止点击与跳转。',
        html`
          <div style=${stageStyle}>
            <semi-float-button style=${buttonStyle} href="#float-button">
              <semi-icon-link slot="icon"></semi-icon-link>
            </semi-float-button>
            <semi-float-button
              style="position: absolute; right: 86px; bottom: 24px"
              disabled
            >
              <semi-icon-plus slot="icon"></semi-icon-plus>
            </semi-float-button>
          </div>
        `,
        `<semi-float-button href="#float-button">
  <semi-icon-link slot="icon"></semi-icon-link>
</semi-float-button>
<semi-float-button disabled>
  <semi-icon-plus slot="icon"></semi-icon-plus>
</semi-float-button>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'float-button-docs': FloatButtonDocs;
  }
}
