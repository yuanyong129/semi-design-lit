import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { TreeSelectData, TreeSelectValue } from '@semi-ui';
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

const treeData: TreeSelectData[] = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' },
          { value: 'yuhang', label: '余杭' },
          { value: 'binjiang', label: '滨江' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波',
        children: [
          { value: 'haishu', label: '海曙' },
          { value: 'yinzhou', label: '鄞州' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          { value: 'xuanwu', label: '玄武' },
          { value: 'jianye', label: '建邺' },
        ],
      },
      {
        value: 'suzhou',
        label: '苏州',
        children: [
          { value: 'gusu', label: '姑苏' },
          { value: 'wuzhong', label: '吴中' },
        ],
      },
    ],
  },
];

const customTree = [
  {
    id: 'design',
    name: '设计',
    kids: [
      { id: 'visual', name: '视觉设计' },
      { id: 'interaction', name: '交互设计' },
    ],
  },
  {
    id: 'engineering',
    name: '研发',
    kids: [
      { id: 'frontend', name: '前端' },
      { id: 'backend', name: '后端' },
    ],
  },
];

@customElement('tree-select-docs')
class TreeSelectDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value: TreeSelectValue = 'xihu';

  @state()
  private _multiValue: TreeSelectValue[] = ['xihu', 'gusu'];

  @state()
  private _searchValue: TreeSelectValue = 'xihu';

  @state()
  private _searchText = '';

  @state()
  private _customValue: TreeSelectValue = 'visual';

  @state()
  private _asyncTree: TreeSelectData[] = [
    { value: 'east', label: '华东区域' },
    { value: 'south', label: '华南区域' },
  ];

  @state()
  private _asyncValue?: TreeSelectValue;

  @state()
  private _loadCount = 0;

  private _loadData = async (data: TreeSelectData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (data.children?.length) return;
    data.children = [
      { value: `${data.value}-a`, label: '城市 A' },
      { value: `${data.value}-b`, label: '城市 B' },
    ];
    this._asyncTree = [...this._asyncTree];
    this._loadCount += 1;
  };

  render() {
    return html`
      <h1>TreeSelect 树选择器</h1>
      <p>树选择器用于在层级数据中选择一个或多个节点，支持搜索、勾选、异步加载与自定义字段。</p>
      <p><a href="https://semi.design/zh-CN/input/treeSelect" target="_blank" rel="noreferrer">查看 Semi Design 官方文档</a></p>

      ${section(
        '基本用法',
        '通过 tree-data 提供层级数据，value 为选中节点的值，点击叶子节点完成选择。',
        html`<div style="max-width: 320px;">
          <semi-tree-select
            .treeData=${treeData}
            .value=${this._value}
            placeholder="请选择地区"
            .defaultExpandedKeys=${['zhejiang', 'hangzhou', 'jiangsu']}
            @change=${(event: CustomEvent<{ value: TreeSelectValue }>) => {
              this._value = event.detail.value;
            }}
          ></semi-tree-select>
          <p style="margin: 8px 0 0; color: var(--semi-color-text-2);">
            当前值：${this._value || '空'}
          </p>
        </div>`,
        `<semi-tree-select
  .treeData=\${treeData}
  .value=\${value}
  placeholder="请选择地区"
  @change=\${handleChange}
></semi-tree-select>`
      )}

      ${section(
        '多选与勾选',
        'multiple 开启多选并显示复选框；max-tag-count 折叠多余标签，show-clear 显示清空按钮。',
        html`<div style="max-width: 360px;">
          <semi-tree-select
            multiple
            show-clear
            .treeData=${treeData}
            .value=${this._multiValue}
            .maxTagCount=${2}
            .defaultExpandedKeys=${['zhejiang', 'hangzhou']}
            @change=${(event: CustomEvent<{ value: TreeSelectValue[] }>) => {
              this._multiValue = event.detail.value;
            }}
          ></semi-tree-select>
          <p style="margin: 8px 0 0; color: var(--semi-color-text-2);">
            已选 ${this._multiValue.length} 项
          </p>
        </div>`,
        `<semi-tree-select
  multiple
  show-clear
  .treeData=\${treeData}
  .value=\${value}
  .maxTagCount=\${2}
  @change=\${handleChange}
></semi-tree-select>`
      )}

      ${section(
        '搜索',
        'filter-tree-node 开启搜索；输入时会过滤树节点，并通过 search 事件返回关键词。',
        html`<div style="max-width: 320px;">
          <semi-tree-select
            filter-tree-node
            .treeData=${treeData}
            .value=${this._searchValue}
            search-placeholder="搜索地区"
            @search=${(event: CustomEvent<{ value: string }>) => {
              this._searchText = event.detail.value;
            }}
            @change=${(event: CustomEvent<{ value: TreeSelectValue }>) => {
              this._searchValue = event.detail.value;
            }}
          ></semi-tree-select>
          <p style="margin: 8px 0 0; color: var(--semi-color-text-2);">
            搜索关键词：${this._searchText || '（空）'}
          </p>
        </div>`,
        `<semi-tree-select
  filter-tree-node
  .treeData=\${treeData}
  .value=\${value}
  search-placeholder="搜索地区"
  @search=\${handleSearch}
  @change=\${handleChange}
></semi-tree-select>`
      )}

      ${section(
        '异步加载',
        'load-data 在展开未加载的节点时调用，回调参数为当前节点的数据；返回 Promise 后更新 tree-data。',
        html`<div style="max-width: 320px;">
          <semi-tree-select
            .treeData=${this._asyncTree}
            .value=${this._asyncValue}
            placeholder="点击区域加载城市"
            .loadData=${this._loadData}
            @change=${(event: CustomEvent<{ value: TreeSelectValue }>) => {
              this._asyncValue = event.detail.value;
            }}
          ></semi-tree-select>
          <p style="margin: 8px 0 0; color: var(--semi-color-text-2);">
            已加载节点：${this._loadCount}
          </p>
        </div>`,
        `<semi-tree-select
  .treeData=\${treeData}
  .value=\${value}
  .loadData=\${loadData}
  @change=\${handleChange}
></semi-tree-select>`
      )}

      ${section(
        '自定义字段',
        'key-maps 将 value、label、children 映射到业务数据的字段名。',
        html`<div style="max-width: 320px;">
          <semi-tree-select
            .treeData=${customTree as unknown as TreeSelectData[]}
            .value=${this._customValue}
            .keyMaps=${{ value: 'id', label: 'name', children: 'kids' }}
            .defaultExpandedKeys=${['design']}
            @change=${(event: CustomEvent<{ value: TreeSelectValue }>) => {
              this._customValue = event.detail.value;
            }}
          ></semi-tree-select>
        </div>`,
        `<semi-tree-select
  .treeData=\${treeData}
  .value=\${value}
  .keyMaps=\${{ value: 'id', label: 'name', children: 'kids' }}
  @change=\${handleChange}
></semi-tree-select>`
      )}

      ${section(
        '尺寸与状态',
        '通过 size、validate-status、borderless 与 disabled 调整外观和交互状态。',
        html`<div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
          <semi-tree-select size="small" .treeData=${treeData} placeholder="小尺寸"></semi-tree-select>
          <semi-tree-select size="large" .treeData=${treeData} placeholder="大尺寸"></semi-tree-select>
          <semi-tree-select validate-status="error" .treeData=${treeData} placeholder="错误状态"></semi-tree-select>
          <semi-tree-select borderless .treeData=${treeData} placeholder="无边框"></semi-tree-select>
          <semi-tree-select disabled .treeData=${treeData} .value=${'xihu'}></semi-tree-select>
        </div>`,
        `<semi-tree-select size="small" .treeData=\${treeData}></semi-tree-select>
<semi-tree-select size="large" .treeData=\${treeData}></semi-tree-select>
<semi-tree-select validate-status="error" .treeData=\${treeData}></semi-tree-select>
<semi-tree-select borderless .treeData=\${treeData}></semi-tree-select>
<semi-tree-select disabled .treeData=\${treeData}></semi-tree-select>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tree-select-docs': TreeSelectDocs;
  }
}
