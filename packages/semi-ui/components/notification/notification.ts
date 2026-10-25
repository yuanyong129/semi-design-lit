import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import '../../../semi-icons/build/check-circle-fill';
import '../../../semi-icons/build/close-circle';
import '../../../semi-icons/build/exclamation-circle-fill';
import '../../../semi-icons/build/info-circle';
import '../../../semi-icons/build/close';

const prefixCls = getPrefixCls('notification');
const p = unsafeCSS(prefixCls);

export type NotificationType = 'default' | 'info' | 'success' | 'warning' | 'error';

@customElement('semi-notification')
export class SemiNotification extends LitElement {
  @property()
  type: NotificationType = 'info';

  @property()
  title: string = '';

  @property({ attribute: false })
  content?: string | TemplateResult;

  @property({ type: Boolean })
  closable: boolean = true;

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
      <div class="${prefixCls} ${prefixCls}-${this.type}" part="notification" role="alert">
        <span class="${prefixCls}-icon">${this._icon()}</span>
        <div class="${prefixCls}-body">
          ${this.title ? html`<div class="${prefixCls}-title">${this.title}</div>` : nothing}
          <div class="${prefixCls}-content"><slot>${this.content}</slot></div>
        </div>
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
      align-items: flex-start;
      box-sizing: border-box;
      width: 360px;
      max-width: calc(100vw - 32px);
      padding: 16px;
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
      margin: 2px 12px 0 0;
      font-size: 18px;
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

    .${p}-body {
      flex: 1;
      min-width: 0;
    }

    .${p}-title {
      margin-bottom: 4px;
      font-weight: 600;
    }

    .${p}-content {
      color: var(--semi-color-text-1);
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
    'semi-notification': SemiNotification
  }
}
