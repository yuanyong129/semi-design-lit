import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../_components/resize-observer-v2';
import { DirectiveResult } from "lit/async-directive.js";
import { StyleInfo, StyleMapDirective } from "lit/directives/style-map.js";
import { getPrefixCls } from "../_utils/global-config";
import { createRef, ref } from "lit/directives/ref.js";
import { clsMap, handleClsList } from "../_utils/web-utils";
import { isObject } from "../_utils/is";
import { ThumbData } from "./interface";
import { signal } from "@lit-labs/signals";
import { when } from "lit/directives/when.js";
import { styles } from "./style/index.style";
import './thumb';

const prefixCls = getPrefixCls('scrollbar');

const THUMB_MIN_SIZE = 20;
const TRACK_SIZE = 15;

@customElement('semi-scrollbar')
export class SemiScrollbar extends LitElement {
  /**
   * @zh 类型
   * @en Type
   */
  @property()
  type: 'track' | 'embed' = 'embed';
  /**
   * @zh 外层的类名
   * @en Outer class
   */
  @property()
  outerClass?: string | string[];
  /**
   * @zh 外层的样式
   * @en Outer style
   */
  @property()
  outerStyle?: string | DirectiveResult<typeof StyleMapDirective>;
  // private
  @property({ type: Boolean })
  hide: boolean = false;
  @property({ type: Boolean })
  disableHorizontal: boolean = false;
  @property({ type: Boolean })
  disableVertical: boolean = false;

  containerRef = createRef<HTMLElement>();
  horizontalThumbRef = createRef<any>();
  verticalThumbRef = createRef<any>();
  horizontalData = signal<ThumbData | undefined>(undefined);
  verticalData = signal<ThumbData | undefined>(undefined);

  @state()
  _isBoth: boolean = false;
  @state()
  _hasHorizontalScrollbar: boolean = false;
  @state()
  _hasVerticalScrollbar: boolean = false;

  hasHorizontalScrollbar = () => this._hasHorizontalScrollbar && !this.disableHorizontal;
  hasVerticalScrollbar = () => this._hasVerticalScrollbar && !this.disableVertical;

  getContainerSize() {
    if (this.containerRef.value) {
      const {
        clientWidth,
        clientHeight,
        offsetWidth,
        offsetHeight,
        scrollWidth,
        scrollHeight,
        scrollTop,
        scrollLeft,
      } = this.containerRef.value;
      this._hasHorizontalScrollbar = scrollWidth > clientWidth;
      this._hasVerticalScrollbar = scrollHeight > clientHeight;
      this._isBoth =
        this.hasHorizontalScrollbar() && this.hasVerticalScrollbar();
      const horizontalTrackWidth =
        this.type === 'embed' && this._isBoth
          ? offsetWidth - TRACK_SIZE
          : offsetWidth;
      const verticalTrackHeight =
        this.type === 'embed' && this._isBoth
          ? offsetHeight - TRACK_SIZE
          : offsetHeight;

      const horizontalThumbWidth = Math.round(
        horizontalTrackWidth /
          Math.min(
            scrollWidth / clientWidth,
            horizontalTrackWidth / THUMB_MIN_SIZE
          )
      );
      const maxHorizontalOffset = horizontalTrackWidth - horizontalThumbWidth;
      const horizontalRatio = maxHorizontalOffset
        ? (scrollWidth - clientWidth) / maxHorizontalOffset
        : 1;
      const verticalThumbHeight = Math.round(
        verticalTrackHeight /
          Math.min(
            scrollHeight / clientHeight,
            verticalTrackHeight / THUMB_MIN_SIZE
          )
      );
      const maxVerticalOffset = verticalTrackHeight - verticalThumbHeight;
      const verticalRatio = maxVerticalOffset
        ? (scrollHeight - clientHeight) / maxVerticalOffset
        : 1;

      this.horizontalData.set({
        ratio: horizontalRatio,
        thumbSize: horizontalThumbWidth,
        max: maxHorizontalOffset,
      });

      this.verticalData.set({
        ratio: verticalRatio,
        thumbSize: verticalThumbHeight,
        max: maxVerticalOffset,
      });

      if (scrollTop > 0) {
        const verticalOffset = Math.round(
          scrollTop / (this.verticalData.get()?.ratio ?? 1)
        );
        this.verticalThumbRef.value?.setOffset(verticalOffset);
      }
      if (scrollLeft > 0) {
        const horizontalOffset = Math.round(
          scrollLeft / (this.horizontalData.get()?.ratio ?? 1)
        );
        this.horizontalThumbRef.value?.setOffset(horizontalOffset);
      }
    }
  };

  handleResize() {
    this.getContainerSize();
  };

  handleScroll = (ev: Event) => {
    if (ev.target !== this.containerRef.value) {
      return;
    }
    ev.stopPropagation();
    if (this.containerRef.value) {
      if (this.hasHorizontalScrollbar() && !this.disableHorizontal) {
        const horizontalOffset = Math.round(
          this.containerRef.value.scrollLeft / (this.horizontalData.get()?.ratio ?? 1)
        );
        this.horizontalThumbRef.value?.setOffset(horizontalOffset);
      }
      if (this.hasVerticalScrollbar() && !this.disableVertical) {
        const verticalOffset = Math.round(
          this.containerRef.value.scrollTop / (this.verticalData.get()?.ratio ?? 1)
        );
        this.verticalThumbRef.value?.setOffset(verticalOffset);
      }
    }
    this.dispatchEvent(
      new CustomEvent('scroll', {
        detail: ev,
        bubbles: true,
        composed: true,
      })
    );
  }

  handleHorizontalScroll(ev: CustomEvent<number>) {
    const offset = ev.detail;
    if (this.containerRef.value) {
      this.containerRef.value.scrollTo({
        left: offset * (this.horizontalData.get()?.ratio ?? 1),
      });
    }
  }

  handleVerticalScroll(ev: CustomEvent<number>) {
    const offset = ev.detail;
    if (this.containerRef.value) {
      this.containerRef.value.scrollTo({
        top: offset * (this.verticalData.get()?.ratio ?? 1),
      });
    }
  };

  _style() {
    const style: StyleInfo = {};
    if (this.type === 'track') {
      if (this.hasHorizontalScrollbar()) {
        style.paddingBottom = `${TRACK_SIZE}px`;
      }
      if (this.hasVerticalScrollbar()) {
        style.paddingRight = `${TRACK_SIZE}px`;
      }
    }
    return [style, this.outerStyle];
  };

  cls() {
    return handleClsList([
      `${prefixCls}`,
      `${prefixCls}-type-${this.type}`,
      clsMap({
        [`${prefixCls}-both`]: this._isBoth
      }),
      typeof this.outerClass === 'string' ? this.outerClass : this.outerClass?.join(' ') ?? '',
    ]);
  }

  /**
   * @zh 滚动
   * @en scrollTo
   * @public
   * @param {number | {left?: number;top?: number}} options
   * @param {number} y
   */
  _scrollTo(
    options?:
      | number
      | {
          left?: number;
          top?: number;
        },
    y?: number
  ) {
    if (isObject(options)) {
      (this.containerRef.value as HTMLElement)?.scrollTo(options);
    } else if (options || y) {
      (this.containerRef.value as HTMLElement)?.scrollTo(
        options as number,
        y as number
      );
    }
  }
  /**
   * @zh 纵向滚动
   * @en scroll vertically
   * @public
   * @param {number} top
   */
  _scrollTop(top: number) {
    (this.containerRef.value as HTMLElement)?.scrollTo({
      top,
    });
  }
  /**
   * @zh 横向滚动
   * @en scroll horizontal
   * @public
   * @param {number} left
   */
  _scrollLeft(left: number) {
    (this.containerRef.value as HTMLElement)?.scrollTo({
      left,
    });
  }

  protected firstUpdated(): void {
    this.getContainerSize();
  }

  render() {

    return html`
      <div class="${this.cls()}" part="semi-scrollbar">
        <resize-observer>
          <div
            ${ref(this.containerRef)}
            class="${prefixCls}-container"
            @scroll="${this.handleScroll}"
            style="${this.getAttribute('style')}"
          >
            <resize-observer @resize="${this.handleResize}">
              <slot></slot>
            </resize-observer>
          </div>
        </resize-observer>
        ${when(!this.hide && this.hasHorizontalScrollbar(), () => html`
          <semi-thumb
            ${ref(this.horizontalThumbRef)}
            .data="${this.horizontalData.get()}"
            direction="horizontal"
            .both="${this._isBoth}"
            @thumb-scroll="${this.handleHorizontalScroll}">
          </semi-thumb>`)}
        ${when(!this.hide && this.hasVerticalScrollbar(), () => html`
          <semi-thumb
            ${ref(this.verticalThumbRef)}
            .data="${this.verticalData.get()}"
            direction="vertical"
            .both="${this._isBoth}"
            @thumb-scroll="${this.handleVerticalScroll}"
          ></semi-thumb>`)}
      </div>
    `;
  }

  static styles = styles;
}

declare global {
   interface HTMLElementTagNameMap {
      'semi-scrollbar': SemiScrollbar
    }
}
