import { CSSResultGroup, LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Direction, DIRECTIONS } from '../_utils/constant';
import { isNumber } from '../_utils/is';
import { prefixCls, styles } from './divider.style';


@customElement('a-divider')
export class ArcoDivider extends LitElement {
 
  @property()
  direction: Direction = DIRECTIONS[0];

  @property()
  orientation: 'left' | 'center' | 'right' = 'center';

  @property()
  type: 'solid' | 'dashed' | 'dotted' | 'double' = 'solid';

  @property()
  size: number = 1;

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

  static styles?: CSSResultGroup | undefined = styles;

  render() {
    return html`<div class="${this.cls()}" style="${this.mergedStyles()}"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a-divider': ArcoDivider
  }
}