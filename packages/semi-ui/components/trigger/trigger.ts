import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import '../portal/portal';
import '../popup/popup';

const prefixCls = getPrefixCls('trigger');
const p = unsafeCSS(prefixCls);

export type TriggerType = 'hover' | 'click' | 'focus' | 'custom';
export type TriggerPosition = 'top' | 'bottom' | 'left' | 'right';
export type TriggerAlign = 'start' | 'center' | 'end';

@customElement('semi-trigger')
export class SemiTrigger extends LitElement {
  /**
   * @zh 瑙﹀彂鏂瑰紡
   * @en Trigger mode
   * @values 'hover','click','focus','custom'
   * @defaultValue 'hover'
   */
  @property()
  trigger: TriggerType = 'hover';

  /**
   * @zh 娴眰浣嶇疆
   * @en Popup position
   * @values 'top','bottom','left','right'
   * @defaultValue 'bottom'
   */
  @property()
  position: TriggerPosition = 'bottom';

  /**
   * @zh 瀵归綈鏂瑰紡
   * @en Popup alignment
   * @values 'start','center','end'
   * @defaultValue 'center'
   */
  @property()
  align: TriggerAlign = 'center';

  /**
   * @zh 娴眰鍐呭
   * @en Popup content
   */
  @property({ attribute: 'content' })
  content?: string | TemplateResult;

  /**
   * @zh 鏄惁鏄剧ず锛堝彈鎺э級
   * @en Whether the popup is open (controlled)
   */
  @property({ type: Boolean })
  open?: boolean;

  /**
   * @zh 榛樿鏄惁鏄剧ず
   * @en Whether the popup is open by default
   */
  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  /**
   * @zh 鏄惁绂佺敤
   * @en Whether the trigger is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 鏄惁鏄剧ず绠ご
   * @en Whether to show the arrow
   */
  @property({ attribute: 'show-arrow', type: Boolean })
  showArrow: boolean = true;

  /**
   * @zh 涓庤Е鍙戝厓绱犵殑闂磋窛
   * @en Offset from the trigger
   */
  @property({ type: Number })
  offset: number = 8;

  /**
   * @zh 娴眰鐨勬棤闅滅瑙掕壊
   * @en Accessible role of the popup
   */
  @property({ attribute: 'popup-role' })
  popupRole: string = 'dialog';

  /**
   * @zh 去掉 Popup 默认背景、边框与内边距
   * @en Remove Popup background, border and padding
   */
  @property({ attribute: 'popup-plain', type: Boolean })
  popupPlain: boolean = false;

  /**
   * @zh 鏄惁鎸?Esc 鍏抽棴
   * @en Whether to close on Escape
   */
  @property({ attribute: 'close-on-esc', type: Boolean })
  closeOnEsc: boolean = true;

  /**
   * @zh 鏄惁鐐瑰嚮澶栭儴鍏抽棴
   * @en Whether to close on outside click
   */
  @property({ attribute: 'close-on-outside-click', type: Boolean })
  closeOnOutsideClick: boolean = true;

  /**
   * @zh 鏄惁鑷姩璋冩暣浣嶇疆閬垮厤婧㈠嚭
   * @en Whether to auto adjust the position
   */
  @property({ attribute: 'auto-adjust', type: Boolean })
  autoAdjust: boolean = true;

  @property({ attribute: 'mouse-enter-delay', type: Number })
  mouseEnterDelay: number = 100;

  @property({ attribute: 'mouse-leave-delay', type: Number })
  mouseLeaveDelay: number = 100;

  @state()
  private _open: boolean = false;

  @query('.semi-trigger-popup')
  private _popup?: HTMLElement;

  private _openTimer?: ReturnType<typeof setTimeout>;
  private _closeTimer?: ReturnType<typeof setTimeout>;
  private _globalBound = false;

  connectedCallback() {
    super.connectedCallback();
    this._open = this.defaultOpen;
    this.addEventListener('mouseenter', this._handleMouseEnter);
    this.addEventListener('mouseleave', this._handleMouseLeave);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this._handleMouseEnter);
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    this._clearTimers();
    this._unbindGlobal();
  }

  private get _isOpen(): boolean {
    return this.open ?? this._open;
  }

  /** Open the popup programmatically. */
  show() {
    this._setOpen(true);
  }

  /** Close the popup programmatically. */
  hide() {
    this._setOpen(false);
  }

  private _clearTimers() {
    if (this._openTimer) clearTimeout(this._openTimer);
    if (this._closeTimer) clearTimeout(this._closeTimer);
    this._openTimer = undefined;
    this._closeTimer = undefined;
  }

  private _setOpen(open: boolean) {
    if (this._isOpen === open) return;
    if (this.open === undefined) {
      this._open = open;
    }
    this.dispatchEvent(new CustomEvent('openChange', {
      detail: { open },
      bubbles: true,
      composed: true,
    }));
  }

  private _scheduleOpen() {
    if (this.disabled) return;
    this._clearTimers();
    this._openTimer = setTimeout(() => this._setOpen(true), this.mouseEnterDelay);
  }

  private _scheduleClose() {
    this._clearTimers();
    this._closeTimer = setTimeout(() => this._setOpen(false), this.mouseLeaveDelay);
  }

  private _handleClick(ev: MouseEvent) {
    if (this.trigger !== 'click' || this.disabled) return;
    ev.stopPropagation();
    this._setOpen(!this._isOpen);
  }

  private _handleMouseEnter() {
    if (this.trigger !== 'hover' || this.disabled) return;
    this._scheduleOpen();
  }

  private _handleMouseLeave() {
    if (this.trigger !== 'hover' || this.disabled) return;
    this._scheduleClose();
  }

  private _handleFocusIn() {
    if (this.trigger !== 'focus' || this.disabled) return;
    this._setOpen(true);
  }

  private _handleFocusOut(ev: FocusEvent) {
    if (this.trigger !== 'focus' || this.disabled) return;
    const next = ev.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.shadowRoot?.contains(next))) return;
    this._setOpen(false);
  }

  private _handlePopupClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  private _onDocumentPointerDown = (ev: PointerEvent) => {
    if (!this._isOpen || !this.closeOnOutsideClick) return;
    if (ev.composedPath().includes(this)) return;
    this._setOpen(false);
  };

  private _onDocumentKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && this._isOpen && this.closeOnEsc) {
      this._setOpen(false);
    }
  };

  private _onViewportChange = () => {
    if (this._isOpen) this._positionPopup();
  };

  private _bindGlobal() {
    if (this._globalBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    window.addEventListener('resize', this._onViewportChange);
    window.addEventListener('scroll', this._onViewportChange, true);
    this._globalBound = true;
  }

  private _unbindGlobal() {
    if (!this._globalBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, true);
    this._globalBound = false;
  }

  protected updated() {
    if (this._isOpen) {
      this._bindGlobal();
      this._positionPopup();
      // Content/fonts may not be laid out during the first frame; reposition
      // once more without scheduling another Lit update.
      setTimeout(() => {
        if (this._isOpen) this._positionPopup();
      }, 0);
    } else {
      this._unbindGlobal();
    }
  }

  private _positionPopup() {
    const popup = this._popup;
    if (!popup) return;

    const triggerRect = this.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const width = popupRect.width;
    const height = popupRect.height;
    const viewportWidth = window.innerWidth || 1024;
    const viewportHeight = window.innerHeight || 768;
    const gap = this.offset;

    let position = this.position;
    if (this.autoAdjust) {
      if (position === 'bottom' && triggerRect.bottom + gap + height > viewportHeight && triggerRect.top - gap - height > 0) {
        position = 'top';
      } else if (position === 'top' && triggerRect.top - gap - height < 0 && triggerRect.bottom + gap + height < viewportHeight) {
        position = 'bottom';
      } else if (position === 'right' && triggerRect.right + gap + width > viewportWidth && triggerRect.left - gap - width > 0) {
        position = 'left';
      } else if (position === 'left' && triggerRect.left - gap - width < 0 && triggerRect.right + gap + width < viewportWidth) {
        position = 'right';
      }
    }

    let top = 0;
    let left = 0;

    if (position === 'top' || position === 'bottom') {
      top = position === 'bottom' ? triggerRect.bottom + gap : triggerRect.top - height - gap;
      if (this.align === 'start') left = triggerRect.left;
      else if (this.align === 'end') left = triggerRect.right - width;
      else left = triggerRect.left + triggerRect.width / 2 - width / 2;
    } else {
      left = position === 'right' ? triggerRect.right + gap : triggerRect.left - width - gap;
      if (this.align === 'start') top = triggerRect.top;
      else if (this.align === 'end') top = triggerRect.bottom - height;
      else top = triggerRect.top + triggerRect.height / 2 - height / 2;
    }

    left = Math.max(8, Math.min(left, viewportWidth - width - 8));
    top = Math.max(8, Math.min(top, viewportHeight - height - 8));

    popup.style.top = `${Math.round(top)}px`;
    popup.style.left = `${Math.round(left)}px`;
    popup.style.visibility = 'visible';
  }

  render() {
    const open = this._isOpen;

    return html`
      <span
        class="${prefixCls}"
        part="trigger"
        aria-expanded=${open ? 'true' : 'false'}
        aria-haspopup=${this.popupRole}
        @click=${this._handleClick}
        @focusin=${this._handleFocusIn}
        @focusout=${this._handleFocusOut}
      >
        <slot></slot>
      </span>
      <semi-portal .open=${open}>
        <div
          class="${prefixCls}-popup"
          style="visibility: hidden;"
          @click=${this._handlePopupClick}
          @mouseenter=${() => this._clearTimers()}
          @mouseleave=${this._handleMouseLeave}
        >
          <semi-popup
            .position=${this.position}
            .showArrow=${this.showArrow}
            .role=${this.popupRole}
            .plain=${this.popupPlain}
          >
            <slot name="content">${this.content ?? nothing}</slot>
          </semi-popup>
        </div>
      </semi-portal>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    .${p} {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }

    .${p}-popup {
      position: fixed;
      z-index: 1001;
      pointer-events: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-trigger': SemiTrigger
  }
}

