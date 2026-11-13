import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  ResizableChangeDetail,
  ResizableDirection,
  ResizableEnable,
  ResizableHandleClass,
  ResizableHandleNode,
  ResizableHandleStyle,
  ResizableSize,
  ResizableSnap,
  ResizeCallback,
  ResizeStartCallback,
} from './interface';

const DIRECTIONS: ResizableDirection[] = [
  'top',
  'right',
  'bottom',
  'left',
  'topRight',
  'bottomRight',
  'bottomLeft',
  'topLeft',
];

const DEFAULT_ENABLE: ResizableEnable = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
};

type ResizeEvent = MouseEvent | TouchEvent;

interface BoundaryRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(Math.min(value, max), min);

const snapNumber = (value: number, size: number): number =>
  Math.round(value / size) * size;

const findNextSnap = (value: number, points: number[], gap = 0): number => {
  if (!points.length) return value;
  const closest = points.reduce(
    (previous, current) =>
      Math.abs(current - value) < Math.abs(points[previous] - value) ? points.indexOf(current) : previous,
    0
  );
  const distance = Math.abs(points[closest] - value);
  return gap === 0 || distance < gap ? points[closest] : value;
};

const toPx = (value: string | number | undefined): string =>
  typeof value === 'number' ? `${value}px` : value ?? '';

/**
 * A container whose size can be changed by dragging its edges and corners.
 */
@customElement('semi-resizable')
export class SemiResizable extends LitElement {
  /**
   * @zh 受控尺寸，支持 px、百分比、vw、vh
   * @en Controlled size, supporting px, percentages, vw and vh
   */
  @property({ attribute: false })
  size?: ResizableSize;

  /**
   * @zh 非受控初始尺寸
   * @en Initial uncontrolled size
   */
  @property({ attribute: false })
  defaultSize?: ResizableSize;

  /**
   * @zh 网格步长
   * @en Grid step
   */
  @property({ attribute: false })
  grid: [number, number] = [1, 1];

  /**
   * @zh 吸附尺寸
   * @en Snap points
   */
  @property({ attribute: false })
  snap?: ResizableSnap;

  /**
   * @zh 吸附容差
   * @en Snap gap
   */
  @property({ attribute: 'snap-gap', type: Number })
  snapGap = 0;

  /**
   * @zh 约束边界
   * @en Boundary element
   */
  @property({ attribute: false })
  boundElement?: 'parent' | 'window' | HTMLElement;

  /**
   * @zh 是否按拖拽方向计算边界
   * @en Whether to constrain according to the drag direction
   */
  @property({ attribute: 'bounds-by-direction', type: Boolean })
  boundsByDirection = false;

  @property({ attribute: 'min-width' })
  minWidth?: string | number;

  @property({ attribute: 'min-height' })
  minHeight?: string | number;

  @property({ attribute: 'max-width' })
  maxWidth?: string | number;

  @property({ attribute: 'max-height' })
  maxHeight?: string | number;

  /**
   * @zh 锁定宽高比，传入数字时作为比例
   * @en Lock the aspect ratio; a number is used as the ratio
   */
  @property({
    attribute: 'lock-aspect-ratio',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null) return false;
        if (value === '' || value === 'true') return true;
        if (value === 'false') return false;
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : true;
      },
      toAttribute: (value: boolean | number) => (value === false ? null : String(value)),
    },
  })
  lockAspectRatio: boolean | number = false;

  @property({ attribute: 'lock-aspect-ratio-extra-width', type: Number })
  lockAspectRatioExtraWidth = 0;

  @property({ attribute: 'lock-aspect-ratio-extra-height', type: Number })
  lockAspectRatioExtraHeight = 0;

  /**
   * @zh 启用的拖拽方向；false 隐藏全部手柄
   * @en Enabled resize directions; false hides all handles
   */
  @property({ attribute: false })
  enable: ResizableEnable | false = DEFAULT_ENABLE;

  @property({ attribute: false })
  handleStyle?: ResizableHandleStyle;

  @property({ attribute: false })
  handleClass?: ResizableHandleClass;

  @property({ attribute: false })
  handleNode?: ResizableHandleNode;

  @property({ attribute: false })
  handleWrapperStyle?: Record<string, string | number>;

  @property({ attribute: 'handle-wrapper-class' })
  handleWrapperClass = '';

  /**
   * @zh 缩放系数
   * @en Scale factor
   */
  @property({ type: Number })
  scale = 1;

  /**
   * @zh 宽高变化倍率
   * @en Resize ratio
   */
  @property({ attribute: false })
  ratio: number | [number, number] = 1;

  @property({ attribute: false })
  onResizeStart?: ResizeStartCallback;

  @property({ attribute: false })
  onChange?: ResizeCallback;

  @property({ attribute: false })
  onResizeEnd?: ResizeCallback;

  private _width: string | number = 'auto';
  private _height: string | number = 'auto';
  private _resizing = false;
  private _direction: ResizableDirection = 'right';
  private _cursor = 'auto';
  private _type: 'mouse' | 'touch' = 'mouse';
  private _original = { x: 0, y: 0, width: 0, height: 0 };
  private _aspectRatio = 1;
  private _flexBasis?: string | number;
  private _flexDirection?: 'row' | 'column';
  private _boundary: BoundaryRect = { left: 0, top: 0, right: 0, bottom: 0 };

  constructor() {
    super();
    this._width = this.size?.width ?? this.defaultSize?.width ?? 'auto';
    this._height = this.size?.height ?? this.defaultSize?.height ?? 'auto';
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('semi-resizable-resizable');
  }

  disconnectedCallback(): void {
    this._unregisterEvents();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('size') || changed.has('defaultSize')) {
      this._width = this.size?.width ?? this.defaultSize?.width ?? 'auto';
      this._height = this.size?.height ?? this.defaultSize?.height ?? 'auto';
    }
  }

  protected updated(): void {
    this._applyHostStyle();
  }

  private _applyHostStyle(): void {
    const width = this.size?.width ?? this._width;
    const height = this.size?.height ?? this._height;
    this.style.width = width === 'auto' || width === undefined ? 'auto' : toPx(width);
    this.style.height = height === 'auto' || height === undefined ? 'auto' : toPx(height);
    this.style.minWidth = toPx(this.minWidth);
    this.style.minHeight = toPx(this.minHeight);
    this.style.maxWidth = toPx(this.maxWidth);
    this.style.maxHeight = toPx(this.maxHeight);
    this.style.userSelect = this._resizing ? 'none' : '';
    if (this._flexBasis !== undefined) {
      this.style.flexBasis = toPx(this._flexBasis);
    } else {
      this.style.flexBasis = '';
    }
  }

  private _parentSize(): { width: number; height: number } {
    const parent = this.parentElement;
    if (parent) {
      const width = parent.clientWidth || parent.offsetWidth;
      const height = parent.clientHeight || parent.offsetHeight;
      if (width || height) return { width, height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }

  private _numberSize(
    value: string | number | undefined,
    parentSize: number,
    innerWidth: number,
    innerHeight: number
  ): number | undefined {
    if (typeof value === 'undefined' || value === 'auto') return undefined;
    if (typeof value === 'number') return value;
    if (value.endsWith('px')) return Number(value.slice(0, -2));
    if (value.endsWith('%')) return (Number(value.slice(0, -1)) / 100) * parentSize;
    if (value.endsWith('vw')) return (Number(value.slice(0, -2)) / 100) * innerWidth;
    if (value.endsWith('vh')) return (Number(value.slice(0, -2)) / 100) * innerHeight;
    return Number(value);
  }

  private _parentRect(): BoundaryRect {
    const parent = this.parentElement;
    if (!parent) {
      return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    }
    const rect = parent.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
  }

  private _setBoundary(): void {
    const rect = this.getBoundingClientRect();
    this._boundary = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
  }

  private _boundaryMax(
    maxWidth: number | undefined,
    maxHeight: number | undefined
  ): { width?: number; height?: number } {
    let width = maxWidth;
    let height = maxHeight;
    const parentSize = this._parentSize();
    const rect = this._boundary;
    const parent = this.parentElement;
    const direction = this._direction.toLowerCase();

    if (this.boundElement === 'parent' && parent) {
      const parentRect = this._parentRect();
      const widthConstraint = this.boundsByDirection && direction.includes('left')
        ? rect.right - parentRect.left
        : parentSize.width - Math.max(0, rect.left - parentRect.left);
      const heightConstraint = this.boundsByDirection && direction.includes('top')
        ? rect.bottom - parentRect.top
        : parentSize.height - Math.max(0, rect.top - parentRect.top);
      width = width === undefined ? widthConstraint : Math.min(width, widthConstraint);
      height = height === undefined ? heightConstraint : Math.min(height, heightConstraint);
    } else if (this.boundElement === 'window') {
      const widthConstraint = this.boundsByDirection && direction.includes('left')
        ? rect.right
        : window.innerWidth - Math.max(0, rect.left);
      const heightConstraint = this.boundsByDirection && direction.includes('top')
        ? rect.bottom
        : window.innerHeight - Math.max(0, rect.top);
      width = width === undefined ? widthConstraint : Math.min(width, widthConstraint);
      height = height === undefined ? heightConstraint : Math.min(height, heightConstraint);
    } else if (this.boundElement instanceof HTMLElement) {
      const bound = this.boundElement.getBoundingClientRect();
      const widthConstraint = this.boundsByDirection && direction.includes('left')
        ? rect.right - bound.left
        : bound.width - Math.max(0, rect.left - bound.left);
      const heightConstraint = this.boundsByDirection && direction.includes('top')
        ? rect.bottom - bound.top
        : bound.height - Math.max(0, rect.top - bound.top);
      width = width === undefined ? widthConstraint : Math.min(width, widthConstraint);
      height = height === undefined ? heightConstraint : Math.min(height, heightConstraint);
    }

    return { width, height };
  }

  private _eventPoint(event: ResizeEvent): { x: number; y: number } {
    if ('touches' in event && event.touches.length) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    const mouse = event as MouseEvent;
    return { x: mouse.clientX, y: mouse.clientY };
  }

  private _startResize(event: ResizeEvent, direction: ResizableDirection): void {
    if (this._resizing) return;
    if (this.enable === false) return;
    if (this.enable && this.enable[direction] === false) return;

    if (this.onResizeStart?.(event, direction) === false) return;

    const point = this._eventPoint(event);
    const rect = this.getBoundingClientRect();
    const width = this.offsetWidth || rect.width || this._numberSize(this._width, this._parentSize().width, window.innerWidth, window.innerHeight) || 0;
    const height = this.offsetHeight || rect.height || this._numberSize(this._height, this._parentSize().height, window.innerWidth, window.innerHeight) || 0;

    this._type = 'touch' in event ? 'touch' : 'mouse';
    this._direction = direction;
    this._aspectRatio =
      typeof this.lockAspectRatio === 'number'
        ? this.lockAspectRatio
        : height
          ? width / height
          : 1;
    this._original = { ...point, width, height };
    this._setBoundary();
    this._cursor =
      typeof window !== 'undefined'
        ? window.getComputedStyle(event.target as Element).cursor || 'auto'
        : 'auto';

    const computed = window.getComputedStyle(this);
    if (computed.flexBasis && computed.flexBasis !== 'auto') {
      const parent = this.parentElement;
      if (parent) {
        const parentStyle = window.getComputedStyle(parent);
        this._flexDirection = parentStyle.flexDirection.startsWith('row') ? 'row' : 'column';
        this._flexBasis = computed.flexBasis;
      }
    }

    this._resizing = true;
    this._registerEvents();
    event.preventDefault();
    this.requestUpdate();
    this._applyHostStyle();
  }

  private _directionSize(clientX: number, clientY: number): { width: number; height: number } {
    const scale = this.scale || 1;
    const [ratioX, ratioY] = Array.isArray(this.ratio) ? this.ratio : [this.ratio, this.ratio];
    const direction = this._direction.toLowerCase();
    const original = this._original;
    let width = original.width;
    let height = original.height;

    const calculateWidth = (deltaX: number) => original.width + (deltaX * ratioX) / scale;
    const calculateHeight = (deltaY: number) => original.height + (deltaY * ratioY) / scale;

    if (direction.includes('top')) {
      height = calculateHeight(original.y - clientY);
      if (this.lockAspectRatio) {
        width = (height - this.lockAspectRatioExtraHeight) * this._aspectRatio + this.lockAspectRatioExtraWidth;
      }
    }
    if (direction.includes('bottom')) {
      height = calculateHeight(clientY - original.y);
      if (this.lockAspectRatio) {
        width = (height - this.lockAspectRatioExtraHeight) * this._aspectRatio + this.lockAspectRatioExtraWidth;
      }
    }
    if (direction.includes('right')) {
      width = calculateWidth(clientX - original.x);
      if (this.lockAspectRatio) {
        height = (width - this.lockAspectRatioExtraWidth) / this._aspectRatio + this.lockAspectRatioExtraHeight;
      }
    }
    if (direction.includes('left')) {
      width = calculateWidth(original.x - clientX);
      if (this.lockAspectRatio) {
        height = (width - this.lockAspectRatioExtraWidth) / this._aspectRatio + this.lockAspectRatioExtraHeight;
      }
    }

    return { width, height };
  }

  private _aspectSize(
    width: number,
    height: number,
    max: { width?: number; height?: number },
    min: { width?: number; height?: number }
  ): { width: number; height: number } {
    const minWidth = min.width ?? 10;
    const maxWidth = max.width === undefined || max.width < 0 ? width : max.width;
    const minHeight = min.height ?? 10;
    const maxHeight = max.height === undefined || max.height < 0 ? height : max.height;

    if (!this.lockAspectRatio) {
      return {
        width: clamp(width, minWidth, maxWidth),
        height: clamp(height, minHeight, maxHeight),
      };
    }

    const adjustedMinWidth =
      (minHeight - this.lockAspectRatioExtraHeight) * this._aspectRatio + this.lockAspectRatioExtraWidth;
    const adjustedMaxWidth =
      (maxHeight - this.lockAspectRatioExtraHeight) * this._aspectRatio + this.lockAspectRatioExtraWidth;
    const adjustedMinHeight =
      (minWidth - this.lockAspectRatioExtraWidth) / this._aspectRatio + this.lockAspectRatioExtraHeight;
    const adjustedMaxHeight =
      (maxWidth - this.lockAspectRatioExtraWidth) / this._aspectRatio + this.lockAspectRatioExtraHeight;

    return {
      width: clamp(width, Math.max(minWidth, adjustedMinWidth), Math.min(maxWidth, adjustedMaxWidth)),
      height: clamp(
        height,
        Math.max(minHeight, adjustedMinHeight),
        Math.min(maxHeight, adjustedMaxHeight)
      ),
    };
  }

  private _convertUnit(value: number, targetSize: number, unit: string): string | number {
    if (unit.endsWith('%')) return `${(value / targetSize) * 100}%`;
    if (unit.endsWith('vw')) return `${(value / window.innerWidth) * 100}vw`;
    if (unit.endsWith('vh')) return `${(value / window.innerHeight) * 100}vh`;
    return value;
  }

  private _changePosition(event: ResizeEvent): void {
    if (!this._resizing) return;
    const point = this._eventPoint(event);
    const parentSize = this._parentSize();
    const parentWidth = parentSize.width;
    const parentHeight = parentSize.height;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    let maxWidth = this._numberSize(this.maxWidth, parentWidth, innerWidth, innerHeight);
    let maxHeight = this._numberSize(this.maxHeight, parentHeight, innerWidth, innerHeight);
    let minWidth = this._numberSize(this.minWidth, parentWidth, innerWidth, innerHeight);
    let minHeight = this._numberSize(this.minHeight, parentHeight, innerWidth, innerHeight);

    let size = this._directionSize(point.x, point.y);

    const boundary = this._boundaryMax(maxWidth, maxHeight);
    maxWidth = boundary.width;
    maxHeight = boundary.height;

    if (this.snap?.x) size.width = findNextSnap(size.width, this.snap.x, this.snapGap);
    if (this.snap?.y) size.height = findNextSnap(size.height, this.snap.y, this.snapGap);

    size = this._aspectSize(
      size.width,
      size.height,
      { width: maxWidth, height: maxHeight },
      { width: minWidth, height: minHeight }
    );

    if (this.grid) {
      const [gridWidth, gridHeight] = Array.isArray(this.grid) ? this.grid : [this.grid, this.grid];
      const gap = this.snapGap || 0;
      const snappedWidth = snapNumber(size.width, gridWidth);
      const snappedHeight = snapNumber(size.height, gridHeight);
      size.width =
        gap === 0 || Math.abs(snappedWidth - size.width) <= gap ? snappedWidth : size.width;
      size.height =
        gap === 0 || Math.abs(snappedHeight - size.height) <= gap ? snappedHeight : size.height;
    }

    let width: string | number = size.width;
    let height: string | number = size.height;
    if (typeof this._width === 'string') {
      width = this._convertUnit(size.width, parentWidth, this._width);
    }
    if (typeof this._height === 'string') {
      height = this._convertUnit(size.height, parentHeight, this._height);
    }

    const keepAuto = (value: string | number, original: number, axis: 'width' | 'height') => {
      const propSize = this.size?.[axis] ?? this.defaultSize?.[axis];
      return this._width === 'auto' && original === size[axis] && (propSize === undefined || propSize === 'auto')
        ? 'auto'
        : value;
    };

    width = keepAuto(width, this._original.width, 'width');
    height = keepAuto(height, this._original.height, 'height');

    const changed = this._width !== width || this._height !== height;
    if (!changed) return;

    this._width = width;
    this._height = height;
    if (this._flexDirection === 'row') this._flexBasis = width;
    if (this._flexDirection === 'column') this._flexBasis = height;

    const detail: ResizableSize = {
      width,
      height,
    };
    this.onChange?.(detail, event, this._direction);
    this.dispatchEvent(
      new CustomEvent<ResizableChangeDetail>('change', {
        detail: { ...detail, direction: this._direction, event },
        bubbles: true,
        composed: true,
      })
    );

    if (this.size) {
      this._width = this.size.width ?? 'auto';
      this._height = this.size.height ?? 'auto';
    }

    this.requestUpdate();
    this._applyHostStyle();
  }

  private _endResize(event: ResizeEvent): void {
    if (!this._resizing) return;
    const width = this.offsetWidth || this._original.width;
    const height = this.offsetHeight || this._original.height;
    const size: ResizableSize = { width, height };
    this.onResizeEnd?.(size, event, this._direction);
    this.dispatchEvent(
      new CustomEvent<ResizableChangeDetail>('resize-end', {
        detail: { ...size, direction: this._direction, event },
        bubbles: true,
        composed: true,
      })
    );

    this._resizing = false;
    this._unregisterEvents();
    if (this.size) {
      this._width = this.size.width ?? 'auto';
      this._height = this.size.height ?? 'auto';
    }
    this.requestUpdate();
    this._applyHostStyle();
  }

  private _onMouseMove = (event: MouseEvent): void => this._changePosition(event);
  private _onMouseUp = (event: MouseEvent): void => this._endResize(event);
  private _onTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
    this._changePosition(event);
  };
  private _onTouchEnd = (event: TouchEvent): void => this._endResize(event);

  private _registerEvents(): void {
    if (this._type === 'mouse') {
      window.addEventListener('mousemove', this._onMouseMove);
      window.addEventListener('mouseup', this._onMouseUp);
      window.addEventListener('mouseleave', this._onMouseUp);
    } else {
      window.addEventListener('touchmove', this._onTouchMove, { passive: false });
      window.addEventListener('touchend', this._onTouchEnd);
      window.addEventListener('touchcancel', this._onTouchEnd);
    }
  }

  private _unregisterEvents(): void {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('mouseleave', this._onMouseUp);
    window.removeEventListener('touchmove', this._onTouchMove);
    window.removeEventListener('touchend', this._onTouchEnd);
    window.removeEventListener('touchcancel', this._onTouchEnd);
  }

  private _renderHandles() {
    if (!this.enable) return nothing;
    const handles = DIRECTIONS.map((direction) => {
      if (this.enable && this.enable[direction] === false) return nothing;
      const style = this.handleStyle?.[direction];
      const className = this.handleClass?.[direction] ?? '';
      const node = this.handleNode?.[direction];
      return html`<div
        data-direction=${direction}
        class="semi-resizable-resizableHandler semi-resizable-resizableHandler-${direction} ${className}"
        style=${styleMap(style ?? {})}
        part="handle handle-${direction}"
        role="separator"
        aria-orientation=${direction === 'top' || direction === 'bottom' ? 'horizontal' : 'vertical'}
        aria-label=${`Resize ${direction}`}
        @mousedown=${(event: MouseEvent) => this._startResize(event, direction)}
        @touchstart=${(event: TouchEvent) => this._startResize(event, direction)}
      >${node as never}</div>`;
    });

    return html`<div
      class=${this.handleWrapperClass}
      style=${styleMap(this.handleWrapperStyle ?? {})}
    >${handles}</div>`;
  }

  protected render() {
    return html`
      ${this._resizing
        ? html`<div
            class="semi-resizable-background"
            style=${styleMap({ cursor: this._cursor })}
          ></div>`
        : nothing}
      <slot></slot>
      ${this._renderHandles()}
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .semi-resizable-resizableHandler {
      position: absolute;
      z-index: 10;
      user-select: none;
      touch-action: none;
    }

    .semi-resizable-resizableHandler-top {
      top: -5px;
      left: 0;
      width: 100%;
      height: 10px;
      cursor: row-resize;
    }

    .semi-resizable-resizableHandler-right {
      top: 0;
      right: -5px;
      width: 10px;
      height: 100%;
      cursor: col-resize;
    }

    .semi-resizable-resizableHandler-bottom {
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 10px;
      cursor: row-resize;
    }

    .semi-resizable-resizableHandler-left {
      top: 0;
      left: -5px;
      width: 10px;
      height: 100%;
      cursor: col-resize;
    }

    .semi-resizable-resizableHandler-topRight,
    .semi-resizable-resizableHandler-bottomRight,
    .semi-resizable-resizableHandler-bottomLeft,
    .semi-resizable-resizableHandler-topLeft {
      width: 20px;
      height: 20px;
    }

    .semi-resizable-resizableHandler-topRight {
      top: -10px;
      right: -10px;
      cursor: ne-resize;
    }

    .semi-resizable-resizableHandler-bottomRight {
      right: -10px;
      bottom: -10px;
      cursor: se-resize;
    }

    .semi-resizable-resizableHandler-bottomLeft {
      bottom: -10px;
      left: -10px;
      cursor: sw-resize;
    }

    .semi-resizable-resizableHandler-topLeft {
      top: -10px;
      left: -10px;
      cursor: nw-resize;
    }

    .semi-resizable-background {
      position: fixed;
      inset: 0;
      z-index: 1000;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-resizable': SemiResizable;
  }
}
