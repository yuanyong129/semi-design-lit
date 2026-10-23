import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * Portal 以“顶层浮层”方式渲染内容。
 *
 * Lit 的 context 基于 DOM 继承，直接把节点移动到 body 会丢失 ConfigProvider /
 * LocaleProvider 等上下文。因此 Portal 保留原始 DOM 位置，在支持的浏览器中使用
 * Popover 顶层能力（top layer），不支持时退回 fixed 定位。
 */
@customElement('semi-portal')
export class SemiPortal extends LitElement {
  /**
   * @zh 是否显示
   * @en Whether the portal is open
   */
  @property({ type: Boolean })
  open: boolean = true;

  /**
   * @zh 是否禁用顶层渲染
   * @en Whether to disable top-layer rendering
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  @query('.semi-portal')
  private _surface?: HTMLElement;

  private _popped = false;

  protected updated() {
    this._syncPopover();
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => this._syncPopover());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._hidePopover();
  }

  private _syncPopover() {
    const surface = this._surface;
    if (!surface) return;

    if (this.open) {
      surface.removeAttribute('hidden');
      if (!this.disabled) {
        this._showPopover();
      }
    } else {
      this._hidePopover();
      surface.setAttribute('hidden', '');
    }
  }

  private _showPopover() {
    const surface = this._surface;
    if (!surface || this._popped || !('showPopover' in surface)) return;
    try {
      surface.showPopover();
      this._popped = true;
    } catch {
      this._popped = false;
    }
  }

  private _hidePopover() {
    const surface = this._surface;
    if (!surface || !this._popped || !('hidePopover' in surface)) return;
    try {
      surface.hidePopover();
    } catch {
      // Ignore browsers that already closed the popover.
    }
    this._popped = false;
  }

  render() {
    return html`
      <div class="semi-portal" part="portal" popover="manual">
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }

    .semi-portal {
      position: fixed;
      inset: 0;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      overflow: visible;
      background: transparent;
      border: 0;
      pointer-events: none;
      z-index: 1000;
    }

    .semi-portal[hidden] {
      display: none;
    }

    ::slotted(*) {
      pointer-events: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-portal': SemiPortal
  }
}
