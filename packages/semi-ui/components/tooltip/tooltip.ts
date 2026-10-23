import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TriggerPosition, TriggerType } from '../trigger/trigger';
import '../trigger/trigger';

@customElement('semi-tooltip')
export class SemiTooltip extends LitElement {
  /**
   * @zh 提示内容
   * @en Tooltip content
   */
  @property({ attribute: 'content' })
  content?: string | TemplateResult;

  /**
   * @zh 出现位置
   * @en Position
   */
  @property()
  position: TriggerPosition = 'top';

  /**
   * @zh 触发方式
   * @en Trigger mode
   */
  @property()
  trigger: TriggerType = 'hover';

  /**
   * @zh 是否显示
   * @en Whether the tooltip is open
   */
  @property({ type: Boolean })
  open?: boolean;

  /**
   * @zh 默认是否显示
   * @en Whether the tooltip is open by default
   */
  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the tooltip is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否显示箭头
   * @en Whether to show the arrow
   */
  @property({ attribute: 'show-arrow', type: Boolean })
  showArrow: boolean = true;

  @property({ type: Number })
  offset: number = 8;

  @property({ attribute: 'mouse-enter-delay', type: Number })
  mouseEnterDelay: number = 100;

  @property({ attribute: 'mouse-leave-delay', type: Number })
  mouseLeaveDelay: number = 100;

  render() {
    return html`
      <semi-trigger
        .trigger=${this.trigger}
        .position=${this.position}
        .content=${this.content}
        .open=${this.open}
        .defaultOpen=${this.defaultOpen}
        .disabled=${this.disabled}
        .showArrow=${this.showArrow}
        .offset=${this.offset}
        .mouseEnterDelay=${this.mouseEnterDelay}
        .mouseLeaveDelay=${this.mouseLeaveDelay}
        popup-role="tooltip"
      >
        <slot></slot>
      </semi-trigger>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tooltip': SemiTooltip
  }
}
