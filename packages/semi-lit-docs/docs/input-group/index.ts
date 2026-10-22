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

@customElement('input-group-docs')
class InputGroupDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>输入框组</h1>
      <p>InputGroup 将多个输入框、按钮组合为一行，并处理相邻圆角。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/input" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '把输入框与按钮放入 InputGroup，形成组合输入。',
        html`
          <semi-input-group style="max-width: 480px;">
            <semi-input placeholder="请输入域名"></semi-input>
            <semi-button type="primary">搜索</semi-button>
          </semi-input-group>
        `,
        `<semi-input-group>
  <semi-input placeholder="请输入域名"></semi-input>
  <semi-button type="primary">搜索</semi-button>
</semi-input-group>`
      )}

      ${section(
        '尺寸',
        'InputGroup 的 size 会同步到内部输入框。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-input-group size="small" style="max-width: 480px;">
              <semi-input placeholder="Small"></semi-input>
              <semi-button>按钮</semi-button>
            </semi-input-group>
            <semi-input-group size="large" style="max-width: 480px;">
              <semi-input placeholder="Large"></semi-input>
              <semi-button>按钮</semi-button>
            </semi-input-group>
          </semi-space>
        `,
        `<semi-input-group size="large">
  <semi-input placeholder="Large"></semi-input>
  <semi-button>按钮</semi-button>
</semi-input-group>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-group-docs': InputGroupDocs
  }
}
