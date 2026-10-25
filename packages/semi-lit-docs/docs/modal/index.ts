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

@customElement('modal-docs')
class ModalDocs extends LitElement {
  @state()
  private _visible = false;

  @state()
  private _sizeVisible = false;

  @state()
  private _result = '';

  protected createRenderRoot() {
    return this;
  }

  private _handleOpenChange(event: CustomEvent<{ visible: boolean }>) {
    this._visible = event.detail.visible;
  }

  private _handleSizeOpenChange(event: CustomEvent<{ visible: boolean }>) {
    this._sizeVisible = event.detail.visible;
  }

  protected render() {
    return html`
      <h1>对话框</h1>
      <p>Modal 提供遮罩、焦点管理、Esc 关闭与底部操作区，内容通过默认插槽传入。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/modal" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 visible 控制显示，openChange 同步关闭状态。',
        html`
          <semi-space>
            <semi-button type="primary" @click=${() => (this._visible = true)}>打开对话框</semi-button>
            ${this._result ? html`<semi-tag color=${this._result === '已确认' ? 'green' : 'grey'}>${this._result}</semi-tag>` : ''}
          </semi-space>
          <semi-modal
            title="对话框标题"
            .visible=${this._visible}
            @openChange=${this._handleOpenChange}
            @ok=${() => (this._result = '已确认')}
            @cancel=${() => (this._result = '已取消')}
          >
            <p>这是对话框的正文内容，支持任意 Lit 模板。</p>
            <p>点击遮罩、按 Esc 或点击关闭按钮都可以关闭。</p>
          </semi-modal>
        `,
        `<semi-modal title="对话框标题" .visible=\${visible}
  @openChange=\${onOpenChange}>
  <p>这是对话框的正文内容。</p>
</semi-modal>`
      )}

      ${section(
        '尺寸',
        'size 支持 small / default / medium / large / full-width。',
        html`
          <semi-space>
            <semi-button @click=${() => (this._sizeVisible = true)}>打开默认尺寸</semi-button>
          </semi-space>
          <semi-modal title="默认尺寸" size="default" .visible=${this._sizeVisible} @openChange=${this._handleSizeOpenChange}>
            默认宽度为 520px，适合大多数场景。
          </semi-modal>
        `,
        `<semi-modal title="默认尺寸" size="default" .visible=\${visible}>
  默认宽度为 520px。
</semi-modal>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'modal-docs': ModalDocs
  }
}
