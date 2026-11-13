import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { AnchorChangeDetail, AnchorItem, AnchorRailTheme, AnchorSize } from './interface';
import './anchor-link';

const sizeValue = (value: string | number | undefined, fallback: string): string => {
  if (value === undefined || value === null || value === '') return fallback;
  return typeof value === 'number' ? `${value}px` : String(value);
};

/**
 * Side navigation with scroll spy and optional nested links.
 */
@customElement('semi-anchor')
export class SemiAnchor extends LitElement {
  /** Declarative items; takes precedence over slotted `<semi-anchor-link>` children. */
  @property({ attribute: false })
  items: AnchorItem[] = [];

  @property({ attribute: 'default-anchor' })
  defaultAnchor = '';

  @property({ attribute: 'offset-top', type: Number })
  offsetTop = 0;

  @property({ attribute: 'target-offset', type: Number })
  targetOffset = 0;

  @property({ attribute: 'scroll-motion', type: Boolean })
  scrollMotion = false;

  @property({ attribute: 'max-height' })
  maxHeight: string | number = '750px';

  @property({ attribute: 'max-width' })
  maxWidth: string | number = '200px';

  @property({ attribute: false })
  getContainer?: () => HTMLElement | Window;

  @property({ attribute: 'auto-collapse', type: Boolean })
  autoCollapse = false;

  @property({ attribute: 'rail-theme' })
  railTheme: AnchorRailTheme = 'primary';

  @property()
  size: AnchorSize = 'default';

  @property({ attribute: false })
  showTooltip: boolean | Record<string, unknown> = false;

  @property()
  position = 'right';

  @property({ attribute: 'aria-label' })
  anchorLabel = 'Side navigation';

  @state()
  private _active = '';

  @state()
  private _slottedItems: AnchorItem[] = [];

  private _scrollTarget: Window | HTMLElement | null = null;
  private _spyTimer: number | null = null;
  private _suppressSpyUntil = 0;

  private get _links(): AnchorItem[] {
    return this.items?.length ? this.items : this._slottedItems;
  }

  private _readChildren(parent: Element): AnchorItem[] {
    return Array.from(parent.children)
      .filter((child) => child.localName === 'semi-anchor-link')
      .map((child) => {
        const link = child as HTMLElement & { title?: string; disabled?: boolean };
        return {
          href: link.getAttribute('href') || '#',
          title: link.title || link.getAttribute('title') || '',
          disabled: link.disabled ?? link.hasAttribute('disabled'),
          children: this._readChildren(child),
        };
      });
  }

  private _refreshSlottedItems() {
    if (this.items?.length) return;
    const next = this._readChildren(this);
    if (!next.length && !this._slottedItems.length) return;
    this._slottedItems = next;
    this.requestUpdate();
  }

  private _flat(items: AnchorItem[] = this._links, level = 1): Array<AnchorItem & { level: number }> {
    return items.flatMap((item) => [
      { ...item, level },
      ...this._flat(item.children ?? [], level + 1),
    ]);
  }

  private _hasActiveChild(item: AnchorItem): boolean {
    return Boolean(
      item.children?.some(
        (child) => child.href === this._active || this._hasActiveChild(child)
      )
    );
  }

  private _resolveContainer(): Window | HTMLElement {
    try {
      const container = this.getContainer?.();
      if (container) return container;
    } catch {
      // Ignore a throwing user callback and fall back to the window.
    }
    return window;
  }

  private _resolveTarget(href: string): HTMLElement | null {
    if (!href || href === '#') return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    try {
      return (root.querySelector(href) as HTMLElement | null) ?? document.querySelector(href);
    } catch {
      return null;
    }
  }

  private _attachScroll() {
    this._detachScroll();
    this._scrollTarget = this._resolveContainer();
    this._scrollTarget.addEventListener('scroll', this._handleScroll, { passive: true });
  }

  private _detachScroll() {
    this._scrollTarget?.removeEventListener('scroll', this._handleScroll);
    this._scrollTarget = null;
  }

  private _handleScroll = () => {
    if (Date.now() < this._suppressSpyUntil || this._spyTimer !== null) return;
    this._spyTimer = window.setTimeout(() => {
      this._spyTimer = null;
      this._updateActiveFromScroll();
    }, 100);
  };

  private _updateActiveFromScroll() {
    const container = this._scrollTarget ?? this._resolveContainer();
    const containerTop = container === window ? 0 : (container as HTMLElement).getBoundingClientRect().top;
    let best: string | undefined;
    let bestTop = -Infinity;

    this._flat().forEach((item) => {
      if (item.disabled) return;
      const target = this._resolveTarget(item.href);
      if (!target) return;
      const top = target.getBoundingClientRect().top - containerTop - this.offsetTop;
      if (top <= 0 && top > bestTop) {
        bestTop = top;
        best = item.href;
      }
    });

    if (best && best !== this._active) {
      this._setActive(best, true);
    } else if (!best && this._active) {
      this._setActive('', true);
    }
  }

  private _setActive(href: string, notify: boolean, event?: Event) {
    if (this._active === href) return;
    const previousLink = this._active;
    this._active = href;
    if (notify) {
      this.dispatchEvent(
        new CustomEvent<AnchorChangeDetail>('change', {
          detail: { currentLink: href, previousLink, event },
          bubbles: true,
          composed: true,
        })
      );
    }
    this.updateComplete.then(() => this._syncBar());
  }

  private _scrollTo(href: string) {
    const target = this._resolveTarget(href);
    if (!target) return;
    const container = this._scrollTarget ?? this._resolveContainer();
    const behavior: ScrollBehavior = this.scrollMotion ? 'smooth' : 'auto';

    if (container === window) {
      const top = window.scrollY + target.getBoundingClientRect().top - this.targetOffset;
      window.scrollTo({ top: Math.max(0, top), behavior });
      return;
    }

    const element = container as HTMLElement;
    const containerRect = element.getBoundingClientRect();
    const top =
      element.scrollTop +
      target.getBoundingClientRect().top -
      containerRect.top -
      this.targetOffset;
    element.scrollTo({ top: Math.max(0, top), behavior });
  }

  private _handleClick(item: AnchorItem, event: MouseEvent) {
    if (item.disabled) return;
    event.preventDefault();
    this._suppressSpyUntil = Date.now() + 600;
    this._setActive(item.href, true, event);
    this._scrollTo(item.href);
  }

  private _handleKeyDown(item: AnchorItem, event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (item.disabled) return;
    event.preventDefault();
    this._handleClick(item, event as unknown as MouseEvent);
  }

  private _syncBar() {
    const bar = this.renderRoot.querySelector<HTMLElement>('.semi-anchor-slide-bar');
    if (!bar) return;
    const active = this.renderRoot.querySelector<HTMLElement>('.semi-anchor-link-title-active');
    const root = this.renderRoot.querySelector<HTMLElement>('.semi-anchor');
    if (!active || !root || this.railTheme === 'muted') {
      bar.style.display = 'none';
      return;
    }
    const barHeight = this.size === 'small' ? 16 : 20;
    const rootRect = root.getBoundingClientRect();
    const titleRect = active.getBoundingClientRect();
    bar.style.display = 'block';
    bar.style.height = `${barHeight}px`;
    bar.style.top = `${
      titleRect.top - rootRect.top + root.scrollTop + titleRect.height / 2 - barHeight / 2
    }px`;
  }

  protected firstUpdated() {
    queueMicrotask(() => this._refreshSlottedItems());
    this._attachScroll();
    if (this.defaultAnchor) {
      requestAnimationFrame(() => {
        this._setActive(this.defaultAnchor, false);
        this._scrollTo(this.defaultAnchor);
      });
    }
  }

  protected updated() {
    this._syncBar();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._detachScroll();
    if (this._spyTimer !== null) {
      window.clearTimeout(this._spyTimer);
      this._spyTimer = null;
    }
  }

  private _renderLink(item: AnchorItem, level: number): TemplateResult {
    const active = this._active === item.href;
    const branchActive = active || this._hasActiveChild(item);
    const showChildren = Boolean(
      item.children?.length && (!this.autoCollapse || branchActive)
    );
    const titleStyle = styleMap({ paddingLeft: `${8 * level}px` });

    return html`
      <div class="semi-anchor-link" role="listitem">
        <div
          class="semi-anchor-link-title ${active ? 'semi-anchor-link-title-active' : ''} ${item.disabled ? 'semi-anchor-link-title-disabled' : ''}"
          role="link"
          tabindex=${item.disabled ? -1 : 0}
          aria-current=${active ? 'location' : nothing}
          aria-disabled=${item.disabled ? 'true' : nothing}
          style=${titleStyle}
          title=${item.title}
          @click=${(event: MouseEvent) => this._handleClick(item, event)}
          @keydown=${(event: KeyboardEvent) => this._handleKeyDown(item, event)}
        >
          ${item.title}
        </div>
        ${showChildren
          ? html`<div class="semi-anchor-sub" role="list">
              ${item.children!.map((child) => this._renderLink(child, level + 1))}
            </div>`
          : nothing}
      </div>
    `;
  }

  protected render() {
    return html`
      <div
        class="semi-anchor semi-anchor-size-${this.size}"
        role="navigation"
        aria-label=${this.anchorLabel}
        style=${styleMap({
          maxWidth: sizeValue(this.maxWidth, '200px'),
          maxHeight: sizeValue(this.maxHeight, '750px'),
        })}
      >
        <div class="semi-anchor-slide semi-anchor-slide-${this.railTheme}" aria-hidden="true">
          <span class="semi-anchor-slide-bar"></span>
        </div>
        <div class="semi-anchor-link-wrapper" role="list">
          ${this._links.map((item) => this._renderLink(item, 1))}
        </div>
      </div>
      <slot @slotchange=${() => this._refreshSlottedItems()} style="display:none"></slot>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .semi-anchor {
      position: relative;
      box-sizing: border-box;
      padding-left: 12px;
      overflow-y: auto;
      overflow-x: hidden;
      color: var(--semi-color-text-2);
      font-size: 14px;
      line-height: 20px;
    }

    .semi-anchor-size-small {
      font-size: 12px;
      line-height: 18px;
    }

    .semi-anchor-slide {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 2px;
      border-radius: 1px;
      background: var(--semi-color-border);
    }

    .semi-anchor-slide-primary .semi-anchor-slide-bar {
      background: var(--semi-color-primary);
    }

    .semi-anchor-slide-tertiary .semi-anchor-slide-bar {
      background: var(--semi-color-tertiary);
    }

    .semi-anchor-slide-muted {
      background: transparent;
    }

    .semi-anchor-slide-bar {
      position: absolute;
      left: 0;
      width: 2px;
      border-radius: 1px;
      transition: top 0.2s ease;
      display: none;
    }

    .semi-anchor-link-title {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      min-height: 32px;
      padding-right: 8px;
      border-radius: var(--semi-border-radius-small);
      color: inherit;
      cursor: pointer;
      transition: color 0.15s ease, background-color 0.15s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .semi-anchor-size-small .semi-anchor-link-title {
      min-height: 28px;
    }

    .semi-anchor-link-title:hover {
      color: var(--semi-color-text-1);
      background: var(--semi-color-fill-0);
    }

    .semi-anchor-link-title-active {
      color: var(--semi-color-text-0);
      font-weight: 600;
    }

    .semi-anchor-link-title-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .semi-anchor-link-title-disabled:hover {
      color: var(--semi-color-disabled-text);
      background: transparent;
    }

    .semi-anchor-link-title:focus-visible {
      outline: 2px solid var(--semi-color-primary-light-active);
      outline-offset: -2px;
    }

    .semi-anchor-sub {
      display: flex;
      flex-direction: column;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-anchor': SemiAnchor;
  }
}
