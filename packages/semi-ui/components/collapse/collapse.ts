import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type {
  CollapseActiveKey,
  CollapseChangeDetail,
  CollapseExpandIconPosition,
} from './interface';
import type { SemiCollapsePanel } from './collapse-panel';
import { collapseStyles } from './style/collapse.style';
import './collapse-panel';

const activeKeyConverter = {
  fromAttribute(value: string | null): CollapseActiveKey | undefined {
    if (value === null || value === '') {
      return undefined;
    }
    const keys = value.split(',').filter(Boolean);
    return keys.length > 1 ? keys : keys[0];
  },
  toAttribute(value: CollapseActiveKey | undefined): string | null {
    if (value === undefined) {
      return null;
    }
    return Array.isArray(value) ? value.join(',') : value;
  },
};

function normalizeKeys(value?: CollapseActiveKey): string[] {
  if (value === undefined || value === '') {
    return [];
  }
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

/**
 * Collapse displays content areas that can be expanded and collapsed.
 */
@customElement('semi-collapse')
export class SemiCollapse extends LitElement {
  /**
   * @zh 当前展开的面板，受控
   * @en Active panel keys, controlled
   */
  @property({ converter: activeKeyConverter })
  activeKey?: CollapseActiveKey;

  /**
   * @zh 默认展开的面板
   * @en Default active panel keys
   */
  @property({ attribute: 'default-active-key', converter: activeKeyConverter })
  defaultActiveKey?: CollapseActiveKey;

  /**
   * @zh 手风琴模式，同时只展开一个面板
   * @en Accordion mode, only one panel can be expanded
   */
  @property({ type: Boolean })
  accordion = false;

  /**
   * @zh 展开图标位置
   * @en Expand icon position
   * @defaultValue 'right'
   */
  @property({ attribute: 'expand-icon-position' })
  expandIconPosition: CollapseExpandIconPosition = 'right';

  /**
   * @zh 是否显示边框
   * @en Whether to show the border
   */
  @property({ type: Boolean })
  bordered = true;

  /**
   * @zh 幽灵模式
   * @en Ghost mode
   */
  @property({ type: Boolean })
  ghost = false;

  private _keys: string[] = [];

  private get _panels(): SemiCollapsePanel[] {
    return Array.from(
      this.querySelectorAll(':scope > semi-collapse-panel')
    ) as SemiCollapsePanel[];
  }

  private get _isControlled(): boolean {
    return this.activeKey !== undefined;
  }

  private _currentKeys(): string[] {
    const keys = normalizeKeys(
      this._isControlled ? this.activeKey : this._keys
    );
    return this.accordion ? keys.slice(0, 1) : keys;
  }

  private _panelKey(panel: SemiCollapsePanel, index: number): string {
    return panel.itemKey || String(index);
  }

  private _syncPanels(): void {
    const keys = this._currentKeys();
    this._panels.forEach((panel, index) => {
      panel.active = keys.includes(this._panelKey(panel, index));
      panel.expandIconPosition = this.expandIconPosition;
      panel.ghost = this.ghost;
    });
  }

  private _handleToggle = (event: Event): void => {
    const detail = (event as CustomEvent<{ panel: SemiCollapsePanel }>).detail;
    if (!detail?.panel) {
      return;
    }

    const panels = this._panels;
    const index = panels.indexOf(detail.panel);
    if (index < 0) {
      return;
    }

    const key = this._panelKey(detail.panel, index);
    const current = this._currentKeys();
    const isActive = current.includes(key);

    let next: string[];
    if (isActive) {
      next = current.filter((item) => item !== key);
    } else if (this.accordion) {
      next = [key];
    } else {
      next = [...current, key];
    }

    if (!this._isControlled) {
      this._keys = next;
      this._syncPanels();
    }

    const activeKey: CollapseActiveKey = this.accordion
      ? next[0] ?? ''
      : next;
    this.dispatchEvent(
      new CustomEvent<CollapseChangeDetail>('change', {
        detail: { activeKey, keys: next },
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleSlotChange = () => {
    this._syncPanels();
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._keys = normalizeKeys(this.defaultActiveKey);
    this.addEventListener('toggle', this._handleToggle);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('toggle', this._handleToggle);
  }

  protected firstUpdated(): void {
    this._syncPanels();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('defaultActiveKey') && !this._isControlled) {
      this._keys = normalizeKeys(this.defaultActiveKey);
    }
    if (
      changed.has('activeKey') ||
      changed.has('defaultActiveKey') ||
      changed.has('accordion') ||
      changed.has('expandIconPosition') ||
      changed.has('ghost')
    ) {
      this._syncPanels();
    }
  }

  protected render() {
    return html`
      <div
        class="semi-collapse ${this.bordered
          ? 'semi-collapse-bordered'
          : ''} ${this.ghost ? 'semi-collapse-ghost' : ''}"
        part="collapse"
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  static styles = collapseStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-collapse': SemiCollapse;
  }
}
