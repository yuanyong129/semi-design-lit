import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  ScrollListItemData,
  ScrollListMode,
  ScrollListSelectDetail,
} from './interface';

/**
 * A single scrollable option column used by `semi-scroll-list`.
 *
 * `normal` renders a conventional list; `wheel` renders a centered wheel
 * picker with a selection window and top/bottom shades.
 */
export class SemiScrollListItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      flex: 1 1 0;
      min-width: 0;
      min-height: 0;
      height: 100%;
      --semi-scrolllist-item-height: 36px;
    }

    .semi-scrolllist-item {
      position: relative;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: none;
      background: var(--semi-color-bg-2);
    }

    .semi-scrolllist-item::-webkit-scrollbar {
      display: none;
    }

    .semi-scrolllist-item-wheel {
      overflow: hidden;
    }

    .semi-scrolllist-item:not(:last-child) {
      border-right: 1px solid var(--semi-color-border);
    }

    ul {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--semi-scrolllist-item-height);
      color: var(--semi-color-text-0);
      text-align: center;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    li:hover {
      background: var(--semi-color-fill-0);
    }

    li.semi-scrolllist-item-sel {
      color: var(--semi-color-primary);
      font-weight: 600;
      background: var(--semi-color-primary-light-default);
    }

    li.semi-scrolllist-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
      background: transparent;
    }

    .semi-scrolllist-item-wheel {
      position: relative;
      height: 100%;
      overflow: hidden;
    }

    .semi-scrolllist-list-outer {
      position: relative;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: none;
    }

    .semi-scrolllist-list-outer::-webkit-scrollbar {
      display: none;
    }

    .semi-scrolllist-wheel-pad {
      flex: 0 0 auto;
      width: 100%;
      height: var(--semi-scrolllist-wheel-padding, 102px);
    }

    .semi-scrolllist-item-wheel li {
      color: var(--semi-color-text-2);
    }

    .semi-scrolllist-item-wheel li.semi-scrolllist-item-sel {
      color: var(--semi-color-primary);
      font-weight: 600;
      background: transparent;
    }

    .semi-scrolllist-selector {
      pointer-events: none;
      position: absolute;
      top: 50%;
      width: 100%;
      height: var(--semi-scrolllist-item-height);
      transform: translateY(-50%);
      border-top: 1px solid var(--semi-color-border);
      border-bottom: 1px solid var(--semi-color-border);
      z-index: 1;
    }

    .semi-scrolllist-shade {
      pointer-events: none;
      position: absolute;
      left: 0;
      width: 100%;
      height: 50%;
      z-index: 2;
    }

    .semi-scrolllist-shade-pre {
      top: 0;
      background: linear-gradient(to bottom, var(--semi-color-bg-2), transparent);
    }

    .semi-scrolllist-shade-post {
      bottom: 0;
      background: linear-gradient(to top, var(--semi-color-bg-2), transparent);
    }
  `;

  @property({ attribute: false })
  items: ScrollListItemData[] = [];

  @property({ type: Number, attribute: 'selected-index' })
  selectedIndex = 0;

  @property({ type: String })
  mode: ScrollListMode = 'normal';

  @property({ type: Boolean })
  cycled = false;

  @property({ attribute: false })
  transform?: (value: unknown, text: string) => string;

  @property({ type: Number, attribute: 'item-height' })
  itemHeight = 36;

  @property({ type: String, attribute: 'aria-label' })
  ariaLabel = 'Scroll list';

  @state()
  private _selected = 0;

  private _scrollTimer: ReturnType<typeof setTimeout> | undefined;
  private _programmatic = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._selected = this._safeIndex(this.selectedIndex);
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('selectedIndex')) {
      this._selected = this._safeIndex(this.selectedIndex);
    }
  }

  protected firstUpdated(): void {
    this._syncWheelPadding();
    this.updateComplete.then(() => this._scrollToSelected(false));
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (this.mode === 'wheel' && changed.has('itemHeight')) {
      this._syncWheelPadding();
      this.updateComplete.then(() => this._scrollToSelected(false));
      return;
    }
    if (changed.has('selectedIndex') && !this._programmatic) {
      this._scrollToSelected(true);
    }
  }

  disconnectedCallback(): void {
    if (this._scrollTimer) clearTimeout(this._scrollTimer);
    super.disconnectedCallback();
  }

  private _safeIndex(index: number): number {
    if (!this.items.length) return 0;
    return Math.max(0, Math.min(this.items.length - 1, index));
  }

  private _text(item: ScrollListItemData): string {
    const text = item.text == null ? String(item.value) : String(item.text);
    return this.transform ? this.transform(item.value, text) : text;
  }

  private _syncWheelPadding(): void {
    if (this.mode !== 'wheel') return;
    const height = this.clientHeight || 240;
    const next = Math.max(0, (height - this.itemHeight) / 2);
    this.style.setProperty('--semi-scrolllist-wheel-padding', `${next}px`);
  }

  private _wrapper(): HTMLElement | null {
    return this.renderRoot.querySelector('.semi-scrolllist-list-outer');
  }

  private _nodes(): HTMLElement[] {
    return Array.from(this.renderRoot.querySelectorAll('li'));
  }

  private _scrollToSelected(smooth: boolean): void {
    const wrapper = this._wrapper();
    const nodes = this._nodes();
    if (!wrapper || !nodes[this._selected]) return;
    const node = nodes[this._selected] as HTMLElement;
    const top = node.offsetTop - (wrapper.clientHeight - node.offsetHeight) / 2;
    this._programmatic = true;
    if (smooth && typeof wrapper.scrollTo === 'function') {
      wrapper.scrollTo({ top, behavior: 'smooth' });
    } else {
      wrapper.scrollTop = top;
    }
    window.setTimeout(() => {
      this._programmatic = false;
    }, 160);
  }

  private _nearestIndex(): number {
    const wrapper = this._wrapper();
    const nodes = this._nodes();
    if (!wrapper || !nodes.length) return this._selected;
    const center = wrapper.scrollTop + wrapper.clientHeight / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    nodes.forEach((node, index) => {
      const current = Math.abs(node.offsetTop + node.offsetHeight / 2 - center);
      if (current < distance) {
        distance = current;
        nearest = index;
      }
    });
    return nearest;
  }

  private _selectIndex(index: number, emit = true): void {
    const item = this.items[index];
    if (!item || item.disabled) return;
    if (this._scrollTimer) {
      clearTimeout(this._scrollTimer);
      this._scrollTimer = undefined;
    }
    this._selected = index;
    this.selectedIndex = index;
    this.requestUpdate();
    this._scrollToSelected(true);
    if (emit) {
      const detail: ScrollListSelectDetail = { item, index };
      this.dispatchEvent(
        new CustomEvent<ScrollListSelectDetail>('select', {
          detail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _handleScroll = (): void => {
    if (this.mode !== 'wheel' || this._programmatic) return;
    if (this._scrollTimer) clearTimeout(this._scrollTimer);
    this._scrollTimer = setTimeout(() => {
      const index = this._nearestIndex();
      if (index !== this._selected) {
        this._selectIndex(index);
      }
    }, 80);
  };

  private _handleClick(index: number): void {
    this._selectIndex(index);
  }

  private _renderOptions(): TemplateResult {
    return html`
      <ul role="listbox" aria-label=${this.ariaLabel} aria-multiselectable="false">
        ${this.items.map((item, index) => {
          const selected = index === this._selected;
          return html`
            <li
              role="option"
              aria-selected=${selected ? 'true' : 'false'}
              aria-disabled=${item.disabled ? 'true' : 'false'}
              class=${classMap({
                'semi-scrolllist-item-sel': selected,
                'semi-scrolllist-item-disabled': Boolean(item.disabled),
              })}
              style=${styleMap({ height: `${this.itemHeight}px` })}
              @click=${() => this._handleClick(index)}
            >
              ${this._text(item)}
            </li>
          `;
        })}
      </ul>
    `;
  }

  protected render(): TemplateResult {
    if (this.mode === 'wheel') {
      return html`
        <div
          class="semi-scrolllist-item semi-scrolllist-item-wheel"
          style=${styleMap({
            '--semi-scrolllist-item-height': `${this.itemHeight}px`,
          })}
        >
          <div class="semi-scrolllist-shade semi-scrolllist-shade-pre"></div>
          <div class="semi-scrolllist-selector"></div>
          <div class="semi-scrolllist-shade semi-scrolllist-shade-post"></div>
          <div class="semi-scrolllist-list-outer" @scroll=${this._handleScroll}>
            <div class="semi-scrolllist-wheel-pad"></div>
            ${this._renderOptions()}
            <div class="semi-scrolllist-wheel-pad"></div>
          </div>
        </div>
      `;
    }
    return html`
      <div
        class="semi-scrolllist-item"
        style=${styleMap({
          '--semi-scrolllist-item-height': `${this.itemHeight}px`,
        })}
      >
        ${this.items.length ? this._renderOptions() : nothing}
      </div>
    `;
  }
}

if (!customElements.get('semi-scroll-list-item')) {
  customElements.define('semi-scroll-list-item', SemiScrollListItem);
}
