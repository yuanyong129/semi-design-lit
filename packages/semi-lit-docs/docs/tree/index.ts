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

@customElement('tree-docs')
class TreeDocs extends LitElement {
  @state()
  private _selected: Array<string | number> = [];

  private get _treeData() {
    return [
      {
        key: 'design',
        label: '设计系统',
        children: [
          { key: 'semi', label: 'Semi Design' },
          { key: 'arco', label: 'Arco Design' },
        ],
      },
      {
        key: 'components',
        label: '组件',
        children: [
          {
            key: 'input',
            label: '输入类',
            children: [
              { key: 'button', label: 'Button 按钮' },
              { key: 'select', label: 'Select 选择器' },
            ],
          },
          { key: 'table', label: 'Table 表格' },
        ],
      },
      { key: 'changelog', label: '更新日志' },
    ];
  }

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>树形控件</h1>
      <p>Tree 以树形结构展示层级数据，支持展开、收起与单选 / 多选。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/tree" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '点击箭头展开或收起，点击节点名称选中。',
        html`
          <semi-tree .treeData=${this._treeData} default-expand-all style="max-width: 320px;"></semi-tree>
        `,
        `<semi-tree .treeData=\${treeData} default-expand-all></semi-tree>`
      )}

      ${section(
        '多选与连接线',
        'multiple 开启多选，show-line 展示层级连接线。',
        html`
          <semi-tree
            multiple
            show-line
            .treeData=${this._treeData}
            .defaultExpandedKeys=${['design', 'components']}
            @select=${(event: CustomEvent) => (this._selected = event.detail.selectedKeys)}
            style="max-width: 320px;"
          ></semi-tree>
          <semi-tag style="margin-top: 12px;">已选：${this._selected.length ? this._selected.join('、') : '无'}</semi-tag>
        `,
        `<semi-tree multiple show-line .treeData=\${treeData}
  .defaultExpandedKeys=\${['design', 'components']}></semi-tree>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tree-docs': TreeDocs
  }
}
