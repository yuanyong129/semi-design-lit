import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import '../../../semi-icons/build/check-circle-fill';
import '../../../semi-icons/build/close-circle';
import '../../../semi-icons/build/exclamation-circle-fill';
import '../../../semi-icons/build/info-circle';
import '../../../semi-icons/build/close';

const prefixCls = getPrefixCls('toast');
const p = unsafeCSS(prefixCls);

export type ToastType = 'default' | 'info' | 'success' | 'warning' | 'error';

@customElement('semi-toast')
export class SemiToast extends LitElement {
  @property()
  type: ToastType = 'info';

  @property({ attribute: false })
  content?: string | TemplateResult;

  @property({ type: Boolean })
  closable: boolean = false;

  private _handleClose() {
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true,
    }));
  }

  private _icon() {
    switch (this.type) {
      case 'success':
        return html`<semi-icon-check-circle-fill></semi-icon-check-circle-fill>`;
      case 'warning':
        return html`<semi-icon-exclamation-circle-fill></semi-icon-exclamation-circle-fill>`;
      case 'error':
        return html`<semi-icon-close-circle></semi-icon-close-circle>`;
      case 'info':
        return html`<semi-icon-info-circle></semi-icon-info-circle>`;
      default:
        return nothing;
    }
  }

  render() {
    return html`
      <div class="${prefixCls} ${prefixCls}-${this.type}" part="toast" role="status">
        <span class="${prefixCls}-icon">${this._icon()}</span>
        <span class="${prefixCls}-content"><slot>${this.content}</slot></span>
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
      pointer-events: auto;
    }

    .${p} {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-width: 240px;
      max-width: 560px;
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

    .${p}-icon {
      display: inline-flex;
      flex-shrink: 0;
      margin-right: 8px;
      font-size: 16px;
    }

    .${p}-success .${p}-icon {
      color: var(--semi-color-success);
    }

    .${p}-info .${p}-icon {
      color: var(--semi-color-info);
    }

    .${p}-warning .${p}-icon {
      color: var(--semi-color-warning);
    }

    .${p}-error .${p}-icon {
      color: var(--semi-color-danger);
    }

    .${p}-content {
      flex: 1;
      min-width: 0;
    }

    .${p}-close {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-left: 8px;
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
    'semi-toast': SemiToast
  }
}
