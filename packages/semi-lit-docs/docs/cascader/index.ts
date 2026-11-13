import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CascaderData, CascaderValueType } from '@semi-ui';
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

const provinceTree: CascaderData[] = [
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

@customElement('cascader-docs')
class CascaderDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value: CascaderValueType = ['zhejiang', 'hangzhou', 'xihu'];

  @state()
  private _selected: CascaderValueType = [
    ['zhejiang', 'hangzhou', 'xihu'],
    ['jiangsu', 'nanjing', 'xuanwu'],
  ];

  @state()
  private _searchValue: CascaderValueType = ['jiangsu', 'suzhou', 'gusu'];

  @state()
  private _customValue: CascaderValueType = ['design', 'visual'];

  @state()
  private _asyncTree: CascaderData[] = [
    { value: 'east', label: '华东区域' },
    { value: 'south', label: '华南区域' },
  ];

  private _loadData = async (options: CascaderData[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const target = options[options.length - 1];
    if (!target || target.children) return;
    target.children = [
      { value: `${target.value}-a`, label: '城市 A' },
      { value: `${target.value}-b`, label: '城市 B' },
    ];
    this._asyncTree = [...this._asyncTree];
  };

  protected render() {
    return html`
      <h1>级联选择</h1>
      <p>级联选择用于从一组有层级关系的数据中选择，支持单选、多选、搜索与异步加载。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/cascader" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'tree-data 提供层级数据，value 为从根到叶子的路径数组，点击叶子节点完成选择。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-cascader
              .treeData=${provinceTree}
              .value=${this._value}
              placeholder="请选择地区"
              @change=${(event: CustomEvent<{ value: CascaderValueType }>) => (this._value = event.detail.value)}
            ></semi-cascader>
            <span style="color:var(--semi-color-text-2)">${Array.isArray(this._value) ? this._value.join(' / ') : this._value}</span>
          </div>
        `,
        `<semi-cascader .treeData=\${treeData} .value=\${['zhejiang', 'hangzhou', 'xihu']}></semi-cascader>`
      )}

      ${section(
        '多选与标签',
        'multiple 开启多选，value 为多个路径组成的数组；max-tag-count 折叠多余标签，show-clear 显示清空按钮。',
        html`
          <div style="display:flex;flex-direction:column;gap:12px">
            <semi-cascader
              multiple
              show-clear
              .maxTagCount=${2}
              .treeData=${provinceTree}
              .value=${this._selected}
              placeholder="请选择地区"
              @change=${(event: CustomEvent<{ value: CascaderValueType }>) => (this._selected = event.detail.value)}
            ></semi-cascader>
            <span style="color:var(--semi-color-text-2)">已选 ${Array.isArray(this._selected) ? this._selected.length : 0} 项</span>
          </div>
        `,
        `<semi-cascader multiple show-clear .treeData=\${treeData} .value=\${selectedPaths}></semi-cascader>`
      )}

      ${section(
        '搜索',
        'filter-tree-node 开启搜索，输入时会匹配完整路径并高亮命中文本，默认只展示叶子节点。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-cascader
              .filterTreeNode=${true}
              .treeData=${provinceTree}
              .value=${this._searchValue}
              placeholder="搜索地区"
              @change=${(event: CustomEvent<{ value: CascaderValueType }>) => (this._searchValue = event.detail.value)}
            ></semi-cascader>
            <span style="color:var(--semi-color-text-2)">支持输入省 / 市 / 区名称</span>
          </div>
        `,
        `<semi-cascader filter-tree-node .treeData=\${treeData} placeholder="搜索地区"></semi-cascader>`
      )}

      ${section(
        '异步加载',
        'load-data 在展开未加载的节点时触发，回调参数为从根到当前节点的数据路径，返回 Promise 后更新 tree-data。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-cascader
              .treeData=${this._asyncTree}
              .loadData=${this._loadData}
              placeholder="点击展开加载城市"
            ></semi-cascader>
            <span style="color:var(--semi-color-text-2)">点击“华东区域”或“华南区域”加载子节点</span>
          </div>
        `,
        `<semi-cascader .treeData=\${treeData} .loadData=\${loadData}></semi-cascader>`
      )}

      ${section(
        '自定义字段',
        'key-maps 将 value、label、children 映射到自定义字段，适合直接使用业务数据。',
        html`
          <semi-cascader
            .treeData=${customTree}
            .keyMaps=${{ value: 'id', label: 'name', children: 'kids' }}
            .value=${this._customValue}
            @change=${(event: CustomEvent<{ value: CascaderValueType }>) => (this._customValue = event.detail.value)}
          ></semi-cascader>
        `,
        `<semi-cascader .treeData=\${treeData} .keyMaps=\${{ value: 'id', label: 'name', children: 'kids' }}></semi-cascader>`
      )}

      ${section(
        '状态与尺寸',
        '通过 size、validate-status、borderless 与 disabled 调整级联选择器的外观和交互状态。',
        html`
          <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
            <semi-cascader size="small" .treeData=${provinceTree} placeholder="小尺寸"></semi-cascader>
            <semi-cascader size="large" .treeData=${provinceTree} placeholder="大尺寸"></semi-cascader>
            <semi-cascader validate-status="error" .treeData=${provinceTree} placeholder="错误状态"></semi-cascader>
            <semi-cascader borderless .treeData=${provinceTree} placeholder="无边框"></semi-cascader>
            <semi-cascader disabled .treeData=${provinceTree} .value=${['zhejiang', 'hangzhou', 'xihu']}></semi-cascader>
          </div>
        `,
        `<semi-cascader size="small" validate-status="error" borderless disabled></semi-cascader>`
      )}
    `;
  }
}
