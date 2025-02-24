import { CSSResultGroup, LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Direction, DIRECTIONS } from '../_utils/constant';
import { getPrefixCls } from '../_utils/global-config';
import { isNumber } from '../_utils/is';

const prefixCls = getPrefixCls('divider');

@customElement('a-divider')
export class ArcoDivider extends LitElement {
 
  @property()
  direction: Direction = DIRECTIONS[0];

  @property()
  orientation: 'left' | 'center' | 'right' = 'center';

  @property()
  type: 'solid' | 'dashed' | 'dotted' | 'double' = 'solid';

  @property()
  size: Number = 1;

  @property()
  margin: number | string = 20;

  @state() isHorizontal: boolean = false;


  connectedCallback(): void {
    super.connectedCallback();
    this.isHorizontal = this.direction === 'horizontal';
  }

  mergedStyles () {
    let styles: string = '';
    const size = isNumber(this.size) ? `${this.size}px` : this.size;
    styles += this.isHorizontal ? `border-bottom-width: ${size};` : `border-left-width: ${size};`;
    styles += this.isHorizontal ? `border-bottom-style: ${this.type};` :  `border-left-style: ${this.type};`;
    const margin = isNumber(this.margin)
          ? `${this.margin}px`
          : this.margin;
    styles += this.isHorizontal ? `margin: ${margin} 0;` : `margin: 0 ${margin};`;

    return styles
  }

  cls = () => {
    return [
      prefixCls,
      `${prefixCls}-${this.direction}`,
    ].join(' ');
  }

  static styles?: CSSResultGroup | undefined = css`
    .${unsafeCSS(prefixCls)}-horizontal {
      position: relative;
      clear: both;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      border-color: var(--color-neutral-3);
    }

    .${unsafeCSS(prefixCls)}-vertical {
      display: inline-block;
      min-width: 1px;
      max-width: 1px;
      height: 1em;
      margin: 0 12px;
      vertical-align: middle;
      border-left: 1px solid var(--color-neutral-3);
    }
  `;

  render() {
    return html`<div class="${this.cls()}" style="${this.mergedStyles()}"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a-divider': ArcoDivider
  }
}