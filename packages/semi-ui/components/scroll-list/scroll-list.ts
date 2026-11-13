import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A framed list container. Put one or more `semi-scroll-list-item` elements
 * inside; columns share the same body height and render side by side.
 */
export class SemiScrollList extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
    }

    .semi-scrolllist {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      height: 100%;
      overflow: hidden;
      color: var(--semi-color-text-0);
      background: var(--semi-color-bg-2);
      border-radius: var(--semi-border-radius-medium);
      box-shadow: var(--semi-shadow-elevated);
      user-select: none;
    }

    .semi-scrolllist-header {
      text-align: center;
      background: var(--semi-color-fill-0);
    }

    .semi-scrolllist-header-title {
      padding: 12px 16px;
      font-weight: 600;
      color: var(--semi-color-text-0);
    }

    .semi-scrolllist-line {
      height: 1px;
      background: var(--semi-color-border);
    }

    .semi-scrolllist-body {
      display: flex;
      min-height: 0;
      padding: 8px 0;
      overflow: hidden;
    }

    ::slotted(semi-scroll-list-item) {
      flex: 1 1 0;
      min-width: 0;
    }

    .semi-scrolllist-footer {
      padding: 8px 16px;
      border-top: 1px solid var(--semi-color-border);
    }
  `;

  @property({ attribute: false })
  header?: unknown;

  @property({ attribute: false })
  footer?: unknown;

  @property({ attribute: 'body-height' })
  bodyHeight: number | string = 240;

  @property({ type: String, attribute: 'aria-label' })
  ariaLabel = 'Scroll list';

  private _height(): string {
    if (typeof this.bodyHeight === 'number') return `${this.bodyHeight}px`;
    const value = String(this.bodyHeight).trim();
    return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
  }

  protected render(): TemplateResult {
    const height = this._height();
    return html`
      <div class="semi-scrolllist" role="group" aria-label=${this.ariaLabel}>
        ${this.header
          ? html`
              <div class="semi-scrolllist-header">
                <div class="semi-scrolllist-header-title">${this.header}</div>
                <div class="semi-scrolllist-line"></div>
              </div>
            `
          : nothing}
        <div
          class="semi-scrolllist-body"
          style=${styleMap({
            height,
            '--semi-scrolllist-body-height': height,
          })}
        >
          <slot></slot>
        </div>
        ${this.footer
          ? html`<div class="semi-scrolllist-footer">${this.footer}</div>`
          : nothing}
      </div>
    `;
  }
}

if (!customElements.get('semi-scroll-list')) {
  customElements.define('semi-scroll-list', SemiScrollList);
}
