import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import ResizeObserverPolyFill from 'resize-observer-polyfill';

@customElement('resize-observer')
export class ResizeObserver extends LitElement {
  
  @property({ type: Boolean })
  watchOnUpdated?: boolean;

  @state()
  _resizeObserver: ResizeObserverPolyFill | null = null;

  createResizeObserver(target: HTMLElement) {
    if (!target) return;
    this._resizeObserver = new ResizeObserverPolyFill((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      this.dispatchEvent(new CustomEvent('resize', { detail: entry }))
    });
    this._resizeObserver.observe(target);
  }

  destroyResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if(this._resizeObserver) this.destroyResizeObserver();
  }

  createRenderRoot() {
    return this;
  }
}