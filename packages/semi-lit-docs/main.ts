import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Router } from '@lit-labs/router';

import litLogo from './assets/lit.svg';
import viteLogo from './assets/vite.svg';
import semiLogo from './assets/semi-logo.svg';
import '@web-lit/index';
import '@web-lit/icon/index';
import '@web-lit/components/style/index.css';
import './docs/index';
import { routers } from './router';

interface NavGroup {
  title: string;
  items: Array<{ key: string; label: string }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '通用',
    items: [
      { key: 'button', label: '按钮 Button' },
      { key: 'link', label: '链接 Link' },
    ],
  },
  {
    title: '布局',
    items: [
      { key: 'divider', label: '分割线 Divider' },
      { key: 'space', label: '间距 Space' },
    ],
  },
  {
    title: '数据展示',
    items: [
      { key: 'empty', label: '空状态 Empty' },
      { key: 'tag', label: '标签 Tag' },
    ],
  },
  {
    title: '数据输入',
    items: [
      { key: 'input', label: '输入框 Input' },
      { key: 'radio', label: '单选框 Radio' },
      { key: 'switch', label: '开关 Switch' },
    ],
  },
  {
    title: '其他',
    items: [{ key: 'scrollbar', label: '滚动条 Scrollbar' }],
  },
];

@customElement('semi-lit-docs')
export class SemiLitDocs extends LitElement {
  @state()
  private key: string = location.pathname.replace(/^\//, '') || 'button';

  @state()
  private theme: 'light' | 'dark' =
    new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';

  private _router = new Router(this, routers);

  private handleClick(type: string) {
    this.key = type;
    const path = `/${type}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    this._router.goto(path);
  }

  private handleThemeChange(ev: CustomEvent<{ checked: boolean }>) {
    this.theme = ev.detail.checked ? 'dark' : 'light';
  }

  firstUpdated(): void {
    const path = `/${this.key}`;
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path);
    }
    this._router.goto(path);
  }

  private renderNav() {
    return NAV_GROUPS.map((group) => html`
      <div class="nav-group-title">${group.title}</div>
      <semi-space direction="vertical" class="nav-group">
        ${group.items.map((item) => html`
          <semi-button
            block
            type="tertiary"
            theme=${this.key === item.key ? 'light' : 'borderless'}
            @click=${() => this.handleClick(item.key)}
          >${item.label}</semi-button>
        `)}
      </semi-space>
    `);
  }

  render() {
    return html`
      <semi-config-provider theme-mode=${this.theme}>
        <div class="container">
          <header class="header">
            <div class="brand">
              <a href="https://semi.design" target="_blank" title="Semi Design">
                <img src=${semiLogo} class="logo semi" alt="Semi Design" />
              </a>
              <a href="https://lit.dev" target="_blank" title="Lit">
                <img src=${litLogo} class="logo lit" alt="Lit" />
              </a>
              <a href="https://vite.dev" target="_blank" title="Vite">
                <img src=${viteLogo} class="logo vite" alt="Vite" />
              </a>
              <div class="titles">
                <h1>Semi Design Lit</h1>
                <span>Vite + Lit + Semi Design</span>
              </div>
            </div>
            <div class="actions">
              <semi-link href="https://semi.design/zh-CN/" target="_blank">Semi Design</semi-link>
              <semi-link href="https://github.com/DouyinFE/semi-design" target="_blank">GitHub</semi-link>
              <semi-switch
                size="small"
                .checked=${this.theme === 'dark'}
                @change=${this.handleThemeChange}
              ></semi-switch>
              <span class="theme-label">暗色模式</span>
            </div>
          </header>

          <div class="docs-pane">
            <aside class="docs-list">
              <semi-scrollbar style="height: 100%; overflow: auto;">
                <div class="nav" style=${styleMap({ display: 'flex', flexDirection: 'column' })}>
                  ${this.renderNav()}
                </div>
              </semi-scrollbar>
            </aside>
            <main class="docs-wrapper">
              <semi-scrollbar style="height: 100%; overflow: auto;">
                <div class="docs-main">${this._router.outlet()}</div>
              </semi-scrollbar>
            </main>
          </div>
        </div>
      </semi-config-provider>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-bg-0);
    }

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      height: 64px;
      padding: 0 24px;
      background-color: var(--semi-color-bg-1);
      border-bottom: 1px solid var(--semi-color-border);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .logo {
      display: block;
      width: 32px;
      height: 32px;
      padding: 4px;
      border-radius: 8px;
      transition: transform 0.2s ease;
    }

    .logo:hover {
      transform: translateY(-1px);
    }

    .logo.semi {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 10px;
    }

    .titles {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }

    .titles h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      color: var(--semi-color-text-0);
    }

    .titles span {
      font-size: 12px;
      line-height: 16px;
      color: var(--semi-color-text-2);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .theme-label {
      font-size: 14px;
      color: var(--semi-color-text-2);
    }

    .docs-pane {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .docs-list {
      box-sizing: border-box;
      width: 248px;
      padding: 12px;
      background-color: var(--semi-color-bg-1);
      border-right: 1px solid var(--semi-color-border);
      overflow: hidden;
    }

    .docs-list semi-scrollbar {
      display: block;
      height: 100%;
    }

    .nav {
      gap: 4px;
    }

    .nav-group {
      width: 100%;
      margin-bottom: 8px;
    }

    .nav-group semi-button {
      width: 100%;
    }

    .nav-group-title {
      margin: 8px 8px 4px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0.02em;
    }

    .docs-wrapper {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }

    .docs-wrapper semi-scrollbar {
      display: block;
      height: 100%;
    }

    .docs-main {
      box-sizing: border-box;
      max-width: 960px;
      min-height: 100%;
      margin: 0 auto;
      padding: 32px 40px 80px;
    }

    .docs-main h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 600;
      line-height: 44px;
      color: var(--semi-color-text-0);
    }

    .docs-main h2 {
      margin: 24px 0 8px;
      font-size: 22px;
      font-weight: 600;
      line-height: 32px;
      color: var(--semi-color-text-0);
    }

    .docs-main p {
      margin: 8px 0;
      color: var(--semi-color-text-2);
      font-size: 14px;
      line-height: 22px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-lit-docs': SemiLitDocs
  }
}
