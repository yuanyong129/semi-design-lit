import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TriggerAlign, TriggerPosition, TriggerType } from '../trigger/trigger';
import '../trigger/trigger';

@customElement('semi-popover')
export class SemiPopover extends LitElement {
  /**
   * @zh 标题
   * @en Title
   */
  @property({ attribute: 'title' })
  popoverTitle?: string;

  /**
   * @zh 内容
   * @en Content
   */
  @property({ attribute: 'content' })
  content?: string | TemplateResult;

  /**
   * @zh 触发方式
   * @en Trigger mode
   */
  @property()
  trigger: TriggerType = 'click';

  /**
   * @zh 出现位置
   * @en Position
   */
  @property()
  position: TriggerPosition = 'bottom';

  /**
   * @zh 对齐方式
   * @en Alignment
   */
  @property()
  align: TriggerAlign = 'center';

  /**
   * @zh 是否显示
   * @en Whether the popover is open
   */
  @property({ type: Boolean })
  open?: boolean;

  /**
   * @zh 默认是否显示
   * @en Whether the popover is open by default
   */
  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the popover is disabled
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

  private _renderContent() {
    if (!this.popoverTitle && !this.content) return nothing;

    return html`
      <div style="max-width: 280px;">
        ${this.popoverTitle
          ? html`<div style="margin-bottom: 8px; font-weight: 600;">${this.popoverTitle}</div>`
          : nothing}
        <div>${this.content ?? nothing}</div>
      </div>
    `;
  }

  render() {
    return html`
      <semi-trigger
        .trigger=${this.trigger}
        .position=${this.position}
        .align=${this.align}
        .content=${this._renderContent()}
        .open=${this.open}
        .defaultOpen=${this.defaultOpen}
        .disabled=${this.disabled}
        .showArrow=${this.showArrow}
        .offset=${this.offset}
        popup-role="dialog"
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
    'semi-popover': SemiPopover
  }
}
