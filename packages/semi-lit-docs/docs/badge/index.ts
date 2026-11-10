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

@customElement('badge-docs')
class BadgeDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>徽标</h1>
      <p>徽标用于展示数量、状态或提示信息，通常附着在头像、图标或文字旁边。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/badge" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 count 设置展示数字，子元素作为徽标载体。',
        html`
          <semi-space align="center" .spacing=${'large'} wrap>
            <semi-badge count="5">
              <semi-avatar>S</semi-avatar>
            </semi-badge>
            <semi-badge count="12">
              <semi-avatar color="#2f9e44">A</semi-avatar>
            </semi-badge>
            <semi-badge count="99">
              <semi-avatar color="#e8590c">B</semi-avatar>
            </semi-badge>
          </semi-space>
        `,
        `<semi-badge count="5">
  <semi-avatar>S</semi-avatar>
</semi-badge>`
      )}

      ${section(
        '小红点',
        '设置 dot 展示无数字的小红点。',
        html`
          <semi-space align="center" .spacing=${'large'} wrap>
            <semi-badge dot>
              <semi-avatar shape="square">S</semi-avatar>
            </semi-badge>
            <semi-badge dot type="primary">
              <semi-avatar shape="square">A</semi-avatar>
            </semi-badge>
            <semi-badge dot>
              <semi-tag color="blue">新消息</semi-tag>
            </semi-badge>
          </semi-space>
        `,
        `<semi-badge dot>
  <semi-avatar>S</semi-avatar>
</semi-badge>`
      )}

      ${section(
        '封顶数字与零值',
        'overflow-count 设置最大显示数字，show-zero 控制 count=0 时是否展示。',
        html`
          <semi-space align="center" .spacing=${'large'} wrap>
            <semi-badge count="120" overflow-count="99">
              <semi-avatar>S</semi-avatar>
            </semi-badge>
            <semi-badge count="120" overflow-count="9">
              <semi-avatar color="#7048e8">A</semi-avatar>
            </semi-badge>
            <semi-badge count="0">
              <semi-avatar color="#0b7285">B</semi-avatar>
            </semi-badge>
            <semi-badge count="0" show-zero>
              <semi-avatar color="#0b7285">B</semi-avatar>
            </semi-badge>
          </semi-space>
        `,
        `<semi-badge count="120" overflow-count="99">
  <semi-avatar>S</semi-avatar>
</semi-badge>
<semi-badge count="0" show-zero>
  <semi-avatar>B</semi-avatar>
</semi-badge>`
      )}

      ${section(
        '颜色',
        'type 控制数字徽标的背景色。',
        html`
          <semi-space align="center" .spacing=${'large'} wrap>
            <semi-badge count="5" type="primary">
              <semi-avatar>S</semi-avatar>
            </semi-badge>
            <semi-badge count="5" type="success">
              <semi-avatar>S</semi-avatar>
            </semi-badge>
            <semi-badge count="5" type="warning">
              <semi-avatar>S</semi-avatar>
            </semi-badge>
            <semi-badge count="5" type="danger">
              <semi-avatar>S</semi-avatar>
            </semi-badge>
          </semi-space>
        `,
        `<semi-badge count="5" type="success">
  <semi-avatar>S</semi-avatar>
</semi-badge>`
      )}

      ${section(
        '状态点',
        'status 与 text 组合为独立状态标识，不依赖子元素。',
        html`
          <semi-space direction="vertical" align="start" .spacing=${16}>
            <semi-badge status="success" text="运行成功"></semi-badge>
            <semi-badge status="info" text="进行中"></semi-badge>
            <semi-badge status="warning" text="需要注意"></semi-badge>
            <semi-badge status="danger" text="运行失败"></semi-badge>
          </semi-space>
        `,
        `<semi-badge status="success" text="运行成功"></semi-badge>
<semi-badge status="danger" text="运行失败"></semi-badge>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'badge-docs': BadgeDocs;
  }
}
