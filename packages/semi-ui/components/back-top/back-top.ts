import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { BackTopClickDetail, BackTopTarget } from './interface';
import { backTopStyles } from './style/back-top.style';
import '../../../semi-icons/build/right';

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * A floating button that scrolls the target back to the top.
 */
@customElement('semi-back-top')
export class SemiBackTop extends LitElement {
  /**
   * @zh 滚动容器，默认为 window
   * @en Scroll container, defaults to window
   */
  @property()
  target?: BackTopTarget = () => window;

  /**
   * @zh 出现的高度阈值
   * @en Scroll threshold for showing the button
   */
  @property({ type: Number, attribute: 'visibility-height' })
  visibilityHeight = 400;

  /**
   * @zh 滚动动画时长（毫秒）
   * @en Scroll animation duration in milliseconds
   */
  @property({ type: Number })
  duration = 450;

  @state()
  private _visible = false;

  private _target: HTMLElement | Window | null = null;

  private _frame = 0;

  private _animationFrame = 0;

  protected firstUpdated(): void {
    this._bindTarget();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('target')) {
      this._bindTarget();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unbindTarget();
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = 0;
    }
  }

  private _resolveTarget(): HTMLElement | Window | null {
    const raw = this.target;
    let resolved: HTMLElement | Window | null | undefined;
    if (typeof raw === 'function') {
      resolved = raw();
    } else if (typeof raw === 'string') {
      const root = this.getRootNode() as Document | ShadowRoot;
      resolved = root.querySelector<HTMLElement>(raw) ?? document.querySelector<HTMLElement>(raw);
    } else {
      resolved = raw;
    }
    if (!resolved && typeof window !== 'undefined') {
      resolved = window;
    }
    return resolved ?? null;
  }

  private _bindTarget(): void {
    this._unbindTarget();
    this._target = this._resolveTarget();
    if (this._target) {
      this._target.addEventListener('scroll', this._handleScroll, { passive: true });
      this._handleScroll();
    }
  }

  private _unbindTarget(): void {
    if (this._target) {
      this._target.removeEventListener('scroll', this._handleScroll);
      this._target = null;
    }
    if (this._frame) {
      cancelAnimationFrame(this._frame);
      this._frame = 0;
    }
  }

  private _getScrollTop(): number {
    if (this._target === window) {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    return this._target ? (this._target as HTMLElement).scrollTop : 0;
  }

  private _setScrollTop(top: number): void {
    if (this._target === window) {
      document.body.scrollTop = top;
      document.documentElement.scrollTop = top;
      return;
    }
    if (this._target) {
      (this._target as HTMLElement).scrollTop = top;
    }
  }

  private _handleScroll = (): void => {
    if (this._frame) {
      return;
    }
    this._frame = requestAnimationFrame(() => {
      this._frame = 0;
      this._visible = this._getScrollTop() > this.visibilityHeight;
    });
  };

  private _scrollToTop = (): void => {
    if (!this._target) {
      return;
    }
    const from = this._getScrollTop();
    if (from <= 0) {
      this._visible = false;
      return;
    }
    if (this.duration <= 0) {
      this._setScrollTop(0);
      this._visible = false;
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / this.duration);
      this._setScrollTop(from * (1 - easeInOutCubic(progress)));
      if (progress < 1) {
        this._animationFrame = requestAnimationFrame(step);
      } else {
        this._animationFrame = 0;
        this._setScrollTop(0);
        this._visible = false;
      }
    };
    this._animationFrame = requestAnimationFrame(step);
  };

  private _handleClick = (): void => {
    const detail: BackTopClickDetail | null = this._target ? { target: this._target } : null;
    if (detail) {
      this.dispatchEvent(new CustomEvent('back-top-click', { detail, bubbles: true, composed: true }));
    }
    this._scrollToTop();
  };

  protected render() {
    if (!this._visible) {
      return nothing;
    }
    return html`
      <button
        class="semi-back-top"
        type="button"
        part="back-top"
        aria-label="回到顶部"
        @click=${this._handleClick}
      >
        <slot>
          <semi-icon-right aria-hidden="true"></semi-icon-right>
        </slot>
      </button>
    `;
  }

  static styles = backTopStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-back-top': SemiBackTop;
  }
}
