import { LitElement, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles, prefixCls } from './icon-component.style';
import { isNumber } from "../_utils/is";

@customElement('a-icon')
export class ArcoIcon extends LitElement {

  @property()
  type?: string = undefined;
  @property()
  size?: number | string = undefined;
  @property()
  rotate?: number = 0;
  @property()
  spin?: boolean = false;

  cls = () => {
    return [
      prefixCls,
      this.spin ? `${prefixCls}-loading` : '',
      this.type || ''
    ].join(' ').trim();
  }

  innerStyle = () => {
    let styles = '';

    if (this.size) {
      const size = isNumber(this.size) ? `${this.size}px` : this.size;
      styles += `width: ${size}; height: ${size}`;
    }
    if (this.rotate) {
      styles += `transform: rotate(${this.rotate}deg);`;
    }

    return styles;
  }

  static styles?: CSSResultGroup | undefined = styles; 

}

declare global {
  interface HTMLElementTagNameMap {
    'a-icon': ArcoIcon
  }
}