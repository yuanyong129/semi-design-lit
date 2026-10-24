import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TriggerPosition } from '../trigger/trigger';
import '../trigger/trigger';
import '../button/button';

@customElement('semi-popconfirm')
export class SemiPopconfirm extends LitElement {
  /**
   * @zh 标题
   * @en Title
   */
  @property()
  title: string = '确认';

  /**
   * @zh 内容
   * @en Content
   */
  @property()
  content: string = '确定要执行此操作吗？';

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
   * @zh 出现位置
   * @en Position
   */
  @property()
  position: TriggerPosition = 'top';

  /**
   * @zh 是否禁用
   * @en Whether the popconfirm is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ attribute: 'show-arrow', type: Boolean })
  showArrow: boolean = true;

  /**
   * @zh 点击确认回调，可返回 Promise 显示 loading
   * @en OK callback; return a Promise to show loading
   */
  @property({ attribute: false })
  onOk?: (event: MouseEvent) => void | Promise<void>;

  @state()
  private _okLoading: boolean = false;

  private _close() {
    (this.shadowRoot?.querySelector('semi-trigger') as any)?.hide();
  }

  private _handleCancel(event: MouseEvent) {
    this._close();
    this.dispatchEvent(new CustomEvent('cancel', {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
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
      this._close();
    } finally {
      this._okLoading = false;
    }
  }

  private _renderContent() {
    return html`
      <div style="max-width: 260px;">
        <div style="margin-bottom: 8px; font-weight: 600;">${this.title}</div>
        <div style="margin-bottom: 16px; color: var(--semi-color-text-2);">${this.content}</div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <semi-button size="small" @click=${(event: MouseEvent) => this._handleCancel(event)}>${this.cancelText}</semi-button>
          <semi-button
            type="primary"
            theme="solid"
            size="small"
            ?loading=${this._okLoading}
            @click=${(event: MouseEvent) => this._handleOk(event)}
          >${this.okText}</semi-button>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <semi-trigger
        trigger="click"
        .position=${this.position}
        .content=${this._renderContent()}
        .disabled=${this.disabled}
        .showArrow=${this.showArrow}
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
    'semi-popconfirm': SemiPopconfirm
  }
}
