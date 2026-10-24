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

@customElement('popconfirm-docs')
class PopconfirmDocs extends LitElement {
  @state()
  private _result = '';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>气泡确认框</h1>
      <p>Popconfirm 在点击时展示确认操作，支持确认、取消与异步确认。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/popconfirm" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '点击触发元素后展示确认框，ok / cancel 事件可用于后续操作。',
        html`
          <semi-popconfirm
            title="删除确认"
            content="确定要删除这条记录吗？"
            @ok=${() => (this._result = '已确认')}
            @cancel=${() => (this._result = '已取消')}
          >
            <semi-button type="danger">删除</semi-button>
          </semi-popconfirm>
          ${this._result ? html`<semi-tag color=${this._result === '已确认' ? 'red' : 'grey'} style="margin-left: 12px;">${this._result}</semi-tag>` : ''}
        `,
        `<semi-popconfirm title="删除确认" content="确定要删除这条记录吗？"
  @ok=\${onOk} @cancel=\${onCancel}>
  <semi-button type="danger">删除</semi-button>
</semi-popconfirm>`
      )}

      ${section(
        '自定义按钮',
        '通过 ok-text / cancel-text 自定义按钮文案。',
        html`
          <semi-popconfirm title="发布" content="发布后所有用户可见。" ok-text="发布" cancel-text="再想想">
            <semi-button type="primary">发布</semi-button>
          </semi-popconfirm>
        `,
        `<semi-popconfirm title="发布" content="发布后所有用户可见。" ok-text="发布" cancel-text="再想想">
  <semi-button type="primary">发布</semi-button>
</semi-popconfirm>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'popconfirm-docs': PopconfirmDocs
  }
}
