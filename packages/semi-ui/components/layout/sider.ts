import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { siderStyles } from './style/sider.style';
import '../../../semi-icons/build/left';
import '../../../semi-icons/build/right';

export type SiderBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const BREAKPOINT_QUERY: Record<SiderBreakpoint, string> = {
  xs: '(max-width: 575px)',
  sm: '(max-width: 767px)',
  md: '(max-width: 991px)',
  lg: '(max-width: 1199px)',
  xl: '(max-width: 1599px)',
  xxl: '(max-width: 9999px)',
};

@customElement('semi-layout-sider')
export class SemiLayoutSider extends LitElement {
  /**
   * @zh 侧边栏宽度
   * @en Width of the sider
   * @defaultValue 200
   */
  @property({ type: Number })
  width = 200;

  /**
   * @zh 收起后的宽度
   * @en Width when collapsed
   * @defaultValue 64
   */
  @property({ attribute: 'collapsed-width', type: Number })
  collapsedWidth = 64;

  /**
   * @zh 是否收起（受控）
   * @en Whether the sider is collapsed (controlled)
   */
  @property({ type: Boolean })
  collapsed = false;

  /**
   * @zh 默认是否收起
   * @en Whether the sider is collapsed by default
   */
  @property({ attribute: 'default-collapsed', type: Boolean })
  defaultCollapsed = false;

  /**
   * @zh 是否显示收起按钮
   * @en Whether to show the collapse trigger
   */
  @property({ type: Boolean })
  trigger = true;

  /**
   * @zh 触发响应式收起的断点
   * @en Breakpoint that collapses the sider
   */
  @property()
  breakpoint?: SiderBreakpoint;

  /**
   * @zh 收起时箭头是否反向
   * @en Whether to reverse the arrow when collapsed
   */
  @property({ attribute: 'reverse-arrow', type: Boolean })
  reverseArrow = false;

  @state()
  private _innerCollapsed = false;

  private _media?: MediaQueryList;
  private _mediaListener?: (event: MediaQueryListEvent) => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._innerCollapsed = this.defaultCollapsed;
    if (this.breakpoint) this._setupBreakpoint();
  }

  disconnectedCallback(): void {
    this._cleanupBreakpoint();
    super.disconnectedCallback();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('breakpoint')) {
      this._cleanupBreakpoint();
      this._setupBreakpoint();
    }
  }

  private get _isCollapsed(): boolean {
    return this.collapsed || this._innerCollapsed;
  }

  private _setupBreakpoint(): void {
    if (!this.breakpoint || typeof window === 'undefined' || !window.matchMedia) return;
    const query = BREAKPOINT_QUERY[this.breakpoint];
    if (!query) return;
    this._media = window.matchMedia(query);
    this._mediaListener = (event) => {
      if (event.matches) {
        this._innerCollapsed = true;
        this._emit('responsive');
      }
    };
    this._media.addEventListener('change', this._mediaListener);
    if (this._media.matches) {
      this._innerCollapsed = true;
    }
  }

  private _cleanupBreakpoint(): void {
    if (this._media && this._mediaListener) {
      this._media.removeEventListener('change', this._mediaListener);
    }
    this._media = undefined;
    this._mediaListener = undefined;
  }

  private _emit(type: 'trigger' | 'responsive'): void {
    this.dispatchEvent(
      new CustomEvent('collapse', {
        bubbles: true,
        composed: true,
        detail: { collapsed: this._isCollapsed, type },
      })
    );
  }

  private _toggle = (): void => {
    this._innerCollapsed = !this._isCollapsed;
    this._emit('trigger');
  };

  protected render() {
    const collapsed = this._isCollapsed;
    const width = collapsed ? this.collapsedWidth : this.width;
    const showRight = collapsed !== this.reverseArrow;

    return html`
      <aside
        class="semi-layout-sider ${collapsed ? 'semi-layout-sider-collapsed' : ''}"
        style=${styleMap({ width: `${width}px` })}
        part="sider"
      >
        <div class="semi-layout-sider-children"><slot></slot></div>
        ${this.trigger
          ? html`
              <button
                class="semi-layout-sider-trigger"
                type="button"
                aria-label=${collapsed ? '展开侧边栏' : '收起侧边栏'}
                aria-expanded=${String(!collapsed)}
                @click=${this._toggle}
              >
                ${showRight ? html`<semi-icon-right></semi-icon-right>` : html`<semi-icon-left></semi-icon-left>`}
              </button>
            `
          : ''}
      </aside>
    `;
  }

  static styles = siderStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-layout-sider': SemiLayoutSider;
  }
}
