import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { collapsibleStyles } from './style/collapsible.style';

/**
 * A headless box that animates its height when opened or closed.
 *
 * Header, icons and keyboard interaction belong to `semi-collapse`.
 */
@customElement('semi-collapsible')
export class SemiCollapsible extends LitElement {
  /**
   * @zh 是否展开
   * @en Whether the box is open
   */
  @property({ type: Boolean, attribute: 'is-open', reflect: true })
  isOpen = false;

  /**
   * @zh 动画时长（毫秒）
   * @en Animation duration in milliseconds
   */
  @property({ type: Number })
  duration = 250;

  /**
   * @zh 是否启用动画
   * @en Whether motion is enabled
   */
  @property({ type: Boolean })
  motion = true;

  /**
   * @zh 关闭后是否保留 DOM
   * @en Whether to keep the DOM after closing
   */
  @property({ type: Boolean, attribute: 'keep-dom' })
  keepDOM = false;

  /**
   * @zh 是否延迟首次渲染
   * @en Whether to defer the first render
   */
  @property({ type: Boolean, attribute: 'lazy-render' })
  lazyRender = false;

  /**
   * @zh 关闭时是否淡出
   * @en Whether to fade out when closed
   */
  @property({ type: Boolean })
  fade = false;

  /**
   * @zh 关闭时保留的高度
   * @en Height kept when closed
   */
  @property({ type: Number, attribute: 'collapse-height' })
  collapseHeight = 0;

  /**
   * @zh 关闭高度是否不超过内容高度
   * @en Whether the collapsed height is limited by content height
   */
  @property({ type: Boolean, attribute: 'collapse-height-adaptive' })
  collapseHeightAdaptive = false;

  /**
   * @zh 强制重新测量的标识
   * @en Key that forces a re-measure
   */
  @property({ attribute: 're-calc-key' })
  reCalcKey?: number | string;

  @state()
  private _visible = false;

  @state()
  private _height: string | number = 0;

  @state()
  private _hasRendered = false;

  private _timer?: ReturnType<typeof setTimeout>;

  private _initialized = false;

  private _lastOpen = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._visible = this.isOpen;
    this._height = this.isOpen ? 'auto' : `${this.collapseHeight}px`;
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('isOpen') && this.isOpen) {
      this._visible = true;
    }
  }

  protected firstUpdated(): void {
    this._initialized = true;
    this._lastOpen = this.isOpen;
    this._visible = this.isOpen;
    this._height = this.isOpen ? 'auto' : `${this.collapseHeight}px`;
    this._hasRendered = this._visible;
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (!this._initialized) {
      return;
    }
    if (changed.has('isOpen')) {
      if (this.isOpen === this._lastOpen) {
        return;
      }
      this._lastOpen = this.isOpen;
      const open = this.isOpen;
      queueMicrotask(() => {
        if (this.isOpen === open) {
          this._animate(open);
        }
      });
      return;
    }
    if (changed.has('reCalcKey') && this.isOpen) {
      this._measureAndSetHeight();
    }
    if (this._shouldRenderContent() && !this._hasRendered) {
      this._hasRendered = true;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  private get _inner(): HTMLElement | null {
    return this.renderRoot.querySelector('.semi-collapsible-inner');
  }

  private _shouldRenderContent(): boolean {
    return (
      this.keepDOM ||
      this.collapseHeight !== 0 ||
      this._visible ||
      this.isOpen ||
      (this.lazyRender && this._hasRendered)
    );
  }

  private _closedHeight(): number {
    if (!this.collapseHeightAdaptive) {
      return this.collapseHeight;
    }
    const contentHeight = this._inner?.scrollHeight ?? this.collapseHeight;
    return Math.min(contentHeight, this.collapseHeight);
  }

  private _measureAndSetHeight(): void {
    if (!this.isOpen || !this._inner) {
      return;
    }
    this._height = `${this._inner.scrollHeight}px`;
  }

  private _animate(open: boolean): void {
    if (!this.motion || this.duration <= 0) {
      this._height = open ? 'auto' : `${this._closedHeight()}px`;
      if (open) {
        this._visible = true;
        this._hasRendered = true;
      } else if (!this.keepDOM) {
        this._visible = false;
      }
      this.dispatchEvent(new CustomEvent('motion-end', { bubbles: true, composed: true }));
      return;
    }

    if (open) {
      this._visible = true;
      this._hasRendered = true;
      void this.updateComplete.then(() => {
        if (!this.isConnected) {
          return;
        }
        requestAnimationFrame(() => {
          if (!this.isConnected) {
            return;
          }
          this._measureAndSetHeight();
          this._scheduleMotionEnd();
        });
      });
      return;
    }

    const currentHeight = this._inner?.getBoundingClientRect().height ?? this.collapseHeight;
    this._height = `${currentHeight}px`;
    void this.updateComplete.then(() => {
      if (!this.isConnected) {
        return;
      }
      requestAnimationFrame(() => {
        if (!this.isConnected) {
          return;
        }
        this._height = `${this._closedHeight()}px`;
        this._scheduleMotionEnd();
      });
    });
  }

  private _scheduleMotionEnd(): void {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => this._handleMotionEnd(), this.duration + 50);
  }

  private _handleMotionEnd = (): void => {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
    if (this.isOpen) {
      this._height = 'auto';
    } else {
      this._height = `${this._closedHeight()}px`;
      if (!this.keepDOM) {
        this._visible = false;
      }
    }
    this.dispatchEvent(new CustomEvent('motion-end', { bubbles: true, composed: true }));
  };

  private _handleTransitionEnd = (event: TransitionEvent): void => {
    if (event.target === event.currentTarget && event.propertyName === 'height') {
      this._handleMotionEnd();
    }
  };

  protected render() {
    const shouldRender = this._shouldRenderContent();
    const wrapperStyle = {
      height: typeof this._height === 'number' ? `${this._height}px` : this._height,
      opacity: this.isOpen || !this.fade || this.collapseHeight !== 0 ? 1 : 0,
      transitionDuration: this.motion ? `${this.duration}ms` : '0ms',
    };

    return html`
      <div
        class="semi-collapsible-wrapper"
        part="collapsible"
        style=${styleMap(wrapperStyle)}
        @transitionend=${this._handleTransitionEnd}
      >
        <div class="semi-collapsible-inner" id=${this.id || nothing}>
          ${shouldRender
            ? html`<slot></slot>`
            : nothing}
        </div>
      </div>
    `;
  }

  static styles = collapsibleStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-collapsible': SemiCollapsible;
  }
}
