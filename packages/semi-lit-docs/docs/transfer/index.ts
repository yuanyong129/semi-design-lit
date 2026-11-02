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

@customElement('transfer-docs')
class TransferDocs extends LitElement {
  @state()
  private _targetKeys: Array<string | number> = ['semi', 'arco'];

  private get _data() {
    return [
      { key: 'semi', label: 'Semi Design' },
      { key: 'arco', label: 'Arco Design' },
      { key: 'antd', label: 'Ant Design' },
      { key: 'chakra', label: 'Chakra UI' },
      { key: 'material', label: 'Material UI', disabled: true },
    ];
  }

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>穿梭框</h1>
      <p>Transfer 在两个列表之间移动数据，支持搜索、全选、禁用与受控。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/transfer" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '勾选左侧条目后点击右箭头移动到右侧，反向操作同理。',
        html`
          <semi-transfer
            .dataSource=${this._data}
            .defaultTargetKeys=${['semi', 'arco']}
            show-search
            @change=${(event: CustomEvent) => (this._targetKeys = event.detail.targetKeys)}
          ></semi-transfer>
          <semi-tag style="margin-top: 12px;">右侧：${this._targetKeys.length ? this._targetKeys.join('、') : '空'}</semi-tag>
        `,
        `<semi-transfer .dataSource=\${data}
  .defaultTargetKeys=\${['semi', 'arco']} show-search></semi-transfer>`
      )}

      ${section(
        '禁用与自定义标题',
        'titles 自定义左右标题，disabled 条目不可移动。',
        html`
          <semi-transfer
            .dataSource=${this._data}
            .defaultTargetKeys=${[]}
            .titles=${['可选组件', '已选组件']}
            show-search
          ></semi-transfer>
        `,
        `<semi-transfer .dataSource=\${data}
  .titles=\${['可选组件', '已选组件']}></semi-transfer>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'transfer-docs': TransferDocs
  }
}
