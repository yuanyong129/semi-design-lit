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

@customElement('dropdown-docs')
class DropdownDocs extends LitElement {
  @state()
  private _selected = '';

  protected createRenderRoot() {
    return this;
  }

  private get _options() {
    return [
      { label: '复制', value: 'copy' },
      { label: '编辑', value: 'edit' },
      { label: '删除', value: 'delete', disabled: true },
    ];
  }

  protected render() {
    return html`
      <h1>下拉菜单</h1>
      <p>Dropdown 在点击时展示菜单，选择后触发 select 事件并关闭。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/dropdown" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 options 定义菜单项，选择后触发 select。',
        html`
          <semi-dropdown .options=${this._options} @select=${(event: CustomEvent) => (this._selected = event.detail.value)}>
            <semi-button>更多操作</semi-button>
          </semi-dropdown>
          ${this._selected ? html`<semi-tag color="blue" style="margin-left: 12px;">${this._selected}</semi-tag>` : ''}
        `,
        `<semi-dropdown .options=\${options} @select=\${onSelect}>
  <semi-button>更多操作</semi-button>
</semi-dropdown>`
      )}

      ${section(
        '位置',
        'position 支持 top / bottom / left / right，align 控制对齐。',
        html`
          <semi-space>
            <semi-dropdown .options=${this._options} position="bottom" align="start">
              <semi-button>Bottom</semi-button>
            </semi-dropdown>
            <semi-dropdown .options=${this._options} position="top">
              <semi-button>Top</semi-button>
            </semi-dropdown>
          </semi-space>
        `,
        `<semi-dropdown .options=\${options} position="bottom" align="start">
  <semi-button>更多操作</semi-button>
</semi-dropdown>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dropdown-docs': DropdownDocs
  }
}
