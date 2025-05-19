import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../_components/resize-observer-v2';
import { ClassMapDirective } from "lit/directives/class-map.js";
import { DirectiveResult } from "lit/async-directive.js";
import { StyleInfo, StyleMapDirective } from "lit/directives/style-map.js";
import { getPrefixCls } from "../_utils/global-config";
import { createRef, ref } from "lit/directives/ref.js";
import { handleClsList } from "../_utils/web-utils";
import { isObject } from "../_utils/is";
import { ThumbData } from "./interface";
import { signal } from "@lit-labs/signals";
import './thumb';

const prefixCls = getPrefixCls('scrollbar');
const containerRef = createRef<HTMLElement>();
const horizontalThumbRef = createRef<any>();
const verticalThumbRef = createRef<any>();
const horizontalData = signal<ThumbData | undefined>(undefined);
const verticalData = signal<ThumbData | undefined>(undefined);

const THUMB_MIN_SIZE = 20;
const TRACK_SIZE = 15;

@customElement('a-scrollbar')
export class ArcoScrollbar extends LitElement {
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
  outerClass?: string | DirectiveResult<typeof ClassMapDirective> | string[];
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

  @state()
  _isBoth: boolean = false;
  @state()
  _hasHorizontalScrollbar: boolean = false;
  @state()
  _hasVerticalScrollbar: boolean = false;
 
  hasHorizontalScrollbar = () => this._hasHorizontalScrollbar && !this.disableHorizontal;
  hasVerticalScrollbar = () => this._hasVerticalScrollbar && !this.disableVertical;

  getContainerSize() {
    if (containerRef.value) {
      const {
        clientWidth,
        clientHeight,
        offsetWidth,
        offsetHeight,
        scrollWidth,
        scrollHeight,
        scrollTop,
        scrollLeft,
      } = containerRef.value;
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
      const horizontalRatio =
        (scrollWidth - clientWidth) / maxHorizontalOffset;
      const verticalThumbHeight = Math.round(
        verticalTrackHeight /
          Math.min(
            scrollHeight / clientHeight,
            verticalTrackHeight / THUMB_MIN_SIZE
          )
      );
      const maxVerticalOffset = verticalTrackHeight - verticalThumbHeight;
      const verticalRatio = (scrollHeight - clientHeight) / maxVerticalOffset;

      horizontalData.set({
        ratio: horizontalRatio,
        thumbSize: horizontalThumbWidth,
        max: maxHorizontalOffset,
      });

      verticalData.set({
        ratio: verticalRatio,
        thumbSize: verticalThumbHeight,
        max: maxVerticalOffset,
      });

      if (scrollTop > 0) {
        const verticalOffset = Math.round(
          scrollTop / (verticalData.get()?.ratio ?? 1)
        );
        verticalThumbRef.value?.setOffset(verticalOffset);
      }
      if (scrollLeft > 0) {
        const horizontalOffset = Math.round(
          scrollLeft / (verticalData.get()?.ratio ?? 1)
        );
        horizontalThumbRef.value?.setOffset(horizontalOffset);
      }
    }
  };

  handleResize() {
    this.getContainerSize();
  };

  handleScroll = (ev: Event) => {
    ev.stopPropagation();
    if (containerRef.value) {
      if (this.hasHorizontalScrollbar() && !this.disableHorizontal) {
        const horizontalOffset = Math.round(
          containerRef.value.scrollLeft / (horizontalData.get()?.ratio ?? 1)
        );
        horizontalThumbRef.value?.setOffset(horizontalOffset);
      }
      if (this.hasVerticalScrollbar() && !this.disableVertical) {
        const verticalOffset = Math.round(
          containerRef.value.scrollTop / (verticalData.get()?.ratio ?? 1)
        );
        verticalThumbRef.value?.setOffset(verticalOffset);
      }
    }
    this.dispatchEvent(new CustomEvent('scroll', ev));
  }

  handleHorizontalScroll(offset: number) {
    if (containerRef.value) {
      containerRef.value.scrollTo({
        left: offset * (horizontalData.get()?.ratio ?? 1),
      });
    }
  }

  handleVerticalScroll(offset: number) {
    if (containerRef.value) {
      containerRef.value.scrollTo({
        top: offset * (verticalData.get()?.ratio ?? 1),
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
      this._isBoth ? `${prefixCls}-both` : '',
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
      (containerRef.value as HTMLElement)?.scrollTo(options);
    } else if (options || y) {
      (containerRef.value as HTMLElement)?.scrollTo(
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
   * @version 2.40.0
   */
  _scrollTop(top: number) {
    (containerRef.value as HTMLElement)?.scrollTo({
      top,
    });
  }
  /**
   * @zh 横向滚动
   * @en scroll horizontal
   * @public
   * @param {number} left
   * @version 2.40.0
   */
  _scrollLeft(left: number) {
    (containerRef.value as HTMLElement)?.scrollTo({
      left,
    });
  }

  protected firstUpdated(): void {
    this.getContainerSize();
  }

  render() {
    this.style.display = 'block';
    return html`
      <div class="${this.outerClass}">
        <resize-observer>
          <div
            ${ref(containerRef)}
            class="${prefixCls}-container"
            @scroll="handleScroll"
          >
            <resize-observer @resize="handleResize">
              <slot></slot>
            </resize-observer>
          </div>
        </resize-observer>
      </div>
    `;
  }
}

declare global {
   interface HTMLElementTagNameMap {
      'a-scrollbar': ArcoScrollbar
    }
}
