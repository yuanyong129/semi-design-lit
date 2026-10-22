import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import { Size } from '../_utils/constant';

const prefixCls = getPrefixCls('input-group');

const styles = css`
  :host {
    display: inline-flex;
    width: 100%;
  }

  .${unsafeCSS(prefixCls)} {
    display: inline-flex;
    align-items: stretch;
    width: 100%;
  }

  .${unsafeCSS(prefixCls)} ::slotted(*) {
    flex: 1;
    min-width: 0;
  }

  .${unsafeCSS(prefixCls)} ::slotted(*:not(:first-child)) {
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .${unsafeCSS(prefixCls)} ::slotted(*:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .${unsafeCSS(prefixCls)}-small ::slotted(*) {
    height: 24px;
  }

  .${unsafeCSS(prefixCls)}-large ::slotted(*) {
    height: 40px;
  }
`;

@customElement('semi-input-group')
export class SemiInputGroup extends LitElement {
  @property()
  size?: Size;

  render() {
    return html`
      <div class="${prefixCls} ${this.size ? `${prefixCls}-${this.size}` : ''}" part="input-group">
        <slot></slot>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-input-group': SemiInputGroup
  }
}

