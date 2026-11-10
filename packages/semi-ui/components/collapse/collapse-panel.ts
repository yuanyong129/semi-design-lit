import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { CollapseExpandIconPosition } from './interface';
import { collapsePanelStyles } from './style/collapse-panel.style';
import '../../../semi-icons/build/right';

let panelId = 0;

/**
 * A collapsible panel used inside `semi-collapse`.
 */
@customElement('semi-collapse-panel')
export class SemiCollapsePanel extends LitElement {
  /**
   * @zh 面板唯一标识
   * @en Unique panel key
   */
  @property({ attribute: 'item-key' })
  itemKey?: string;

  /**
   * @zh 面板标题
   * @en Panel header
   */
  @property()
  header = '';

  /**
   * @zh 标题右侧附加内容
   * @en Extra content beside the header
   */
  @property()
  extra = '';

  /**
   * @zh 是否禁用
   * @en Whether the panel is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * @zh 是否显示展开图标
   * @en Whether to show the expand icon
   */
  @property({ type: Boolean, attribute: 'show-arrow' })
  showArrow = true;

  /**
   * @zh 展开图标位置
   * @en Expand icon position
   */
  @property({ attribute: false })
  expandIconPosition: CollapseExpandIconPosition = 'right';

  /**
   * @zh 是否展开，由父级 Collapse 控制
   * @en Whether the panel is active, controlled by Collapse
   */
  @property({ type: Boolean, attribute: false })
  active = false;

  /**
   * @zh 幽灵模式，由父级 Collapse 控制
   * @en Ghost mode, controlled by Collapse
   */
  @property({ type: Boolean, reflect: true })
  ghost = false;

  private _panelId = `semi-collapse-panel-${++panelId}`;

  private _handleClick = () => {
    if (this.disabled) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { key: this.itemKey, panel: this },
        bubbles: true,
        composed: true,
      })
    );
  };

  protected render() {
    const headerId = `${this._panelId}-header`;
    const bodyId = `${this._panelId}-body`;
    const iconRight = this.expandIconPosition === 'right';
    const panelClasses = {
      'semi-collapse-panel': true,
      'semi-collapse-panel-active': this.active,
      'semi-collapse-icon-right': iconRight,
    };

    return html`
      <div class=${classMap(panelClasses)} part="panel">
        <button
          id=${headerId}
          class="semi-collapse-header"
          type="button"
          aria-expanded=${this.active ? 'true' : 'false'}
          aria-controls=${bodyId}
          ?disabled=${this.disabled}
          @click=${this._handleClick}
        >
          ${this.showArrow
            ? html`<span class="semi-collapse-icon" aria-hidden="true">
                <semi-icon-right></semi-icon-right>
              </span>`
            : nothing}
          <span class="semi-collapse-header-text" part="header">
            <slot name="header">${this.header}</slot>
          </span>
          <span class="semi-collapse-extra" part="extra">
            <slot name="extra">${this.extra}</slot>
          </span>
        </button>
        <div
          id=${bodyId}
          class="semi-collapse-body"
          role="region"
          aria-labelledby=${headerId}
          aria-hidden=${this.active ? 'false' : 'true'}
          ?inert=${!this.active}
        >
          <div class="semi-collapse-body-inner">
            <div class="semi-collapse-body-content">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static styles = collapsePanelStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-collapse-panel': SemiCollapsePanel;
  }
}
