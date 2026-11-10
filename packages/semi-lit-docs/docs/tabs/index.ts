import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

@customElement('tabs-docs')
class TabsDocs extends LitElement {
  @state()
  private _closed = '';

  private get _closableTabs() {
    return [
      { key: 'design', label: '设计', content: html`<p style="margin: 0;">设计系统内容。</p>` },
      { key: 'develop', label: '开发', content: html`<p style="margin: 0;">开发指南内容。</p>` },
      { key: 'deploy', label: '部署', content: html`<p style="margin: 0;">部署说明内容。</p>` },
    ];
  }

  private get _tabs() {
    return [
      { key: 'design', label: '设计', content: html`<p style="margin: 0;">设计系统是组件库的基础，统一颜色、字体与间距。</p>` },
      { key: 'develop', label: '开发', content: html`<p style="margin: 0;">使用 Web Components 构建可复用的界面组件。</p>` },
      { key: 'disabled', label: '禁用', content: '不可见内容', disabled: true },
    ];
  }

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>标签页</h1>
      <p>Tabs 在同一区域切换不同内容，支持线性、按钮、卡片三种样式。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/tabs" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '线性标签',
        '默认使用 line 类型，active-key 可受控。',
        html`
          <semi-tabs .tabs=${this._tabs}></semi-tabs>
        `,
        `<semi-tabs .tabs=\${tabs}></semi-tabs>`
      )}

      ${section(
        '按钮与卡片',
        'type 切换 button / card 样式，size 控制尺寸。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-tabs type="button" .tabs=${this._tabs}></semi-tabs>
            <semi-tabs type="card" .tabs=${this._tabs} size="small"></semi-tabs>
          </semi-space>
        `,
        `<semi-tabs type="button" .tabs=\${tabs}></semi-tabs>
<semi-tabs type="card" size="small" .tabs=\${tabs}></semi-tabs>`
      )}

      ${section(
        '可关闭',
        'closable 开启关闭按钮，关闭后切换到相邻标签。',
        html`
          <semi-tabs
            closable
            .tabs=${this._closableTabs}
            @close=${(event: CustomEvent) => (this._closed = event.detail.key)}
          ></semi-tabs>
          <semi-tag style="margin-top: 12px;">最近关闭：${this._closed || '无'}</semi-tag>
        `,
        `<semi-tabs closable .tabs=\${tabs}
  @close=\${onClose}></semi-tabs>`
      )}

      ${section(
        '标签位置',
        'tab-position 支持 top / bottom / left / right。',
        html`
          <semi-tabs tab-position="left" .tabs=${this._closableTabs}></semi-tabs>
        `,
        `<semi-tabs tab-position="left" .tabs=\${tabs}></semi-tabs>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tabs-docs': TabsDocs
  }
}
