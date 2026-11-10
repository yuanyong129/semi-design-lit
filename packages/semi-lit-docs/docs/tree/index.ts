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

  @state()
  private _checked: Array<string | number> = ['semi'];

  @state()
  private _dropInfo = '';

  @state()
  private _dragData: any[] = [
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
        { key: 'button', label: 'Button 按钮' },
        { key: 'select', label: 'Select 选择器' },
      ],
    },
    { key: 'changelog', label: '更新日志' },
  ];

  private _asyncData = [
    { key: 'async-design', label: '设计系统' },
    { key: 'async-components', label: '组件' },
    { key: 'async-changelog', label: '更新日志', isLeaf: true },
  ];

  private _loadData = async (node: any) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    node.children =
      node.key === 'async-design'
        ? [
            { key: 'async-semi', label: 'Semi Design', isLeaf: true },
            { key: 'async-arco', label: 'Arco Design', isLeaf: true },
          ]
        : [
            { key: 'async-button', label: 'Button 按钮', isLeaf: true },
            { key: 'async-table', label: 'Table 表格', isLeaf: true },
          ];
  };

  private _removeNode(nodes: any[], key: string | number): any | undefined {
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.key === key) return nodes.splice(index, 1)[0];
      if (node.children?.length) {
        const found = this._removeNode(node.children, key);
        if (found) return found;
      }
    }
    return undefined;
  }

  private _findParentList(nodes: any[], key: string | number): any[] | undefined {
    for (const node of nodes) {
      if (node.key === key) return nodes;
      if (node.children?.length) {
        const found = this._findParentList(node.children, key);
        if (found) return found;
      }
    }
    return undefined;
  }

  private _onDrop = (event: CustomEvent) => {
    const { dragNode, dropNode, dropPosition } = event.detail;
    const moved = this._removeNode(this._dragData, dragNode.key);
    if (!moved) return;

    if (dropPosition === 'inside') {
      dropNode.children = dropNode.children ?? [];
      dropNode.children.push(moved);
    } else {
      const list = this._findParentList(this._dragData, dropNode.key);
      if (!list) return;
      const index = list.findIndex((node) => node.key === dropNode.key);
      list.splice(dropPosition === 'before' ? index : index + 1, 0, moved);
    }

    this._dragData = [...this._dragData];
    this._dropInfo = `${dragNode.label} → ${dropNode.label}（${
      dropPosition === 'inside' ? '内部' : dropPosition === 'before' ? '之前' : '之后'
    }）`;
  };

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
      <p>Tree 以树形结构展示层级数据，支持展开、收起、复选框、拖拽排序与异步加载。</p>
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

      ${section(
        '复选框',
        'checkable 开启复选框，父子节点选中状态联动。',
        html`
          <semi-tree
            checkable
            default-expand-all
            .treeData=${this._treeData}
            .defaultCheckedKeys=${['semi']}
            @check=${(event: CustomEvent) => (this._checked = event.detail.checkedKeys)}
            style="max-width: 320px;"
          ></semi-tree>
          <semi-tag style="margin-top: 12px;">已勾选：${this._checked.length ? this._checked.join('、') : '无'}</semi-tag>
        `,
        `<semi-tree checkable .treeData=\${treeData}
  .defaultCheckedKeys=\${['semi']}></semi-tree>`
      )}

      ${section(
        '拖拽排序',
        'draggable 开启拖拽，drop 事件提供拖拽节点、目标节点与放置位置。',
        html`
          <semi-tree
            draggable
            default-expand-all
            .treeData=${this._dragData}
            @drop=${this._onDrop}
            style="max-width: 360px;"
          ></semi-tree>
          <semi-tag style="margin-top: 12px;">${this._dropInfo || '拖动节点到目标位置'}</semi-tag>
        `,
        `<semi-tree draggable .treeData=\${treeData}
  @drop=\${onDrop}></semi-tree>`
      )}

      ${section(
        '异步加载',
        'loadData 返回 Promise，展开节点时异步加载子节点并展示 loading。',
        html`
          <semi-tree
            .treeData=${this._asyncData}
            .loadData=${this._loadData}
            style="max-width: 320px;"
          ></semi-tree>
        `,
        `<semi-tree .treeData=\${treeData} .loadData=\${loadData}></semi-tree>`
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
