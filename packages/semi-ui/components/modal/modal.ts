import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ButtonTypes } from '../button/constants';
import { focusFirst, lockBodyScroll, trapTabKey, unlockBodyScroll } from '../_utils/overlay';
import { getPrefixCls } from '../_utils/global-config';
import '../portal/portal';
import '../button/button';
import '../../../semi-icons/build/close';

const prefixCls = getPrefixCls('modal');
const p = unsafeCSS(prefixCls);

export type ModalSize = 'small' | 'default' | 'medium' | 'large' | 'full-width';

@customElement('semi-modal')
export class SemiModal extends LitElement {
  /**
   * @zh 是否显示（受控）
   * @en Whether the modal is visible (controlled)
   */
  @property({ type: Boolean })
  visible?: boolean;

  /**
   * @zh 默认是否显示
   * @en Whether the modal is visible by default
   */
  @property({ attribute: 'default-visible', type: Boolean })
  defaultVisible: boolean = false;

  /**
   * @zh 标题
   * @en Title
   */
  @property()
  title: string = '';

  /**
   * @zh 尺寸
   * @en Size
   * @values 'small','default','medium','large','full-width'
   */
  @property()
  size: ModalSize = 'default';

  /**
   * @zh 自定义宽度
   * @en Custom width
   */
  @property()
  width?: number | string;

  /**
   * @zh 是否垂直居中
   * @en Whether to center vertically
   */
  @property({ type: Boolean })
  centered: boolean = true;

  /**
   * @zh 是否显示关闭按钮
   * @en Whether to show the close button
   */
  @property({ type: Boolean })
  closable: boolean = true;

  /**
   * @zh 点击遮罩是否关闭
   * @en Whether clicking the mask closes the modal
   */
  @property({ attribute: 'mask-closable', type: Boolean })
  maskClosable: boolean = true;

  /**
   * @zh 是否按 Esc 关闭
   * @en Whether to close on Escape
   */
  @property({ attribute: 'close-on-esc', type: Boolean })
  closeOnEsc: boolean = true;

  /**
   * @zh 确认按钮文字
   * @en OK button text
   */
  @property({ attribute: 'ok-text' })
  okText: string = '确定';

  /**
   * @zh 取消按钮文字
   * @en Cancel button text
   */
  @property({ attribute: 'cancel-text' })
  cancelText: string = '取消';

  /**
   * @zh 确认按钮类型
   * @en OK button type
   */
  @property({ attribute: 'ok-type' })
  okType: ButtonTypes = 'primary';

  /**
   * @zh 确认按钮 loading
   * @en Whether the OK button is loading
   */
  @property({ attribute: 'confirm-loading', type: Boolean })
  confirmLoading: boolean = false;

  /**
   * @zh 自定义 footer，设置为 false 时隐藏
   * @en Custom footer; set to false to hide it
   */
  @property({ attribute: false })
  footer?: TemplateResult | string | false;

  /**
   * @zh 点击确认回调，可返回 Promise
   * @en OK callback; may return a Promise
   */
  @property({ attribute: false })
  onOk?: (event: MouseEvent) => void | Promise<void>;

  @state()
  private _visible: boolean = false;

  @state()
  private _okLoading: boolean = false;

  @query('.semi-modal')
  private _dialog?: HTMLElement;

  private _opened = false;
  private _lastFocused: HTMLElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._visible = this.defaultVisible;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup();
  }

  private get _isVisible(): boolean {
    return this.visible ?? this._visible;
  }

  /** Open the modal programmatically. */
  show() {
    this._setVisible(true);
  }

  /** Close the modal programmatically. */
  hide() {
    this._setVisible(false);
  }

  private _setVisible(visible: boolean) {
    if (this._isVisible === visible) return;
    if (this.visible === undefined) {
      this._visible = visible;
    }
    this.dispatchEvent(new CustomEvent('openChange', {
      detail: { visible },
      bubbles: true,
      composed: true,
    }));
  }

  private _cleanup() {
    if (!this._opened) return;
    this._opened = false;
    unlockBodyScroll();
    document.removeEventListener('keydown', this._handleKeyDown, true);
    this._lastFocused?.focus?.();
    this._lastFocused = null;
  }

  protected updated() {
    if (this._isVisible && !this._opened) {
      this._opened = true;
      this._lastFocused = document.activeElement as HTMLElement;
      lockBodyScroll();
      document.addEventListener('keydown', this._handleKeyDown, true);
      this.updateComplete.then(() => {
        if (this._dialog) focusFirst(this._dialog);
      });
    } else if (!this._isVisible && this._opened) {
      this._cleanup();
      this.dispatchEvent(new CustomEvent('afterClose', {
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _handleKeyDown = (event: KeyboardEvent) => {
    if (!this._isVisible) return;
    if (event.key === 'Escape' && this.closeOnEsc) {
      event.preventDefault();
      this._setVisible(false);
      return;
    }
    if (this._dialog) {
      trapTabKey(event, this._dialog);
    }
  };

  private _handleMaskClick(event: MouseEvent) {
    if (event.target === event.currentTarget && this.maskClosable) {
      this._setVisible(false);
    }
  }

  private _handleClose(event: Event) {
    this._setVisible(false);
    this.dispatchEvent(new CustomEvent('close', {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleCancel(event: MouseEvent) {
    this.dispatchEvent(new CustomEvent('cancel', {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
    this._setVisible(false);
  }

  private async _handleOk(event: MouseEvent) {
    if (this._okLoading) return;
    this._okLoading = true;
    try {
      await this.onOk?.(event);
      this.dispatchEvent(new CustomEvent('ok', {
        detail: { event },
        bubbles: true,
        composed: true,
      }));
      this._setVisible(false);
    } finally {
      this._okLoading = false;
    }
  }

  private _widthStyle() {
    if (this.width === undefined) return {};
    const width =
      typeof this.width === 'number' || /^\d+$/.test(this.width)
        ? `${this.width}px`
        : this.width;
    return { width };
  }

  private _renderFooter() {
    if (this.footer === false) return nothing;
    if (this.footer !== undefined) return this.footer;
    return html`
      <div class="${prefixCls}-footer" part="footer">
        <semi-button @click=${(event: MouseEvent) => this._handleCancel(event)}>${this.cancelText}</semi-button>
        <semi-button
          type=${this.okType}
          theme="solid"
          ?loading=${this.confirmLoading || this._okLoading}
          @click=${(event: MouseEvent) => this._handleOk(event)}
        >${this.okText}</semi-button>
      </div>
    `;
  }

  render() {
    if (!this._isVisible && !this._opened) {
      return html`<semi-portal .open=${false}></semi-portal>`;
    }

    const maskClass = `${prefixCls}-mask ${this.centered ? `${prefixCls}-centered` : ''}`;
    const dialogClass = [prefixCls, `${prefixCls}-${this.size}`].join(' ');

    return html`
      <semi-portal .open=${this._isVisible}>
        <div class="${maskClass}" part="mask" @click=${this._handleMaskClick}>
          <div
            class="${dialogClass}"
            style="${styleMap(this._widthStyle())}"
            part="modal"
            role="dialog"
            aria-modal="true"
            aria-label=${this.title || nothing}
            tabindex="-1"
            @click=${(event: MouseEvent) => event.stopPropagation()}
          >
            <div class="${prefixCls}-header" part="header">
              <div class="${prefixCls}-title">
                <slot name="title">${this.title}</slot>
              </div>
              ${this.closable
                ? html`<button
                    class="${prefixCls}-close"
                    type="button"
                    aria-label="Close"
                    @click=${this._handleClose}
                  ><semi-icon-close></semi-icon-close></button>`
                : nothing}
            </div>
            <div class="${prefixCls}-body" part="body"><slot></slot></div>
            ${this.footer === undefined
              ? this._renderFooter()
              : html`<slot name="footer">${this._renderFooter()}</slot>`}
          </div>
        </div>
      </semi-portal>
    `;
  }

  static styles = css`
    .${p}-mask {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      box-sizing: border-box;
      padding: 80px 16px 24px;
      overflow: auto;
      background-color: var(--semi-color-overlay-bg, rgba(0, 0, 0, 0.45));
      pointer-events: auto;
    }

    .${p}-centered {
      align-items: center;
      padding: 24px 16px;
    }

    .${p} {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 520px;
      max-width: 100%;
      max-height: calc(100vh - 48px);
      background-color: var(--semi-color-bg-2);
      border-radius: var(--semi-border-radius-large, 8px);
      box-shadow: var(--semi-shadow-elevated);
      outline: none;
    }

    .${p}-small {
      width: 400px;
    }

    .${p}-medium {
      width: 720px;
    }

    .${p}-large {
      width: 920px;
    }

    .${p}-full-width {
      width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
    }

    .${p}-header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 8px;
    }

    .${p}-title {
      flex: 1;
      min-width: 0;
      color: var(--semi-color-text-0);
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
    }

    .${p}-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-left: 12px;
      padding: 0;
      color: var(--semi-color-text-2);
      font-size: 16px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-close:hover {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-fill-0);
    }

    .${p}-body {
      flex: 1;
      min-height: 0;
      padding: 12px 24px 20px;
      overflow: auto;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 1.6;
    }

    .${p}-footer {
      display: flex;
      flex-shrink: 0;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px;
      border-top: 1px solid var(--semi-color-border);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-modal': SemiModal
  }
}
