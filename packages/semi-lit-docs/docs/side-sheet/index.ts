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

@customElement('side-sheet-docs')
class SideSheetDocs extends LitElement {
  @state()
  private _visible = false;

  @state()
  private _placement: 'left' | 'right' = 'right';

  protected createRenderRoot() {
    return this;
  }

  private _handleOpenChange(event: CustomEvent<{ visible: boolean }>) {
    this._visible = event.detail.visible;
  }

  protected render() {
    return html`
      <h1>侧边面板</h1>
      <p>SideSheet 从页面左侧或右侧滑出，适合承载较长表单或详情内容。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/sidesheet" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 placement 控制左侧或右侧弹出，width 控制宽度。',
        html`
          <semi-space>
            <semi-button type="primary" @click=${() => { this._placement = 'right'; this._visible = true; }}>右侧打开</semi-button>
            <semi-button @click=${() => { this._placement = 'left'; this._visible = true; }}>左侧打开</semi-button>
          </semi-space>
          <semi-side-sheet
            title="侧边面板"
            .placement=${this._placement}
            .visible=${this._visible}
            @openChange=${this._handleOpenChange}
          >
            <p>这里是侧边面板的内容，可以放置表单、详情或设置项。</p>
            <semi-form layout="vertical">
              <semi-form-item field="name" label="名称">
                <semi-input placeholder="请输入名称"></semi-input>
              </semi-form-item>
              <semi-form-item field="description" label="描述">
                <semi-textarea placeholder="请输入描述" .rows=${3}></semi-textarea>
              </semi-form-item>
            </semi-form>
          </semi-side-sheet>
        `,
        `<semi-side-sheet title="侧边面板" placement="right" .visible=\${visible}
  @openChange=\${onOpenChange}>
  <p>侧边面板内容</p>
</semi-side-sheet>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'side-sheet-docs': SideSheetDocs
  }
}
