import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TabItem } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import { Size } from '../_utils/constant';
import '../../../semi-icons/build/close';

const prefixCls = getPrefixCls('tabs');
const p = unsafeCSS(prefixCls);

export type TabsType = 'line' | 'button' | 'card';
export type TabsPosition = 'top' | 'bottom' | 'left' | 'right';

@customElement('semi-tabs')
export class SemiTabs extends LitElement {
  /**
   * @zh 标签页数据
   * @en Tab items
   */
  @property({ attribute: false })
  tabs: TabItem[] = [];

  /**
   * @zh 当前选中 key（受控）
   * @en Active key (controlled)
   */
  @property({ attribute: 'active-key' })
  activeKey?: string;

  /**
   * @zh 默认选中 key
   * @en Default active key
   */
  @property({ attribute: 'default-active-key' })
  defaultActiveKey?: string;

  /**
   * @zh 标签页类型
   * @en Tabs type
   * @values 'line','button','card'
   * @defaultValue 'line'
   */
  @property()
  type: TabsType = 'line';

  /**
   * @zh 标签页尺寸
   * @en Tabs size
   */
  @property()
  size: Size = 'default';

  /**
   * @zh 是否禁用整个标签页
   * @en Whether the tabs are disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否可关闭
   * @en Whether tabs can be closed
   */
  @property({ type: Boolean })
  closable: boolean = false;

  /**
   * @zh 标签位置
   * @en Tab position
   * @values 'top','bottom','left','right'
   * @defaultValue 'top'
   */
  @property({ attribute: 'tab-position' })
  tabPosition: TabsPosition = 'top';

  @state()
  private _activeKey?: string;

  @state()
  private _hiddenKeys = new Set<string>();

  connectedCallback() {
    super.connectedCallback();
    this._activeKey = this.defaultActiveKey ?? this.tabs[0]?.key;
  }

  private get _visibleTabs(): TabItem[] {
    return this.tabs.filter((tab) => !this._hiddenKeys.has(tab.key));
  }

  private get _currentKey(): string | undefined {
    const visible = this._visibleTabs;
    const current = this.activeKey ?? this._activeKey;
    if (current && visible.some((tab) => tab.key === current)) return current;
    return visible[0]?.key;
  }

  private _select(tab: TabItem) {
    if (this.disabled || tab.disabled) return;
    if (this.activeKey === undefined) {
      this._activeKey = tab.key;
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { activeKey: tab.key, key: tab.key, tab },
      bubbles: true,
      composed: true,
    }));
  }

  private _close(tab: TabItem, event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;

    const visible = this._visibleTabs;
    const index = visible.findIndex((item) => item.key === tab.key);
    const next = visible.filter((item) => item.key !== tab.key)[Math.min(index, visible.length - 2)]?.key;
    const wasActive = this._currentKey === tab.key;
    this._hiddenKeys = new Set([...this._hiddenKeys, tab.key]);

    if (this.activeKey === undefined && wasActive) {
      this._activeKey = next;
    }
    this.dispatchEvent(new CustomEvent('close', {
      detail: { key: tab.key, tab },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const tabs = this._visibleTabs;
    const activeKey = this._currentKey;
    const active = tabs.find((tab) => tab.key === activeKey);
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.type}`,
      `${prefixCls}-${this.size}`,
      `${prefixCls}-position-${this.tabPosition}`,
      this.disabled ? `${prefixCls}-disabled` : '',
    ]);

    return html`
      <div class="${cls}" part="tabs">
        <div class="${prefixCls}-bar" role="tablist">
          ${tabs.map((tab) => html`
            <div
              class="${prefixCls}-tab ${tab.key === activeKey ? `${prefixCls}-tab-active` : ''} ${tab.disabled ? `${prefixCls}-tab-disabled` : ''}"
              role="tab"
              tabindex=${tab.disabled ? '-1' : '0'}
              aria-selected=${tab.key === activeKey ? 'true' : 'false'}
              aria-disabled=${tab.disabled ? 'true' : 'false'}
              @click=${() => this._select(tab)}
              @keydown=${(event: KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  this._select(tab);
                }
              }}
            >
              <span class="${prefixCls}-tab-label">${tab.label}</span>
              ${(tab.closable ?? this.closable) && !this.disabled
                ? html`<button
                    class="${prefixCls}-tab-close"
                    type="button"
                    aria-label="Close"
                    @click=${(event: MouseEvent) => this._close(tab, event)}
                  ><semi-icon-close></semi-icon-close></button>`
                : nothing}
            </div>
          `)}
        </div>
        <div class="${prefixCls}-content" role="tabpanel">
          ${active?.content ?? nothing}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p}-bar {
      display: flex;
      align-items: center;
      gap: 24px;
      overflow-x: auto;
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-tab {
      position: relative;
      display: inline-flex;
      flex-shrink: 0;
      gap: 4px;
      align-items: center;
      padding: 12px 0;
      color: var(--semi-color-text-2);
      font-family: inherit;
      font-size: 14px;
      line-height: 20px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .${p}-tab:hover {
      color: var(--semi-color-text-0);
    }

    .${p}-tab-active {
      color: var(--semi-color-primary);
      font-weight: 500;
    }

    .${p}-line .${p}-tab-active::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 2px;
      background-color: var(--semi-color-primary);
      content: '';
    }

    .${p}-tab-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-tab-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      color: var(--semi-color-text-3);
      font-size: 10px;
      background: transparent;
      border: none;
      border-radius: 50%;
      cursor: pointer;
    }

    .${p}-tab-close:hover {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-fill-1);
    }

    .${p}-position-bottom {
      display: flex;
      flex-direction: column-reverse;
    }

    .${p}-position-bottom .${p}-bar {
      border-top: 1px solid var(--semi-color-border);
      border-bottom: none;
    }

    .${p}-position-bottom.${p}-line .${p}-tab-active::after {
      top: -1px;
      bottom: auto;
    }

    .${p}-position-left,
    .${p}-position-right {
      display: flex;
      align-items: stretch;
    }

    .${p}-position-left .${p}-bar,
    .${p}-position-right .${p}-bar {
      flex-direction: column;
      flex-shrink: 0;
      gap: 0;
      width: 160px;
      overflow-x: visible;
      border-bottom: none;
    }

    .${p}-position-left .${p}-bar {
      border-right: 1px solid var(--semi-color-border);
    }

    .${p}-position-right {
      flex-direction: row-reverse;
    }

    .${p}-position-right .${p}-bar {
      border-left: 1px solid var(--semi-color-border);
    }

    .${p}-position-left .${p}-tab,
    .${p}-position-right .${p}-tab {
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
    }

    .${p}-position-left .${p}-content,
    .${p}-position-right .${p}-content {
      flex: 1;
      min-width: 0;
      padding: 0 16px;
    }

    .${p}-position-left.${p}-line .${p}-tab-active::after,
    .${p}-position-right.${p}-line .${p}-tab-active::after {
      top: 0;
      bottom: 0;
      width: 2px;
      height: auto;
    }

    .${p}-position-left.${p}-line .${p}-tab-active::after {
      right: -1px;
      left: auto;
    }

    .${p}-position-right.${p}-line .${p}-tab-active::after {
      right: auto;
      left: -1px;
    }

    .${p}-content {
      padding: 16px 0;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 1.6;
    }

    .${p}-button .${p}-bar {
      gap: 4px;
      padding: 4px;
      background-color: var(--semi-color-fill-0);
      border: none;
      border-radius: 6px;
    }

    .${p}-button .${p}-tab {
      padding: 6px 12px;
      border-radius: 4px;
    }

    .${p}-button .${p}-tab-active {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-bg-2);
      box-shadow: var(--semi-shadow-elevated);
    }

    .${p}-card .${p}-bar {
      gap: 4px;
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-card .${p}-tab {
      padding: 10px 16px;
      border: 1px solid transparent;
      border-bottom: none;
      border-radius: 6px 6px 0 0;
    }

    .${p}-card .${p}-tab-active {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-bg-2);
      border-color: var(--semi-color-border);
    }

    .${p}-card .${p}-content {
      margin-top: -1px;
      padding: 16px;
      border: 1px solid var(--semi-color-border);
      border-radius: 0 0 6px 6px;
    }

    .${p}-small .${p}-tab {
      padding: 8px 0;
      font-size: 12px;
    }

    .${p}-large .${p}-tab {
      padding: 16px 0;
      font-size: 16px;
    }

    .${p}-small.${p}-button .${p}-tab {
      padding: 4px 10px;
    }

    .${p}-small.${p}-card .${p}-tab {
      padding: 6px 12px;
    }

    .${p}-large.${p}-button .${p}-tab {
      padding: 8px 16px;
    }

    .${p}-large.${p}-card .${p}-tab {
      padding: 14px 20px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tabs': SemiTabs
  }
}
