import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Declarative link used inside `<semi-anchor>`.
 *
 * It only carries data; the anchor renders the actual link tree so that the
 * scroll spy, indentation and active rail stay in sync.
 */
@customElement('semi-anchor-link')
export class SemiAnchorLink extends LitElement {
  @property()
  href = '#';

  @property()
  title = '';

  @property({ type: Boolean })
  disabled = false;

  protected render() {
    return html`<div style="display:none"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-anchor-link': SemiAnchorLink;
  }
}
