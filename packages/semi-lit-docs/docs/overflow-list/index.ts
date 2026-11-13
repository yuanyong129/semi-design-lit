import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { OverflowItem, OverflowListOverflowDetail } from '@semi-ui';
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

const stageStyle = 'width: 380px; max-width: 100%;';

const baseItems: OverflowItem[] = [
  { key: 'design', label: '设计' },
  { key: 'develop', label: '研发' },
  { key: 'product', label: '产品' },
  { key: 'operation', label: '运营' },
  { key: 'marketing', label: '市场' },
  { key: 'sales', label: '销售' },
  { key: 'support', label: '支持' },
  { key: 'finance', label: '财务' },
  { key: 'legal', label: '法务' },
  { key: 'admin', label: '行政' },
];

const colors = ['#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#eab308'];

@customElement('overflow-list-docs')
class OverflowListDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _hidden = 0;

  @state()
  private _startHidden = 0;

  @state()
  private _minHidden = 0;

  private _onOverflow(event: CustomEvent<OverflowListOverflowDetail>) {
    this._hidden = event.detail.items.length;
  }

  private _onStartOverflow(event: CustomEvent<OverflowListOverflowDetail>) {
    this._startHidden = event.detail.items.length;
  }

  private _onMinOverflow(event: CustomEvent<OverflowListOverflowDetail>) {
    this._minHidden = event.detail.items.length;
  }

  private _tag(item: OverflowItem) {
    return html`<semi-tag size="small">${String(item.label)}</semi-tag>`;
  }

  protected render() {
    return html`
      <h1>溢出列表</h1>
      <p>溢出列表在单行空间不足时收起多余内容，并通过自定义的溢出节点展示被隐藏的项。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/overflowList" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认从末尾收起；overflowRenderer 会收到被隐藏的项，可渲染为 +N 或下拉入口。',
        html`
          <div style=${stageStyle}>
            <semi-overflow-list
              .items=${baseItems}
              .visibleItemRenderer=${(item: OverflowItem) => this._tag(item)}
              .overflowRenderer=${(items: OverflowItem[]) => html`<semi-tag size="small">+${items.length}</semi-tag>`}
              @overflow=${this._onOverflow}
            ></semi-overflow-list>
          </div>
          <p style="color: var(--semi-color-text-2)">已收起 ${this._hidden} 项</p>
        `,
        `<semi-overflow-list
  .items=\${items}
  .visibleItemRenderer=\${(item) => html\`<semi-tag>\${item.label}</semi-tag>\`}
  .overflowRenderer=\${(items) => html\`<semi-tag>+\${items.length}</semi-tag>\`}
></semi-overflow-list>`
      )}

      ${section(
        '从开头收起',
        'collapseFrom="start" 会保留右侧的项，把左侧放不下的内容折叠到开始位置。',
        html`
          <div style=${stageStyle}>
            <semi-overflow-list
              collapse-from="start"
              .items=${baseItems}
              .visibleItemRenderer=${(item: OverflowItem) => this._tag(item)}
              .overflowRenderer=${(items: OverflowItem[]) => html`<semi-tag size="small">+${items.length}</semi-tag>`}
              @overflow=${this._onStartOverflow}
            ></semi-overflow-list>
          </div>
          <p style="color: var(--semi-color-text-2)">左侧收起 ${this._startHidden} 项</p>
        `,
        `<semi-overflow-list collapse-from="start" .items=\${items}></semi-overflow-list>`
      )}

      ${section(
        '最小可见项',
        'minVisibleItems 保证至少展示指定数量的项，即使空间不足也不会继续收起。',
        html`
          <div style="width: 260px; max-width: 100%">
            <semi-overflow-list
              min-visible-items="3"
              .items=${baseItems}
              .visibleItemRenderer=${(item: OverflowItem) => this._tag(item)}
              .overflowRenderer=${(items: OverflowItem[]) => html`<semi-tag size="small">+${items.length}</semi-tag>`}
              @overflow=${this._onMinOverflow}
            ></semi-overflow-list>
          </div>
          <p style="color: var(--semi-color-text-2)">当前收起 ${this._minHidden} 项</p>
        `,
        `<semi-overflow-list min-visible-items="3" .items=\${items}></semi-overflow-list>`
      )}

      ${section(
        '自定义渲染',
        'visibleItemRenderer 与 overflowRenderer 都可以返回任意模板，方便渲染头像、颜色点或操作按钮。',
        html`
          <div style=${stageStyle}>
            <semi-overflow-list
              .items=${baseItems}
              .visibleItemRenderer=${(item: OverflowItem, index: number) => html`
                <span
                  style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border: 1px solid var(--semi-color-border); border-radius: 999px; font-size: 13px;"
                >
                  <span
                    style="width: 8px; height: 8px; border-radius: 50%; background: ${colors[index % colors.length]};"
                  ></span>
                  ${String(item.label)}
                </span>
              `}
              .overflowRenderer=${(items: OverflowItem[]) => html`
                <semi-button size="small" type="tertiary">还有 ${items.length} 项</semi-button>
              `}
            ></semi-overflow-list>
          </div>
        `,
        `<semi-overflow-list
  .visibleItemRenderer=\${(item) => html\`<span>\${item.label}</span>\`}
  .overflowRenderer=\${(items) => html\`<semi-button>还有 \${items.length} 项</semi-button>\`}
></semi-overflow-list>`
      )}

      ${section(
        '滚动模式',
        'renderMode="scroll" 不折叠内容，而是把列表变成可横向滚动的容器。',
        html`
          <div style=${stageStyle}>
            <semi-overflow-list
              render-mode="scroll"
              .items=${baseItems}
              .visibleItemRenderer=${(item: OverflowItem) => this._tag(item)}
            ></semi-overflow-list>
          </div>
        `,
        `<semi-overflow-list render-mode="scroll" .items=\${items}></semi-overflow-list>`
      )}
    `;
  }
}
