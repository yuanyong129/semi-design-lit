import { CSSResultGroup, LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { prefixCls, styles } from './button.style';
import { isString } from '../_utils/is';
import { ButtonShapes, ButtonTypes } from './constants';
import { Size, Status } from '../_utils/constant';
import { getSlots } from '../_utils/dom';

@customElement('a-button')
export class ArcoButton extends LitElement {

  @property() type: ButtonTypes = 'secondary';

  @property() shape: ButtonShapes = 'square';

  @property() status: Status = 'normal';

  @property() size: Size = 'medium';
   
  @property() long: Boolean = false;

  @property()
  @state()
  loading: Boolean = false;

  @property() disabled: Boolean = false;

  @property() htmlType: String = 'button';

  @property() href?: String = undefined;

  slots: Record<string, Element> = {};

  connectedCallback () {
    super.connectedCallback();
  }

  getClassName = () => {
    return [
      prefixCls,
      `${prefixCls}-${this.type}`,
      `${prefixCls}-shape-${this.shape}`,
      `${prefixCls}-size-${this.size}`,
      `${prefixCls}-status-${this.status}`,
      this.long ? `${prefixCls}-long` : '',
      this.loading ? `${prefixCls}-loading`: '',
      this.disabled ? `${prefixCls}-disabled` : '',
      isString(this.href) ? `${prefixCls}-link` : ''
    ].join(' ').trim();
  }

  render() {
    this.slots = getSlots(this.children);
    return this.href
      ? html`
          <a class="${this.getClassName()}"
             href="${this.disabled || this.loading ? undefined : this.href }">
             ${
              this.loading || this.slots['icon']
              ? html`
              <span class="${prefixCls}-icon">
                ${ this.loading 
                  ? html`<icon-loading spin="true" />`
                  : html`<slot name="icon"></slot>` } 
              </span>
              ` : ''}
            <slot></slot>
          </a>`
      : html`
          <button class="${this.getClassName()}"
                  type="${this.htmlType}"
                  :disabled=${this.disabled}>
            ${
              this.loading || this.slots['icon']
              ? html`
              <span class="${prefixCls}-icon">
                ${ this.loading 
                  ? html`<icon-loading spin="true" />`
                  : html`<slot name="icon"></slot>` } 
              </span>
              ` : ''}
            <slot></slot>
          </button>`;
  }
  static styles?: CSSResultGroup | undefined = styles; 
}

declare global {
  interface HTMLElementTagNameMap {
    'a-button': ArcoButton
  }
}
