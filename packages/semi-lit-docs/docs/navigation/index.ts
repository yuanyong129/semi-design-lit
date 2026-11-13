import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type {
  NavClickDetail,
  NavCollapseChangeDetail,
  NavItem,
  NavItemKey,
  NavOpenChangeDetail,
  NavSelectDetail,
} from '@semi-ui';
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

const navItems: NavItem[] = [
  { itemKey: 'home', text: '工作台', icon: html`<semi-icon-star></semi-icon-star>` },
  {
    itemKey: 'projects',
    text: '项目',
    icon: html`<semi-icon-edit></semi-icon-edit>`,
    items: [
      { itemKey: 'all-projects', text: '全部项目' },
      { itemKey: 'recent', text: '最近访问' },
      { itemKey: 'archived', text: '已归档' },
    ],
  },
  {
    itemKey: 'reports',
    text: '数据报表',
    icon: html`<semi-icon-code></semi-icon-code>`,
    items: [
      { itemKey: 'overview', text: '概览' },
      { itemKey: 'analysis', text: '分析' },
    ],
  },
  { itemKey: 'settings', text: '设置', icon: html`<semi-icon-info-circle></semi-icon-info-circle>` },
];

const eventItems: NavItem[] = [
  { itemKey: 'event-home', text: '概览' },
  {
    itemKey: 'event-data',
    text: '数据',
    items: [
      { itemKey: 'event-report', text: '报表' },
      { itemKey: 'event-detail', text: '明细' },
    ],
  },
  { itemKey: 'event-disabled', text: '禁用项', disabled: true },
];

const stageStyle =
  'display:flex; gap:20px; align-items:stretch; padding:16px; border:1px solid var(--semi-color-border); border-radius:8px; background:var(--semi-color-bg-2);';
const navBoxStyle =
  'height:360px; width:240px; flex:none; border:1px solid var(--semi-color-border); border-radius:8px; overflow:hidden;';
const navHorizontalStyle =
  'width:100%; border:1px solid var(--semi-color-border); border-radius:8px; overflow:hidden;';

@customElement('navigation-docs')
class NavigationDocs extends LitElement {
  @state()
  private _selected: NavItemKey[] = ['all-projects'];

  @state()
  private _open: NavItemKey[] = ['projects'];

  @state()
  private _collapsed = false;

  @state()
  private _eventText = '尚未触发事件';

  protected createRenderRoot() {
    return this;
  }

  private _onSelect(event: CustomEvent<NavSelectDetail>) {
    this._selected = event.detail.selectedKeys;
    this._eventText = `select：${event.detail.itemKey}`;
  }

  private _onOpenChange(event: CustomEvent<NavOpenChangeDetail>) {
    this._open = event.detail.openKeys;
    this._eventText = `open-change：${event.detail.itemKey} → ${event.detail.isOpen ? '展开' : '收起'}`;
  }

  private _onClick(event: CustomEvent<NavClickDetail>) {
    this._eventText = `click：${event.detail.itemKey}`;
  }

  private _onCollapseChange(event: CustomEvent<NavCollapseChangeDetail>) {
    this._collapsed = event.detail.isCollapsed;
    this._eventText = `collapse-change：${event.detail.isCollapsed ? '收起' : '展开'}`;
  }

  private _onEventSelect(event: CustomEvent<NavSelectDetail>) {
    this._eventText = `select：${event.detail.itemKey}，selectedKeys=${JSON.stringify(event.detail.selectedKeys)}`;
  }

  protected render() {
    return html`
      <style>
        .navigation-demo-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .navigation-demo-value {
          margin: 12px 0 0;
          font-size: 13px;
          color: var(--semi-color-text-2);
        }
      </style>
      <h1>导航</h1>
      <p>导航菜单用于组织页面层级，支持垂直/水平模式、子菜单、折叠态和受控选中。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/navigation" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'items 描述菜单结构，selected-keys 控制选中项；点击叶子节点触发 select。',
        html`
          <div style=${stageStyle}>
            <div style=${navBoxStyle}>
              <semi-navigation
                .items=${navItems}
                .defaultSelectedKeys=${['home']}
                .defaultOpenKeys=${['projects']}
              ></semi-navigation>
            </div>
          </div>
        `,
        `<semi-navigation
  .items=\${items}
  .defaultSelectedKeys=\${['home']}
  .defaultOpenKeys=\${['projects']}
></semi-navigation>`,
      )}
      ${section(
        '子菜单与选中',
        '嵌套菜单选中时会同时标记父级；multiple 开启后可以多选。',
        html`
          <div style=${stageStyle}>
            <div style=${navBoxStyle}>
              <semi-navigation
                .items=${navItems}
                .selectedKeys=${this._selected}
                .openKeys=${this._open}
                multiple
                @select=${(event: CustomEvent<NavSelectDetail>) => this._onSelect(event)}
                @open-change=${(event: CustomEvent<NavOpenChangeDetail>) => this._onOpenChange(event)}
              ></semi-navigation>
            </div>
            <div style="flex:1; min-width:0">
              <p class="navigation-demo-value">selectedKeys：${JSON.stringify(this._selected)}</p>
              <p class="navigation-demo-value">openKeys：${JSON.stringify(this._open)}</p>
              <p class="navigation-demo-value">${this._eventText}</p>
            </div>
          </div>
        `,
        `<semi-navigation
  .items=\${items}
  .selectedKeys=\${selected}
  .openKeys=\${open}
  multiple
  @select=\${handleSelect}
  @open-change=\${handleOpenChange}
></semi-navigation>`,
      )}
      ${section(
        '折叠导航',
        'is-collapsed 控制折叠；折叠后子菜单通过浮层展开，header/footer 同步收起。',
        html`
          <div style=${stageStyle}>
            <div style="height:380px; width:${this._collapsed ? '64px' : '240px'}; flex:none; transition:width .2s ease">
              <semi-navigation
                .items=${navItems}
                .isCollapsed=${this._collapsed}
                .header=${{
                  logo: html`<semi-icon-star></semi-icon-star>`,
                  text: 'Semi Design',
                }}
                .footer=${{ collapseButton: true }}
                .defaultSelectedKeys=${['home']}
                @collapse-change=${(event: CustomEvent<NavCollapseChangeDetail>) =>
                  this._onCollapseChange(event)}
              ></semi-navigation>
            </div>
            <div style="flex:1">
              <semi-button type="primary" theme="solid" @click=${() => (this._collapsed = !this._collapsed)}>
                ${this._collapsed ? '展开导航' : '收起导航'}
              </semi-button>
              <p class="navigation-demo-value">${this._eventText}</p>
            </div>
          </div>
        `,
        `<semi-navigation
  .items=\${items}
  .isCollapsed=\${collapsed}
  .header=\${{ logo, text: 'Semi Design' }}
  .footer=\${{ collapseButton: true }}
  @collapse-change=\${handleCollapseChange}
></semi-navigation>`,
      )}
      ${section(
        '水平导航',
        'mode="horizontal" 将菜单横向排列，子菜单通过下拉浮层展示。',
        html`
          <div style=${navHorizontalStyle}>
            <semi-navigation
              mode="horizontal"
              .items=${navItems.slice(0, 2)}
              .defaultSelectedKeys=${['home']}
              .header=${{ logo: html`<semi-icon-star></semi-icon-star>`, text: 'Semi' }}
            ></semi-navigation>
          </div>
        `,
        `<semi-navigation
  mode="horizontal"
  .items=\${items}
  .defaultSelectedKeys=\${['home']}
  .header=\${{ logo, text: 'Semi' }}
></semi-navigation>`,
      )}
      ${section(
        '事件',
        'select、open-change、click 与 collapse-change 均携带原始 DOM 事件和当前状态。',
        html`
          <div style=${stageStyle}>
            <div style=${navBoxStyle}>
              <semi-navigation
                .items=${eventItems}
                .defaultSelectedKeys=${['event-home']}
                .defaultOpenKeys=${['event-data']}
                @select=${(event: CustomEvent<NavSelectDetail>) => this._onEventSelect(event)}
                @open-change=${(event: CustomEvent<NavOpenChangeDetail>) => this._onOpenChange(event)}
                @click=${(event: CustomEvent<NavClickDetail>) => this._onClick(event)}
              ></semi-navigation>
            </div>
            <div style="flex:1">
              <p class="navigation-demo-value">${this._eventText}</p>
              <p class="navigation-demo-value">点击叶子节点或父级菜单查看事件内容。</p>
            </div>
          </div>
        `,
        `<semi-navigation
  .items=\${items}
  @select=\${handleSelect}
  @open-change=\${handleOpenChange}
  @click=\${handleClick}
></semi-navigation>`,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-docs': NavigationDocs;
  }
}

