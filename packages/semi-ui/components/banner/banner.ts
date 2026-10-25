import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import '../../../semi-icons/build/check-circle-fill';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/close-circle';
import '../../../semi-icons/build/exclamation-circle-fill';
import '../../../semi-icons/build/info-circle';

const prefixCls = getPrefixCls('banner');
const p = unsafeCSS(prefixCls);

export type BannerType = 'info' | 'success' | 'warning' | 'danger';

@customElement('semi-banner')
export class SemiBanner extends LitElement {
  /**
   * @zh 类型
   * @en Type
   * @values 'info','success','warning','danger'
   */
  @property()
  type: BannerType = 'info';

  /**
   * @zh 标题
   * @en Title
   */
  @property({ attribute: 'title' })
  bannerTitle?: string;

  /**
   * @zh 描述
   * @en Description
   */
  @property()
  description?: string;

  /**
   * @zh 是否可关闭
   * @en Whether the banner is closable
   */
  @property({ type: Boolean })
  closable: boolean = false;

  /**
   * @zh 是否显示（受控）
   * @en Whether the banner is visible (controlled)
   */
  @property({ type: Boolean })
  visible?: boolean;

  /**
   * @zh 是否通栏展示
   * @en Whether to show full width
   */
  @property({ attribute: 'full-mode', type: Boolean })
  fullMode: boolean = false;

  @state()
  private _visible: boolean = true;

  private get _isVisible(): boolean {
    return this.visible ?? this._visible;
  }

  private _icon() {
    switch (this.type) {
      case 'success':
        return html`<semi-icon-check-circle-fill></semi-icon-check-circle-fill>`;
      case 'warning':
        return html`<semi-icon-exclamation-circle-fill></semi-icon-exclamation-circle-fill>`;
      case 'danger':
        return html`<semi-icon-close-circle></semi-icon-close-circle>`;
      default:
        return html`<semi-icon-info-circle></semi-icon-info-circle>`;
    }
  }

  private _handleClose(event: MouseEvent) {
    if (this.visible === undefined) {
      this._visible = false;
    }
    this.dispatchEvent(new CustomEvent('close', {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this._isVisible) return nothing;

    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.type}`,
      this.fullMode ? `${prefixCls}-full` : '',
    ]);

    return html`
      <div class="${cls}" part="banner" role="alert">
        <span class="${prefixCls}-icon">${this._icon()}</span>
        <div class="${prefixCls}-content">
          ${this.bannerTitle ? html`<div class="${prefixCls}-title">${this.bannerTitle}</div>` : nothing}
          ${this.description
            ? html`<div class="${prefixCls}-description">${this.description}</div>`
            : html`<div class="${prefixCls}-description"><slot></slot></div>`}
        </div>
        <div class="${prefixCls}-action"><slot name="action"></slot></div>
        ${this.closable
          ? html`<button class="${prefixCls}-close" type="button" aria-label="Close" @click=${this._handleClose}>
              <semi-icon-close></semi-icon-close>
            </button>`
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      display: flex;
      align-items: flex-start;
      box-sizing: border-box;
      width: 100%;
      padding: 12px 16px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 20px;
      border: 1px solid transparent;
      border-radius: var(--semi-border-radius-medium, 6px);
    }

    .${p}-info {
      background-color: var(--semi-color-info-light-default);
      border-color: var(--semi-color-info-light-active);
    }

    .${p}-success {
      background-color: var(--semi-color-success-light-default);
      border-color: var(--semi-color-success-light-active);
    }

    .${p}-warning {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning-light-active);
    }

    .${p}-danger {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger-light-active);
    }

    .${p}-full {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }

    .${p}-icon {
      display: inline-flex;
      flex-shrink: 0;
      margin: 2px 8px 0 0;
      font-size: 16px;
    }

    .${p}-info .${p}-icon {
      color: var(--semi-color-info);
    }

    .${p}-success .${p}-icon {
      color: var(--semi-color-success);
    }

    .${p}-warning .${p}-icon {
      color: var(--semi-color-warning);
    }

    .${p}-danger .${p}-icon {
      color: var(--semi-color-danger);
    }

    .${p}-content {
      flex: 1;
      min-width: 0;
    }

    .${p}-title {
      font-weight: 600;
    }

    .${p}-description {
      color: var(--semi-color-text-1);
    }

    .${p}-title + .${p}-description {
      margin-top: 2px;
    }

    .${p}-action {
      flex-shrink: 0;
      margin-left: 12px;
    }

    .${p}-close {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-left: 12px;
      padding: 0;
      color: var(--semi-color-text-3);
      font-size: 12px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-close:hover {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-fill-0);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-banner': SemiBanner
  }
}
