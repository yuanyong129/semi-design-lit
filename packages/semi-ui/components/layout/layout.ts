import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { layoutStyles } from './style/layout.style';

/**
 * Page layout container. Combine with `semi-layout-header`, `semi-layout-sider`,
 * `semi-layout-content` and `semi-layout-footer`.
 */
@customElement('semi-layout')
export class SemiLayout extends LitElement {
  private _syncSider(): void {
    const hasSider = Array.from(this.children).some(
      (child) => child.tagName.toLowerCase() === 'semi-layout-sider'
    );
    this.toggleAttribute('data-has-sider', hasSider);
  }

  private _handleSlotChange = (): void => {
    this._syncSider();
  };

  protected firstUpdated(): void {
    this._syncSider();
  }

  protected render() {
    return html`
      <div class="semi-layout" part="layout">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  static styles = layoutStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-layout': SemiLayout;
  }
}
