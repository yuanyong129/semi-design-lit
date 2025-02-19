import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('a-button')
export class ArcoButton extends LitElement {
  render() {
    return html`
      <button>
        <slot></slot>
      </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a-button': ArcoButton
  }
}
