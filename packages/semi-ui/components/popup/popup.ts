import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';

const prefixCls = getPrefixCls('popup');
const p = unsafeCSS(prefixCls);

@customElement('semi-popup')
export class SemiPopup extends LitElement {
  /**
   * @zh 浮层位置
   * @en Popup position
   * @values 'top','bottom','left','right'
   */
  @property()
  position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * @zh 是否显示箭头
   * @en Whether to show the arrow
   */
  @property({ type: Boolean })
  showArrow: boolean = true;

  /**
   * @zh 无障碍角色
   * @en Accessible role
   */
  @property()
  role: string = 'dialog';

  /**
   * @zh 去掉默认背景、边框与内边距
   * @en Remove default background, border and padding
   */
  @property({ type: Boolean })
  plain: boolean = false;

  render() {
    return html`
      <div
        class="${prefixCls} ${prefixCls}-${this.position} ${this.plain ? `${prefixCls}-plain` : ''}"
        part="popup"
        role=${this.role}
      >
        ${this.showArrow ? html`<span class="${prefixCls}-arrow" aria-hidden="true"></span>` : nothing}
        <div class="${prefixCls}-content"><slot></slot></div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      position: relative;
      box-sizing: border-box;
      min-width: 120px;
      max-width: 360px;
      padding: 12px 16px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 20px;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
      word-break: break-word;
    }

    .${p}-content {
      min-width: 0;
    }

    .${p}-plain {
      min-width: 0;
      max-width: none;
      padding: 0;
      background: transparent;
      border: none;
      box-shadow: none;
    }

    .${p}-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      transform: rotate(45deg);
    }

    .${p}-top .${p}-arrow {
      bottom: -5px;
      left: 50%;
      margin-left: -4px;
      border-top: 0;
      border-left: 0;
    }

    .${p}-bottom .${p}-arrow {
      top: -5px;
      left: 50%;
      margin-left: -4px;
      border-right: 0;
      border-bottom: 0;
    }

    .${p}-left .${p}-arrow {
      top: 50%;
      right: -5px;
      margin-top: -4px;
      border-bottom: 0;
      border-left: 0;
    }

    .${p}-right .${p}-arrow {
      top: 50%;
      left: -5px;
      margin-top: -4px;
      border-top: 0;
      border-right: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-popup': SemiPopup
  }
}
