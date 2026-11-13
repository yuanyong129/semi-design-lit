import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { StyleInfo } from 'lit/directives/style-map.js';
import { carouselStyles } from './style/carousel.style';
import '../../../semi-icons/build/left';
import '../../../semi-icons/build/right';

export type CarouselIndicatorType = 'dot' | 'line' | 'slider';
export type CarouselIndicatorPosition = 'left' | 'center' | 'right';
export type CarouselShowArrow = 'hover' | 'always' | 'never';
export type CarouselTrigger = 'click' | 'hover';

function toSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * A lightweight carousel. Direct children are treated as slides.
 */
@customElement('semi-carousel')
export class SemiCarousel extends LitElement {
  /**
   * @zh 是否自动播放
   * @en Whether to autoplay
   */
  @property({ type: Boolean })
  autoplay = false;

  /**
   * @zh 自动播放间隔（毫秒）
   * @en Autoplay interval in milliseconds
   * @defaultValue 3000
   */
  @property({ type: Number })
  interval = 3000;

  /**
   * @zh 是否循环播放
   * @en Whether to loop
   */
  @property({ type: Boolean })
  loop = true;

  /**
   * @zh 鼠标悬停时暂停自动播放
   * @en Pause autoplay on hover
   */
  @property({ attribute: 'pause-on-hover', type: Boolean })
  pauseOnHover = true;

  /**
   * @zh 指示器类型
   * @en Indicator type
   * @defaultValue 'dot'
   */
  @property({ attribute: 'indicator-type' })
  indicatorType: CarouselIndicatorType = 'dot';

  /**
   * @zh 指示器位置
   * @en Indicator position
   * @defaultValue 'center'
   */
  @property({ attribute: 'indicator-position' })
  indicatorPosition: CarouselIndicatorPosition = 'center';

  /**
   * @zh 箭头显示方式
   * @en Arrow visibility
   * @defaultValue 'hover'
   */
  @property({ attribute: 'show-arrow' })
  showArrow: CarouselShowArrow = 'hover';

  /**
   * @zh 指示器触发方式
   * @en Indicator trigger
   * @defaultValue 'click'
   */
  @property()
  trigger: CarouselTrigger = 'click';

  /**
   * @zh 当前索引（受控）
   * @en Current index (controlled)
   */
  @property({ type: Number })
  current?: number;

  /**
   * @zh 默认索引
   * @en Default index
   */
  @property({ attribute: 'default-current', type: Number })
  defaultCurrent = 0;

  /**
   * @zh 高度
   * @en Height
   * @defaultValue 300
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === '') return value;
        const numeric = Number(value);
        return Number.isNaN(numeric) ? value : numeric;
      },
      toAttribute: (value: number | string) => String(value),
    },
  })
  height: number | string = 300;

  /**
   * @zh 切换动画时长（毫秒）
   * @en Transition duration in milliseconds
   * @defaultValue 400
   */
  @property({ type: Number })
  speed = 400;

  @state()
  private _current = 0;

  @state()
  private _count = 0;

  private _timer?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this._current = this.current ?? this.defaultCurrent;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopAutoplay();
  }

  private get _items(): HTMLElement[] {
    return Array.from(this.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement
    );
  }

  protected willUpdate(): void {
    this._count = this._items.length;
  }

  protected firstUpdated(): void {
    this._syncItems();
    this._restartAutoplay();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('current') && this.current !== undefined) {
      this._current = this.current;
    }
    if (changed.has('autoplay') || changed.has('interval')) {
      this._restartAutoplay();
    }
    this._syncItems();
  }

  private _syncItems(): void {
    const items = this._items;
    const count = items.length;
    if (this._current >= count) this._current = Math.max(0, count - 1);
    if (this._current < 0) this._current = 0;

    items.forEach((item, index) => {
      item.classList.add('semi-carousel-item');
      item.classList.toggle('semi-carousel-item-active', index === this._current);
      item.setAttribute('role', 'group');
      item.setAttribute('aria-roledescription', 'slide');
      item.setAttribute('aria-hidden', String(index !== this._current));
    });

    if (count !== this._count) this._count = count;
  }

  private _normalize(index: number): number {
    const count = this._items.length;
    if (!count) return 0;
    if (this.loop) return ((index % count) + count) % count;
    return Math.min(count - 1, Math.max(0, index));
  }

  /** Go to a slide by index. */
  goTo(index: number): void {
    const next = this._normalize(index);
    if (next === this._current) return;
    const prev = this._current;
    this._current = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { current: next, prev, item: this._items[next] },
      })
    );
    this._restartAutoplay();
  }

  /** Show the next slide. */
  next(): void {
    this.goTo(this._current + 1);
  }

  /** Show the previous slide. */
  prev(): void {
    this.goTo(this._current - 1);
  }

  private _restartAutoplay(): void {
    this._stopAutoplay();
    if (!this.autoplay || this._items.length < 2 || typeof window === 'undefined') return;
    this._timer = window.setInterval(() => this.next(), Math.max(500, this.interval));
  }

  private _stopAutoplay(): void {
    if (this._timer !== undefined) {
      window.clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  private _handleMouseEnter = (): void => {
    if (this.autoplay && this.pauseOnHover) this._stopAutoplay();
  };

  private _handleMouseLeave = (): void => {
    if (this.autoplay && this.pauseOnHover) this._restartAutoplay();
  };

  private _handleIndicator = (index: number): void => {
    if (this.trigger === 'hover') return;
    this.goTo(index);
  };

  private _handleIndicatorEnter = (index: number): void => {
    if (this.trigger === 'hover') this.goTo(index);
  };

  private _pluginsStyle(): StyleInfo {
    return {
      height: toSize(this.height),
      '--semi-carousel-speed': `${this.speed}ms`,
    };
  }

  protected render() {
    const count = this._count;
    return html`
      <div
        class="semi-carousel semi-carousel-arrow-${this.showArrow}"
        style=${styleMap(this._pluginsStyle())}
        part="carousel"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="semi-carousel-viewport">
          <slot @slotchange=${() => this._syncItems()}></slot>
        </div>

        ${count > 1 && this.showArrow !== 'never'
          ? html`
              <button
                class="semi-carousel-arrow semi-carousel-arrow-left"
                type="button"
                aria-label="上一张"
                @click=${() => this.prev()}
              >
                <semi-icon-left></semi-icon-left>
              </button>
              <button
                class="semi-carousel-arrow semi-carousel-arrow-right"
                type="button"
                aria-label="下一张"
                @click=${() => this.next()}
              >
                <semi-icon-right></semi-icon-right>
              </button>
            `
          : nothing}
        ${this._renderIndicators(count)}
      </div>
    `;
  }

  private _renderIndicators(count: number) {
    if (count <= 1) return nothing;
    if (this.indicatorType === 'slider') {
      return html`
        <div class="semi-carousel-slider semi-carousel-slider-${this.indicatorPosition}">
          <div
            class="semi-carousel-slider-bar"
            style=${styleMap({ width: `${((this._current + 1) / count) * 100}%` })}
          ></div>
        </div>
      `;
    }

    return html`
      <div
        class="semi-carousel-indicators semi-carousel-indicators-${this.indicatorPosition} semi-carousel-indicators-${this.indicatorType}"
        role="tablist"
      >
        ${Array.from({ length: count }).map(
          (_, index) => html`
            <button
              class="semi-carousel-indicator ${index === this._current ? 'semi-carousel-indicator-active' : ''}"
              type="button"
              role="tab"
              aria-selected=${String(index === this._current)}
              aria-label=${`第 ${index + 1} 张`}
              @click=${() => this._handleIndicator(index)}
              @mouseenter=${() => this._handleIndicatorEnter(index)}
            ></button>
          `
        )}
      </div>
    `;
  }

  static styles = carouselStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-carousel': SemiCarousel;
  }
}
