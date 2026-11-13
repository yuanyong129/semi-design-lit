import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  OverflowItem,
  OverflowListCollapseFrom,
  OverflowListKey,
  OverflowListOverflowDetail,
  OverflowListOverflowRenderer,
  OverflowListRenderMode,
  OverflowListVisibleRenderer,
} from './interface';

/**
 * A single-line list that collapses or scrolls its overflowing items.
 *
 * Collapse mode measures both the container and every item, then renders only
 * the items that fit next to the overflow slot. Scroll mode keeps every item
 * mounted and lets the browser scroll horizontally.
 */
export class SemiOverflowList extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
      max-width: 100%;
    }

    .semi-overflow-list {
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 8px;
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
    }

    .semi-overflow-list-item,
    .semi-overflow-list-overflow {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      min-width: 0;
    }

    .semi-overflow-list-overflow {
      cursor: default;
    }

    .semi-overflow-list-overflow-default {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 24px;
      padding: 0 8px;
      color: var(--semi-color-text-1);
      font-size: 12px;
      background: var(--semi-color-fill-0);
      border-radius: var(--semi-border-radius-small);
      box-sizing: border-box;
    }

    .semi-overflow-list-measure {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      width: max-content;
      height: 0;
      overflow: hidden;
      visibility: hidden;
      pointer-events: none;
    }

    .semi-overflow-list-scroll {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      width: 100%;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
    }

    .semi-overflow-list-scroll .semi-overflow-list-item {
      flex: 0 0 auto;
    }
  `;

  @property({ attribute: false })
  items: OverflowItem[] = [];

  @property({ attribute: 'collapse-from' })
  collapseFrom: OverflowListCollapseFrom = 'end';

  @property({ type: Number, attribute: 'min-visible-items' })
  minVisibleItems = 0;

  @property({ attribute: 'render-mode' })
  renderMode: OverflowListRenderMode = 'collapse';

  @property({ type: Number })
  threshold = 0.75;

  @property({ attribute: false })
  itemKey?: string | ((item: OverflowItem) => OverflowListKey);

  @property({ attribute: false })
  visibleItemRenderer?: OverflowListVisibleRenderer;

  @property({ attribute: false })
  overflowRenderer?: OverflowListOverflowRenderer;

  @property({ attribute: false })
  onOverflow?: (items: OverflowItem[]) => void;

  @property({ type: String, attribute: 'wrapper-class-name' })
  wrapperClassName = '';

  @property({ attribute: false })
  wrapperStyle: Record<string, string | number> = {};

  @state()
  private _visibleCount = 0;

  private _resizeObserver: ResizeObserver | undefined;
  private _measureFrame: number | undefined;
  private _lastOverflowSignature = '';

  connectedCallback(): void {
    super.connectedCallback();
    this._visibleCount = this.items.length;
  }

  protected firstUpdated(): void {
    this._observeResize();
    this._scheduleMeasure();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('items') || changed.has('renderMode') || changed.has('_visibleCount')) {
      this._scheduleMeasure();
    }
  }

  disconnectedCallback(): void {
    this._resizeObserver?.disconnect();
    if (this._measureFrame !== undefined) cancelAnimationFrame(this._measureFrame);
    super.disconnectedCallback();
  }

  /** Re-run the fit calculation. Exposed for tests and programmatic layout. */
  recalculate(): void {
    this._measure();
  }

  private _observeResize(): void {
    if (this._resizeObserver || typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => this._scheduleMeasure());
    this._resizeObserver.observe(this);
  }

  private _scheduleMeasure(): void {
    if (this._measureFrame !== undefined) cancelAnimationFrame(this._measureFrame);
    this._measureFrame = requestAnimationFrame(() => {
      this._measureFrame = undefined;
      this._measure();
    });
  }

  private _keyOf(item: OverflowItem, index: number): OverflowListKey {
    if (typeof this.itemKey === 'function') return this.itemKey(item);
    if (typeof this.itemKey === 'string') {
      const value = item[this.itemKey];
      return typeof value === 'string' || typeof value === 'number' ? value : index;
    }
    const key = item.key;
    return typeof key === 'string' || typeof key === 'number' ? key : index;
  }

  private _labelOf(item: OverflowItem, index: number): string {
    const value = item.label ?? item.text ?? item.value ?? item.key ?? index;
    return String(value);
  }

  private _renderItem(item: OverflowItem, index: number): unknown {
    if (this.visibleItemRenderer) return this.visibleItemRenderer(item, index);
    return this._labelOf(item, index);
  }

  private _visibleItems(): OverflowItem[] {
    if (this.renderMode === 'scroll') return this.items;
    if (this.collapseFrom === 'start') return this.items.slice(this.items.length - this._visibleCount);
    return this.items.slice(0, this._visibleCount);
  }

  private _overflowItems(): OverflowItem[] {
    if (this.renderMode === 'scroll' || this._visibleCount >= this.items.length) return [];
    if (this.collapseFrom === 'start') return this.items.slice(0, this.items.length - this._visibleCount);
    return this.items.slice(this._visibleCount);
  }

  private _measure(): void {
    if (this.renderMode === 'scroll' || !this.isConnected) return;
    const list = this.renderRoot.querySelector('.semi-overflow-list') as HTMLElement | null;
    const width = list?.clientWidth || this.clientWidth;
    const nodes = Array.from(
      this.renderRoot.querySelectorAll('.semi-overflow-list-measure .semi-overflow-list-item'),
    ) as HTMLElement[];
    if (!width || nodes.length !== this.items.length) return;

    const widths = nodes.map((node) => node.offsetWidth);
    const overflow = this.renderRoot.querySelector('.semi-overflow-list-overflow') as HTMLElement | null;
    const overflowWidth = overflow?.offsetWidth || 48;
    const gap = 8;
    const maxCount = this.items.length;
    const minCount = Math.min(Math.max(0, this.minVisibleItems), maxCount);
    let count = maxCount;

    const usedWidth = (visibleCount: number): number => {
      const start = this.collapseFrom === 'start' ? maxCount - visibleCount : 0;
      let total = 0;
      for (let i = 0; i < visibleCount; i++) {
        total += widths[start + i] || 0;
        if (i > 0) total += gap;
      }
      if (visibleCount < maxCount) total += overflowWidth + (visibleCount > 0 ? gap : 0);
      return total;
    };

    while (count > minCount && usedWidth(count) > width) {
      count -= 1;
    }

    if (count !== this._visibleCount) {
      this._visibleCount = count;
      this._emitOverflow();
      this.requestUpdate();
    } else {
      this._emitOverflow();
    }
  }

  private _emitOverflow(): void {
    const overflow = this._overflowItems();
    const signature = overflow.map((item, index) => this._keyOf(item, index)).join('|');
    if (signature === this._lastOverflowSignature) return;
    this._lastOverflowSignature = signature;
    this.onOverflow?.(overflow);
    const detail: OverflowListOverflowDetail = { items: overflow };
    this.dispatchEvent(
      new CustomEvent<OverflowListOverflowDetail>('overflow', {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderOverflow(): TemplateResult | typeof nothing {
    const overflow = this._overflowItems();
    if (!overflow.length) return nothing;
    const content = this.overflowRenderer
      ? this.overflowRenderer(overflow)
      : html`<span class="semi-overflow-list-overflow-default">+${overflow.length}</span>`;
    return html`
      <span
        class="semi-overflow-list-overflow"
        part="overflow"
        title=${overflow.map((item, index) => this._labelOf(item, index)).join(', ')}
      >
        ${content as never}
      </span>
    `;
  }

  private _renderNode(item: OverflowItem, index: number, measurement: boolean): TemplateResult {
    return html`
      <span
        class="semi-overflow-list-item"
        part="item"
        data-key=${String(this._keyOf(item, index))}
        aria-hidden=${measurement ? 'true' : 'false'}
        style=${measurement ? styleMap({ visibility: 'hidden' }) : nothing}
      >
        ${this._renderItem(item, index) as never}
      </span>
    `;
  }

  protected render(): TemplateResult {
    const listClass = [
      'semi-overflow-list',
      this.renderMode === 'scroll' ? 'semi-overflow-list-scroll' : '',
      this.wrapperClassName,
    ]
      .filter(Boolean)
      .join(' ');

    if (this.renderMode === 'scroll') {
      return html`
        <div class=${listClass} part="list" style=${styleMap(this.wrapperStyle)}>
          ${this.items.map((item, index) => this._renderNode(item, index, false))}
        </div>
      `;
    }

    const visible = this._visibleItems();
    const overflowFirst = this.collapseFrom === 'start' && this._overflowItems().length > 0;
    const overflowLast = this.collapseFrom === 'end' && this._overflowItems().length > 0;

    return html`
      <div class=${listClass} part="list" style=${styleMap(this.wrapperStyle)}>
        ${overflowFirst ? this._renderOverflow() : nothing}
        ${visible.map((item, index) =>
          this._renderNode(item, this.collapseFrom === 'start' ? this.items.length - visible.length + index : index, false),
        )}
        ${overflowLast ? this._renderOverflow() : nothing}
        <div class="semi-overflow-list-measure" aria-hidden="true">
          ${this.items.map((item, index) => this._renderNode(item, index, true))}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('semi-overflow-list')) {
  customElements.define('semi-overflow-list', SemiOverflowList);
}
