import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  NavClickDetail,
  NavCollapseChangeDetail,
  NavFooter,
  NavHeader,
  NavItem,
  NavItemKey,
  NavMode,
  NavOpenChangeDetail,
  NavSelectDetail,
} from './interface';

const NAV_ITEM = 'semi-navigation-item';

/**
 * A vertical or horizontal navigation menu with nested submenus and a collapsed rail.
 */
@customElement('semi-navigation')
export class SemiNavigation extends LitElement {
  @property({ attribute: false })
  items: NavItem[] = [];

  @property({ type: String })
  mode: NavMode = 'vertical';

  @property({ attribute: false })
  isCollapsed?: boolean;

  @property({ attribute: 'default-is-collapsed', type: Boolean })
  defaultIsCollapsed = false;

  @property({ attribute: false })
  selectedKeys?: NavItemKey[];

  @property({ attribute: false })
  defaultSelectedKeys: NavItemKey[] = [];

  @property({ attribute: false })
  openKeys?: NavItemKey[];

  @property({ attribute: false })
  defaultOpenKeys: NavItemKey[] = [];

  @property({ type: Boolean })
  multiple = false;

  /**
   * @zh 是否限制子级缩进
   * @en Whether submenu indentation is limited
   */
  @property({ attribute: 'limit-indent', type: Boolean })
  limitIndent = true;

  @property({ attribute: false })
  header?: NavHeader;

  @property({ attribute: false })
  footer?: NavFooter;

  @property({ attribute: false })
  expandIcon?: unknown;

  @property({ attribute: false })
  ariaLabel = 'Navigation';

  @state()
  private _selectedKeys: NavItemKey[] = [];

  @state()
  private _openKeys: NavItemKey[] = [];

  @state()
  private _collapsed = false;

  @state()
  private _flyout?: { key: NavItemKey; item: NavItem; top: number; left: number };

  private _itemKeys = new WeakMap<NavItem, NavItemKey>();
  private _parents = new Map<NavItemKey, NavItemKey | undefined>();
  private _itemsByKey = new Map<NavItemKey, NavItem>();
  private _lastItems?: NavItem[];
  private _lastSelected?: NavItemKey[];
  private _lastOpen?: NavItemKey[];
  private _outsideHandler = (event: Event): void => this._handleOutside(event);
  private _keyHandler = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this._closeFlyout();
  };

  willUpdate(changed: PropertyValues): void {
    if (changed.has('items') || this._lastItems !== this.items) {
      this._indexItems();
      this._lastItems = this.items;
    }
    if (changed.has('isCollapsed') && this.isCollapsed !== undefined) {
      this._collapsed = this.isCollapsed;
    }
    if (changed.has('defaultIsCollapsed') && this.isCollapsed === undefined) {
      this._collapsed = this.defaultIsCollapsed;
    }
    if (changed.has('selectedKeys') && this.selectedKeys !== undefined) {
      if (this._lastSelected !== this.selectedKeys) {
        this._selectedKeys = [...this.selectedKeys];
        this._lastSelected = this.selectedKeys;
      }
    }
    if (changed.has('defaultSelectedKeys') && this.selectedKeys === undefined) {
      this._selectedKeys = [...this.defaultSelectedKeys];
    }
    if (changed.has('openKeys') && this.openKeys !== undefined) {
      if (this._lastOpen !== this.openKeys) {
        this._openKeys = [...this.openKeys];
        this._lastOpen = this.openKeys;
      }
    }
    if (changed.has('defaultOpenKeys') && this.openKeys === undefined) {
      this._openKeys = [...this.defaultOpenKeys];
    }
  }

  disconnectedCallback(): void {
    this._removeGlobalListeners();
    super.disconnectedCallback();
  }

  private _removeGlobalListeners(): void {
    document.removeEventListener('pointerdown', this._outsideHandler, true);
    document.removeEventListener('keydown', this._keyHandler);
  }

  private _handleOutside(event: Event): void {
    if (!event.composedPath().includes(this)) this._closeFlyout();
  }

  private _indexItems(): void {
    this._itemKeys = new WeakMap();
    this._parents = new Map();
    this._itemsByKey = new Map();
    const walk = (items: NavItem[], level: number, parent?: NavItemKey): void => {
      items.forEach((item, index) => {
        const key = item.itemKey ?? `${level}-${index}`;
        this._itemKeys.set(item, key);
        this._itemsByKey.set(key, item);
        this._parents.set(key, parent);
        if (item.items?.length) walk(item.items, level + 1, key);
      });
    };
    walk(this.items ?? [], 0);
  }

  private _keyOf(item: NavItem, level: number, index: number): NavItemKey {
    return this._itemKeys.get(item) ?? item.itemKey ?? `${level}-${index}`;
  }

  private _isSelected(key: NavItemKey): boolean {
    return this._selectedKeys.includes(key);
  }

  private _isOpen(key: NavItemKey): boolean {
    return this._openKeys.includes(key);
  }

  private _selectedItems(): NavItem[] {
    return this._selectedKeys
      .map((key) => this._itemsByKey.get(key))
      .filter((item): item is NavItem => Boolean(item));
  }

  private _emitSelect(item: NavItem, key: NavItemKey, event: Event, isOpen = false): void {
    const detail: NavSelectDetail = {
      itemKey: key,
      selectedKeys: [...this._selectedKeys],
      selectedItems: this._selectedItems(),
      domEvent: event,
      isOpen,
    };
    this.dispatchEvent(new CustomEvent('select', { detail, bubbles: true, composed: true }));
    this.onSelect?.(detail);
  }

  private _emitOpenChange(item: NavItem, key: NavItemKey, event: Event, isOpen: boolean): void {
    const detail: NavOpenChangeDetail = {
      itemKey: key,
      openKeys: [...this._openKeys],
      domEvent: event,
      isOpen,
    };
    this.dispatchEvent(new CustomEvent('open-change', { detail, bubbles: true, composed: true }));
    this.onOpenChange?.(detail);
  }

  private _emitClick(item: NavItem, key: NavItemKey, event: Event, isOpen: boolean): void {
    const detail: NavClickDetail = { itemKey: key, domEvent: event, isOpen };
    this.dispatchEvent(new CustomEvent('click', { detail, bubbles: true, composed: true }));
    this.onClick?.(detail);
  }

  @property({ attribute: false })
  onSelect?: (detail: NavSelectDetail) => void;

  @property({ attribute: false })
  onOpenChange?: (detail: NavOpenChangeDetail) => void;

  @property({ attribute: false })
  onClick?: (detail: NavClickDetail) => void;

  @property({ attribute: false })
  onCollapseChange?: (detail: NavCollapseChangeDetail) => void;

  private _toggleCollapse(event: Event): void {
    const next = !this._collapsed;
    if (this.isCollapsed === undefined) this._collapsed = next;
    const detail: NavCollapseChangeDetail = { isCollapsed: next, domEvent: event };
    this.dispatchEvent(new CustomEvent('collapse-change', { detail, bubbles: true, composed: true }));
    this.onCollapseChange?.(detail);
    if (next) this._closeFlyout();
  }

  public toggleCollapse = (): void => this._toggleCollapse(new Event('toggle'));

  private _select(item: NavItem, key: NavItemKey, event: Event): void {
    if (item.disabled) return;
    let keys: NavItemKey[];
    if (this.multiple) {
      keys = this._selectedKeys.includes(key)
        ? this._selectedKeys.filter((itemKey) => itemKey !== key)
        : [...this._selectedKeys, key];
    } else {
      keys = [key];
    }
    let parent = this._parents.get(key);
    while (parent !== undefined) {
      if (!keys.includes(parent)) keys.push(parent);
      parent = this._parents.get(parent);
    }
    this._selectedKeys = keys;
    this._emitSelect(item, key, event);
    this._emitClick(item, key, event, false);
    this._closeFlyout();
    this.requestUpdate();
  }

  private _toggleOpen(item: NavItem, key: NavItemKey, event: Event): void {
    event.stopPropagation();
    if (item.disabled) return;
    const isOpen = !this._isOpen(key);
    const keys = isOpen ? [...this._openKeys, key] : this._openKeys.filter((itemKey) => itemKey !== key);
    this._openKeys = keys;
    this._emitOpenChange(item, key, event, isOpen);
    this._emitClick(item, key, event, isOpen);
    if (isOpen && (this._collapsed || this.mode === 'horizontal')) {
      this._openFlyout(item, key, event);
    } else {
      this._closeFlyout();
    }
    this.requestUpdate();
  }

  private _openFlyout(item: NavItem, key: NavItemKey, event: Event): void {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const top = this._collapsed ? rect.top : rect.bottom + 4;
    const left = this._collapsed ? rect.right + 4 : rect.left;
    this._flyout = { key, item, top, left };
    this._removeGlobalListeners();
    document.addEventListener('pointerdown', this._outsideHandler, true);
    document.addEventListener('keydown', this._keyHandler);
    this.requestUpdate();
  }

  private _closeFlyout(): void {
    if (!this._flyout) return;
    this._flyout = undefined;
    this._removeGlobalListeners();
    this.requestUpdate();
  }

  private _handleItemClick(event: Event, item: NavItem, level: number, index: number): void {
    event.stopPropagation();
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    const key = this._keyOf(item, level, index);
    if (item.items?.length) {
      this._toggleOpen(item, key, event);
      return;
    }
    this._select(item, key, event);
  }

  private _handleKey(event: KeyboardEvent, item: NavItem, level: number, index: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._handleItemClick(event, item, level, index);
  }

  private _renderIcon(icon: unknown): TemplateResult | typeof nothing {
    return icon === undefined || icon === null ? nothing : html`<i class="semi-navigation-item-icon">${icon}</i>`;
  }

  private _renderItem(item: NavItem, level: number, index: number): TemplateResult {
    const key = this._keyOf(item, level, index);
    const selected = this._isSelected(key);
    const hasChildren = Boolean(item.items?.length);
    const collapsed = this._collapsed && this.mode === 'vertical';
    const classes = {
      [NAV_ITEM]: true,
      [`${NAV_ITEM}-selected`]: selected && !hasChildren,
      [`${NAV_ITEM}-disabled`]: Boolean(item.disabled),
      [`${NAV_ITEM}-collapsed`]: collapsed,
    };
    const content = html`
      ${this._renderIcon(item.icon)}
      <span class="semi-navigation-item-text">${item.text}</span>
      ${item.toggleIcon ? this._renderIcon(item.toggleIcon) : nothing}
    `;
    return html`
      <li
        class="${Object.entries(classes)
          .filter(([, value]) => value)
          .map(([name]) => name)
          .join(' ')} ${item.className ?? ''}"
        role="menuitem"
        tabindex=${item.disabled ? -1 : 0}
        aria-disabled=${item.disabled ? 'true' : 'false'}
        title=${collapsed && typeof item.text === 'string' ? item.text : nothing}
        style=${item.style ? styleMap(item.style as Record<string, string>) : nothing}
        @click=${(event: Event) => this._handleItemClick(event, item, level, index)}
        @keydown=${(event: KeyboardEvent) => this._handleKey(event, item, level, index)}
      >
        ${item.link
          ? html`<a class="semi-navigation-item-link" href=${item.link}>${content}</a>`
          : content}
      </li>
    `;
  }

  private _renderSub(item: NavItem, level: number, index: number): TemplateResult {
    const key = this._keyOf(item, level, index);
    const open = this._isOpen(key);
    const selected = this._isSelected(key);
    const collapsed = this._collapsed && this.mode === 'vertical';
    return html`
      <li
        class="semi-navigation-sub ${open ? 'semi-navigation-sub-open' : ''} ${collapsed
          ? 'semi-navigation-sub-collapsed'
          : ''}"
      >
        <div
          class="semi-navigation-sub-title ${selected ? 'semi-navigation-sub-title-selected' : ''} ${item.disabled
            ? 'semi-navigation-sub-title-disabled'
            : ''}"
          role="menuitem"
          tabindex=${item.disabled ? -1 : 0}
          aria-expanded=${open ? 'true' : 'false'}
          aria-disabled=${item.disabled ? 'true' : 'false'}
          title=${collapsed && typeof item.text === 'string' ? item.text : nothing}
          @click=${(event: Event) => this._toggleOpen(item, key, event)}
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              this._toggleOpen(item, key, event);
            }
          }}
        >
          ${this._renderIcon(item.icon)}
          <span class="semi-navigation-item-text">${item.text}</span>
          <i class="semi-navigation-sub-arrow">
            ${this.expandIcon ?? html`<semi-icon-down></semi-icon-down>`}
          </i>
        </div>
        ${open && !collapsed && this.mode === 'vertical'
          ? html`
              <ul class="semi-navigation-sub-list" role="group">
                ${item.items?.map((child, childIndex) => this._renderNodes(child, level + 1, childIndex))}
              </ul>
            `
          : nothing}
      </li>
    `;
  }

  private _renderNodes(item: NavItem, level: number, index: number): TemplateResult {
    return item.items?.length ? this._renderSub(item, level, index) : this._renderItem(item, level, index);
  }

  private _renderFlyout(): TemplateResult | typeof nothing {
    if (!this._flyout) return nothing;
    const { item, top, left } = this._flyout;
    return html`
      <div
        class="semi-navigation-popover"
        style=${styleMap({ position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: '1050' })}
        @click=${(event: Event) => event.stopPropagation()}
      >
        <ul class="semi-navigation-popover-list" role="menu">
          ${item.items?.map((child, index) => this._renderNodes(child, 1, index))}
        </ul>
      </div>
    `;
  }

  private _renderHeader(): TemplateResult | typeof nothing {
    if (!this.header) return nothing;
    const logo = this.header.logo;
    const text = this.header.text;
    const inner = html`
      ${logo ? html`<i class="semi-navigation-header-logo">${logo}</i>` : nothing}
      ${text && !this._collapsed ? html`<span class="semi-navigation-header-text">${text}</span>` : nothing}
    `;
    return html`
      <div class="semi-navigation-header ${this._collapsed ? 'semi-navigation-header-collapsed' : ''}">
        ${this.header.link ? html`<a class="semi-navigation-header-link" href=${this.header.link}>${inner}</a>` : inner}
      </div>
    `;
  }

  private _renderFooter(): TemplateResult | typeof nothing {
    if (!this.footer) return nothing;
    const text = this.footer.collapseText
      ? this.footer.collapseText(this._collapsed)
      : this._collapsed
        ? '展开'
        : '收起';
    return html`
      <div class="semi-navigation-footer ${this._collapsed ? 'semi-navigation-footer-collapsed' : ''}">
        ${this.footer.collapseButton
          ? html`
              <button class="semi-navigation-collapse-btn" type="button" @click=${this._toggleCollapse}>
                ${this._collapsed
                  ? html`<semi-icon-right></semi-icon-right>`
                  : html`<semi-icon-left></semi-icon-left>`}
                ${!this._collapsed ? html`<span>${text}</span>` : nothing}
              </button>
            `
          : nothing}
      </div>
    `;
  }

  protected render(): TemplateResult {
    const classes = [
      'semi-navigation',
      `semi-navigation-${this.mode}`,
      this._collapsed ? 'semi-navigation-collapsed' : '',
    ]
      .filter(Boolean)
      .join(' ');
    return html`
      <div class=${classes} role="navigation" aria-label=${this.ariaLabel}>
        <div class="semi-navigation-inner">
          ${this._renderHeader()}
          <div class="semi-navigation-list-wrapper">
            <ul class="semi-navigation-list" role="menu" aria-orientation=${this.mode}>
              ${this.items?.map((item, index) => this._renderNodes(item, 0, index))}
            </ul>
          </div>
          ${this._renderFooter()}
        </div>
      </div>
      ${this._renderFlyout()}
    `;
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    const root = super.createRenderRoot();
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        --semi-navigation-width: 240px;
        --semi-navigation-collapsed-width: 64px;
        font-family: var(--semi-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
      }
      .semi-navigation {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: var(--semi-navigation-width);
        height: 100%;
        min-height: 320px;
        color: var(--semi-color-text-0, #1c1f23);
        background: var(--semi-color-bg-2, #ffffff);
        border-right: 1px solid var(--semi-color-border, #e5e6eb);
        font-size: 14px;
      }
      .semi-navigation-inner { display: flex; flex-direction: column; height: 100%; min-height: 0; }
      .semi-navigation-header { display: flex; align-items: center; gap: 8px; height: 56px; padding: 0 16px; flex: none; }
      .semi-navigation-header-collapsed { justify-content: center; padding: 0; }
      .semi-navigation-header-link { display: flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; }
      .semi-navigation-header-logo { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; font-size: 24px; color: var(--semi-color-primary, #0064fa); }
      .semi-navigation-header-text { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .semi-navigation-list-wrapper { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 8px; }
      .semi-navigation-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
      .semi-navigation-item, .semi-navigation-sub-title {
        box-sizing: border-box; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px;
        border-radius: 6px; color: var(--semi-color-text-1, #464b52); cursor: pointer; outline: none;
        white-space: nowrap; transition: background .15s ease, color .15s ease;
      }
      .semi-navigation-item:hover, .semi-navigation-sub-title:hover { background: var(--semi-color-fill-0, #f1f2f4); }
      .semi-navigation-item:focus-visible, .semi-navigation-sub-title:focus-visible { box-shadow: 0 0 0 2px var(--semi-color-primary-light-active, #a6c8ff); }
      .semi-navigation-item-selected, .semi-navigation-sub-title-selected {
        color: var(--semi-color-primary, #0064fa); background: var(--semi-color-primary-light-default, #eaf2ff); font-weight: 500;
      }
      .semi-navigation-item-disabled, .semi-navigation-sub-title-disabled { color: var(--semi-color-disabled-text, #bbbfc4); cursor: not-allowed; background: transparent; }
      .semi-navigation-item-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex: none; font-size: 18px; }
      .semi-navigation-item-text { overflow: hidden; text-overflow: ellipsis; flex: 1; }
      .semi-navigation-item-link { display: flex; align-items: center; gap: 8px; width: 100%; height: 100%; color: inherit; text-decoration: none; }
      .semi-navigation-sub { list-style: none; }
      .semi-navigation-sub-title { padding-right: 8px; }
      .semi-navigation-sub-arrow { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; color: var(--semi-color-text-2, #8f959e); transition: transform .2s ease; }
      .semi-navigation-sub-open > .semi-navigation-sub-title .semi-navigation-sub-arrow { transform: rotate(180deg); }
      .semi-navigation-sub-list { list-style: none; margin: 0; padding: 0 0 0 12px; }
      .semi-navigation-sub-list .semi-navigation-item, .semi-navigation-sub-list .semi-navigation-sub-title { padding-left: 12px; }
      .semi-navigation-footer { flex: none; padding: 8px; border-top: 1px solid var(--semi-color-border, #e5e6eb); }
      .semi-navigation-footer-collapsed { padding: 8px 0; }
      .semi-navigation-collapse-btn {
        width: 100%; height: 36px; border: 0; border-radius: 6px; background: transparent; color: var(--semi-color-text-1, #464b52);
        display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; font-size: 14px;
      }
      .semi-navigation-collapse-btn:hover { background: var(--semi-color-fill-0, #f1f2f4); }
      .semi-navigation-collapsed { width: var(--semi-navigation-collapsed-width); }
      .semi-navigation-collapsed .semi-navigation-item-text, .semi-navigation-collapsed .semi-navigation-sub-arrow { display: none; }
      .semi-navigation-collapsed .semi-navigation-item, .semi-navigation-collapsed .semi-navigation-sub-title { justify-content: center; padding: 0; }
      .semi-navigation-collapsed .semi-navigation-list-wrapper { padding: 8px; }
      .semi-navigation-horizontal { flex-direction: row; width: 100%; height: 56px; min-height: 56px; border-right: 0; border-bottom: 1px solid var(--semi-color-border, #e5e6eb); }
      .semi-navigation-horizontal .semi-navigation-inner { flex-direction: row; align-items: center; width: 100%; height: 100%; }
      .semi-navigation-horizontal .semi-navigation-header { padding: 0 16px; }
      .semi-navigation-horizontal .semi-navigation-list-wrapper { overflow: visible; padding: 0 8px; }
      .semi-navigation-horizontal .semi-navigation-list { flex-direction: row; align-items: center; gap: 4px; }
      .semi-navigation-horizontal .semi-navigation-item, .semi-navigation-horizontal .semi-navigation-sub-title { height: 36px; margin: 0 2px; }
      .semi-navigation-horizontal .semi-navigation-footer { border-top: 0; margin-left: auto; }
      .semi-navigation-popover {
        min-width: 180px; padding: 6px; background: var(--semi-color-bg-2, #fff); border: 1px solid var(--semi-color-border, #e5e6eb);
        border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, .12);
      }
      .semi-navigation-popover-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
      .semi-navigation-popover .semi-navigation-sub-list { padding-left: 8px; }
    `;
    root.appendChild(style);
    return root;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-navigation': SemiNavigation;
  }
}
