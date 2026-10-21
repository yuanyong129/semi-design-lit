import { LitElement, css, html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';

import semiLogo from './assets/semi-logo.svg';
import '@semi-ui';
import '@semi-icons';
import '../semi-theme-default/index.css';
import './docs/index';
import { routers } from './router';

interface NavItem {
  key?: string;
  label: string;
  en: string;
  href?: string;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '开始',
    items: [
      { label: 'Introduction 介绍', en: 'Introduction', href: 'https://semi.design/zh-CN/start/introduction', icon: 'intro' },
      { label: 'Getting Started 快速开始', en: 'Getting Started', href: 'https://semi.design/zh-CN/start/getting-started', icon: 'intro' },
      { label: 'Overview 组件总览', en: 'Overview', href: 'https://semi.design/zh-CN/start/overview', icon: 'tokens' },
    ],
  },
  {
    title: '基础',
    items: [
      { key: 'button', label: 'Button 按钮', en: 'Button', icon: 'button' },
      { key: 'divider', label: 'Divider 分割线', en: 'Divider', icon: 'divider' },
      { key: 'link', label: 'Link 链接', en: 'Link', icon: 'link' },
      { key: 'space', label: 'Space 间距', en: 'Space', icon: 'space' },
      { label: 'Tokens 设计变量', en: 'Tokens', href: 'https://semi.design/zh-CN/basic/tokens', icon: 'tokens' },
    ],
  },
  {
    title: '输入类',
    items: [
      { key: 'input', label: 'Input 输入框', en: 'Input', icon: 'input' },
      { key: 'radio', label: 'Radio 单选框', en: 'Radio', icon: 'radio' },
      { key: 'switch', label: 'Switch 开关', en: 'Switch', icon: 'switch' },
    ],
  },
  {
    title: '展示',
    items: [
      { key: 'empty', label: 'Empty 空状态', en: 'Empty', icon: 'empty' },
      { key: 'tag', label: 'Tag 标签', en: 'Tag', icon: 'tag' },
    ],
  },
  {
    title: '其他',
    items: [
      { key: 'scrollbar', label: 'Scrollbar 滚动条', en: 'Scrollbar', icon: 'scrollbar' },
    ],
  },
];

const TOP_NAV = [
  { label: '组件', href: 'https://semi.design/zh-CN/start/overview' },
  { label: '主题', href: 'https://semi.design/zh-CN/advanced/customize-theme' },
  { label: '设计转代码', href: 'https://semi.design/zh-CN/advanced/design-to-code' },
  { label: '模板', href: 'https://semi.design' },
  { label: '数据可视化', href: 'https://semi.design', badge: 'NEW' },
  { label: '博客', href: 'https://semi.design' },
];

const NAV_ICON: Record<string, TemplateResult> = {
  button: html`<semi-icon-star></semi-icon-star>`,
  divider: html`<semi-icon-more></semi-icon-more>`,
  link: html`<semi-icon-link></semi-icon-link>`,
  space: html`<semi-icon-more></semi-icon-more>`,
  input: html`<semi-icon-edit></semi-icon-edit>`,
  radio: html`<semi-icon-check-circle-fill></semi-icon-check-circle-fill>`,
  switch: html`<semi-icon-check></semi-icon-check>`,
  empty: html`<semi-icon-empty></semi-icon-empty>`,
  tag: html`<semi-icon-heart-fill></semi-icon-heart-fill>`,
  scrollbar: html`<semi-icon-code></semi-icon-code>`,
  tokens: html`<semi-icon-star-fill></semi-icon-star-fill>`,
  intro: html`<semi-icon-empty></semi-icon-empty>`,
};

const PATH_BY_KEY: Record<string, string> = {
  button: '/basic/button',
  divider: '/basic/divider',
  link: '/basic/link',
  space: '/basic/space',
  input: '/input/input',
  radio: '/input/radio',
  switch: '/input/switch',
  empty: '/show/empty',
  tag: '/show/tag',
  scrollbar: '/other/scrollbar',
};

const KEY_BY_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_BY_KEY).map(([key, path]) => [path, key])
);

@customElement('semi-lit-docs')
export class SemiLitDocs extends LitElement {
  @state()
  private key: string = KEY_BY_PATH[location.pathname] ?? 'button';

  @state()
  private theme: 'light' | 'dark' =
    new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';

  @state()
  private query: string = '';

  @state()
  private showPromo: boolean = true;

  @state()
  private toc: Array<{ id: string; text: string }> = [];

  @state()
  private activeToc: string = '';

  private router = new Router(this, routers);

  private tocTimer?: number;

  private get currentItem(): { item?: NavItem; group?: NavGroup } {
    for (const group of NAV_GROUPS) {
      const item = group.items.find((entry) => entry.key === this.key);
      if (item) return { item, group };
    }
    return {};
  }

  private get currentGroupTitle(): string {
    const { group } = this.currentItem;
    return group?.title ?? '组件';
  }

  private handleClick(type: string) {
    this.key = type;
    const path = PATH_BY_KEY[type] ?? `/${type}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    this.router.goto(path);
    this.query = '';
  }

  private handleThemeChange(ev: CustomEvent<{ checked: boolean }>) {
    this.theme = ev.detail.checked ? 'dark' : 'light';
  }

  private handleSearch(ev: Event) {
    this.query = (ev.target as HTMLInputElement).value.trim().toLowerCase();
  }

  private scrollToSection(id: string) {
    const target = this.renderRoot.querySelector(`#${CSS.escape(id)}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeToc = id;
  }

  private handleContentScroll(ev: Event) {
    const container = ev.currentTarget as HTMLElement;
    const headings = Array.from(this.renderRoot.querySelectorAll('.docs-main h2')) as HTMLElement[];
    const threshold = container.getBoundingClientRect().top + 120;
    let active = '';
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= threshold) active = heading.id;
    }
    if (active && active !== this.activeToc) this.activeToc = active;
  }

  private buildToc() {
    const headings = Array.from(this.renderRoot.querySelectorAll('.docs-main h2')) as HTMLElement[];
    if (headings.length === 0) {
      this.tocTimer = window.setTimeout(() => this.buildToc(), 80);
      return;
    }

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `doc-section-${index}`;
    });

    const next = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent?.trim() ?? '',
    }));

    if (JSON.stringify(next) !== JSON.stringify(this.toc)) {
      this.toc = next;
      this.activeToc = next[0]?.id ?? '';
    }
  }

  private scheduleToc() {
    if (this.tocTimer) window.clearTimeout(this.tocTimer);
    this.tocTimer = window.setTimeout(() => this.buildToc(), 0);
  }

  firstUpdated(): void {
    const path = PATH_BY_KEY[this.key] ?? `/${this.key}`;
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path);
    }
    this.router.goto(path);
  }

  protected updated(): void {
    this.scheduleToc();
    const { item } = this.currentItem;
    document.title = item ? `${item.label} - Semi Design Lit` : 'Semi Design Lit';
  }

  private renderIcon(name: string) {
    return html`<span class="nav-icon">${NAV_ICON[name] ?? NAV_ICON.button}</span>`;
  }

  private renderNav() {
    return NAV_GROUPS.map((group) => {
      const items = group.items.filter((item) =>
        !this.query || item.label.toLowerCase().includes(this.query)
      );
      if (items.length === 0) return nothing;

      return html`
        <div class="sidebar-group">
          <div class="sidebar-title">${group.title}<span class="chevron">⌃</span></div>
          ${items.map((item) => item.key
            ? html`
                <button
                  class="sidebar-item ${item.key === this.key ? 'active' : ''}"
                  @click=${() => this.handleClick(item.key!)}
                >${this.renderIcon(item.icon)}<span>${item.label}</span></button>
              `
            : html`
                <a class="sidebar-item" href=${item.href} target="_blank">
                  ${this.renderIcon(item.icon)}<span>${item.label}</span>
                </a>
              `)}
        </div>
      `;
    });
  }

  private renderToc() {
    if (this.toc.length === 0) return nothing;
    return html`
      <aside class="toc">
        <div class="toc-title">本页目录</div>
        ${this.toc.map((item) => html`
          <button
            class="toc-link ${this.activeToc === item.id ? 'active' : ''}"
            @click=${() => this.scrollToSection(item.id)}
          >${item.text}</button>
        `)}
      </aside>
    `;
  }

  render() {
    const { item, group } = this.currentItem;

    return html`
      <semi-config-provider theme-mode=${this.theme}>
        <div class="page">
          ${this.showPromo ? html`
            <div class="promo">
              <a href="https://semi.design/zh-CN/start/mcp-skills" target="_blank">
                ✨ 使用 MCP &amp; Skills 让 AI 对 Semi 了如指掌，如虎添翼
              </a>
              <button class="promo-close" aria-label="Close" @click=${() => (this.showPromo = false)}>×</button>
            </div>
          ` : nothing}

          <header class="header">
            <a class="brand" href="https://semi.design" target="_blank">
              <img src=${semiLogo} class="brand-logo" alt="Semi Design" />
              <span class="brand-name">Semi Design Lit</span>
            </a>

            <nav class="top-nav">
              ${TOP_NAV.map((nav, index) => html`
                <a class=${index === 0 ? 'active' : ''} href=${nav.href} target="_blank">
                  ${nav.label}${nav.badge ? html`<span class="nav-badge">${nav.badge}</span>` : nothing}
                </a>
              `)}
            </nav>

            <div class="header-right">
              <label class="search">
                <svg viewBox="0 0 16 16" class="search-icon" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.5"></circle>
                  <path d="M10.5 10.5L14 14"></path>
                </svg>
                <input placeholder="搜索组件" .value=${this.query} @input=${this.handleSearch} />
                <kbd>⌘ K</kbd>
              </label>
              <a class="icon-link" href="https://github.com/DouyinFE/semi-design" target="_blank" aria-label="GitHub">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"></path>
                </svg>
              </a>
              <span class="lang">中</span>
              <semi-button type="primary" theme="solid" size="small" @click=${() => window.open('https://github.com/yuanyong129/semi-design-lit', '_blank')}>
                v0.1.0
              </semi-button>
            </div>
          </header>

          <div class="body">
            <aside class="sidebar">
              ${this.renderNav()}
            </aside>

            <div class="content-scroll" @scroll=${this.handleContentScroll}>
              <div class="content-inner">
                <main class="main">
                  <div class="breadcrumb">
                    ${this.currentGroupTitle} · ${item?.en ?? 'Button'}
                  </div>
                  <div class="docs-main">${this.router.outlet()}</div>
                </main>
                ${this.renderToc()}
              </div>
            </div>
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

    .page {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .promo {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      color: #fff;
      font-size: 12px;
      background: linear-gradient(90deg, #ff9254 0%, #ff4d8d 28%, #c14bff 55%, #7a5cff 78%, #3f8cff 100%);
    }

    .promo a {
      color: inherit;
    }

    .promo-close {
      position: absolute;
      right: 16px;
      top: 50%;
      width: 20px;
      height: 20px;
      padding: 0;
      color: #fff;
      font-size: 16px;
      line-height: 18px;
      background: transparent;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      transform: translateY(-50%);
    }

    .promo-close:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    .header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      padding: 0 24px;
      background-color: var(--semi-color-bg-1);
      border-bottom: 1px solid var(--semi-color-border);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 28px;
      color: var(--semi-color-text-0);
    }

    .brand-logo {
      width: 34px;
      height: 34px;
      border-radius: 9px;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }

    .top-nav {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 26px;
      height: 100%;
    }

    .top-nav a {
      position: relative;
      color: var(--semi-color-text-1);
      font-size: 14px;
      line-height: 64px;
      white-space: nowrap;
    }

    .top-nav a:hover,
    .top-nav a.active {
      color: var(--semi-color-primary);
    }

    .nav-badge {
      margin-left: 4px;
      padding: 0 4px;
      color: var(--semi-color-primary);
      font-size: 10px;
      line-height: 14px;
      background: var(--semi-color-primary-light-default);
      border-radius: 3px;
      vertical-align: 2px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .search {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 220px;
      height: 32px;
      padding: 0 10px;
      gap: 8px;
      background-color: var(--semi-color-fill-0);
      border: 1px solid transparent;
      border-radius: 999px;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .search:focus-within {
      background-color: var(--semi-color-bg-1);
      border-color: var(--semi-color-focus-border);
    }

    .search-icon {
      width: 14px;
      height: 14px;
      color: var(--semi-color-text-2);
      fill: none;
      stroke: currentColor;
      stroke-width: 1.4;
      stroke-linecap: round;
    }

    .search input {
      flex: 1;
      min-width: 0;
      padding: 0;
      color: var(--semi-color-text-0);
      font-family: inherit;
      font-size: 13px;
      background: transparent;
      border: 0;
      outline: none;
    }

    .search input::placeholder {
      color: var(--semi-color-text-3);
    }

    .search kbd {
      padding: 0 4px;
      color: var(--semi-color-text-3);
      font-family: inherit;
      font-size: 10px;
      line-height: 16px;
      border: 1px solid var(--semi-color-border);
      border-radius: 4px;
    }

    .icon-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: var(--semi-color-text-1);
      border-radius: 50%;
    }

    .icon-link:hover {
      color: var(--semi-color-primary);
      background-color: var(--semi-color-fill-0);
    }

    .icon-link svg {
      width: 18px;
      height: 18px;
    }

    .lang {
      color: var(--semi-color-text-1);
      font-size: 13px;
    }

    .body {
      display: grid;
      flex: 1;
      grid-template-columns: 260px minmax(0, 1fr);
      overflow: hidden;
    }

    .sidebar {
      box-sizing: border-box;
      padding: 12px 12px 48px;
      overflow-y: auto;
      background-color: var(--semi-color-bg-1);
      border-right: 1px solid var(--semi-color-border);
    }

    .sidebar-group {
      margin-bottom: 6px;
    }

    .sidebar-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 12px 6px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      font-weight: 600;
    }

    .chevron {
      color: var(--semi-color-text-3);
      font-size: 11px;
      transform: rotate(180deg);
    }

    .sidebar-item {
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 7px 12px;
      gap: 10px;
      color: var(--semi-color-text-1);
      font-family: inherit;
      font-size: 14px;
      line-height: 22px;
      text-align: left;
      background: transparent;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    .sidebar-item:hover {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-fill-0);
    }

    .sidebar-item.active {
      color: var(--semi-color-primary);
      font-weight: 600;
      background-color: var(--semi-color-primary-light-default);
    }

    .nav-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      color: var(--semi-color-text-2);
      font-size: 15px;
    }

    .sidebar-item.active .nav-icon {
      color: var(--semi-color-primary);
    }

    .content-scroll {
      height: 100%;
      overflow-y: auto;
      background-color: var(--semi-color-bg-0);
    }

    .content-inner {
      display: grid;
      grid-template-columns: minmax(0, 860px) 200px;
      gap: 48px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 48px 120px;
    }

    .main {
      min-width: 0;
    }

    .breadcrumb {
      margin-bottom: 10px;
      color: var(--semi-color-text-1);
      font-size: 12px;
      line-height: 20px;
    }

    .docs-main h1 {
      margin: 0 0 10px;
      font-size: 40px;
      font-weight: 600;
      line-height: 52px;
      color: var(--semi-color-text-0);
    }

    .docs-main h1 + p {
      margin: 0 0 10px;
      color: var(--semi-color-text-2);
      font-size: 16px;
      line-height: 26px;
    }

    .docs-main h1 + p + p {
      margin: 12px 0 20px;
    }

    .docs-main h1 + p + p > semi-link {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      color: var(--semi-color-primary);
      font-size: 12px;
      line-height: 20px;
      background-color: var(--semi-color-primary-light-default);
      border-radius: 999px;
    }

    .docs-main p {
      margin: 8px 0;
      color: var(--semi-color-text-2);
      font-size: 14px;
      line-height: 22px;
    }

    .docs-main h2 {
      margin: 48px 0 14px;
      color: var(--semi-color-text-0);
      font-size: 28px;
      font-weight: 600;
      line-height: 36px;
      scroll-margin-top: 24px;
    }

    .doc-section > p {
      max-width: 780px;
    }

    .docs-main semi-divider {
      margin: 24px 0;
    }

    .docs-main > semi-divider:last-child {
      display: none;
    }

    .demo-block {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      margin: 16px 0 28px;
      overflow: hidden;
      background-color: var(--semi-color-bg-1);
      border: 1px solid var(--semi-color-border);
      border-radius: 3px;
    }

    .demo-preview {
      min-width: 0;
      background-color: var(--semi-color-bg-1);
    }

    .demo-code {
      min-width: 0;
      max-height: 460px;
      overflow: auto;
      background-color: var(--semi-color-fill-0);
      border-left: 1px solid var(--semi-color-border);
    }

    .toc {
      position: sticky;
      top: 0;
      align-self: start;
      padding-top: 2px;
      font-size: 12px;
      line-height: 20px;
    }

    .toc-title {
      margin-bottom: 8px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      font-weight: 500;
    }

    .toc-link {
      display: block;
      width: 100%;
      padding: 3px 0;
      color: var(--semi-color-text-2);
      font-family: inherit;
      font-size: 12px;
      line-height: 20px;
      text-align: left;
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    .toc-link:hover,
    .toc-link.active {
      color: var(--semi-color-primary);
    }

    @media (max-width: 1180px) {
      .content-inner {
        grid-template-columns: minmax(0, 1fr);
      }

      .toc {
        display: none;
      }
    }

    @media (max-width: 960px) {
      .top-nav {
        display: none;
      }

      .body {
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }

      .content-inner {
        padding: 28px 24px 80px;
      }

      .demo-block {
        grid-template-columns: 1fr;
      }

      .demo-code {
        max-height: 320px;
        border-top: 1px solid var(--semi-color-border);
        border-left: 0;
      }

      .search {
        width: 160px;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-lit-docs': SemiLitDocs
  }
}
