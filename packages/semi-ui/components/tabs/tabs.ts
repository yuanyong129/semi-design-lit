import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TabItem } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import { Size } from '../_utils/constant';

const prefixCls = getPrefixCls('tabs');
const p = unsafeCSS(prefixCls);

export type TabsType = 'line' | 'button' | 'card';

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

  @state()
  private _activeKey?: string;

  connectedCallback() {
    super.connectedCallback();
    this._activeKey = this.defaultActiveKey ?? this.tabs[0]?.key;
  }

  private get _currentKey(): string | undefined {
    return this.activeKey ?? this._activeKey ?? this.tabs[0]?.key;
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

  render() {
    const activeKey = this._currentKey;
    const active = this.tabs.find((tab) => tab.key === activeKey);
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.type}`,
      `${prefixCls}-${this.size}`,
      this.disabled ? `${prefixCls}-disabled` : '',
    ]);

    return html`
      <div class="${cls}" part="tabs">
        <div class="${prefixCls}-bar" role="tablist">
          ${this.tabs.map((tab) => html`
            <button
              class="${prefixCls}-tab ${tab.key === activeKey ? `${prefixCls}-tab-active` : ''} ${tab.disabled ? `${prefixCls}-tab-disabled` : ''}"
              type="button"
              role="tab"
              aria-selected=${tab.key === activeKey ? 'true' : 'false'}
              ?disabled=${this.disabled || tab.disabled}
              @click=${() => this._select(tab)}
            >${tab.label}</button>
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
      border-bottom: 1px solid var(--semi-color-border);
    }

    .${p}-tab {
      position: relative;
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
