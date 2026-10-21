import { LitElement, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { iconStyles } from "../style/theme/icon";
import { isNumber } from "../_utils/is";

/**
 * Base class for all Semi icon web components.
 *
 * Icons are plain custom elements, e.g. `<semi-icon-loading spin></semi-icon-loading>`.
 */
@customElement('semi-icon')
export class SemiIcon extends LitElement {

  @property()
  type?: string = undefined;
  @property()
  size?: number | string = undefined;
  @property()
  rotate?: number = 0;
  @property({ type: Boolean })
  spin: boolean = false;

  cls = (name?: string) => {
    return [
      'semi-icon',
      this.spin ? 'semi-icon-spin' : '',
      name ? `semi-icon-${name}` : '',
    ].filter(Boolean).join(' ');
  };

  innerStyle = () => {
    let styles = '';

    if (this.size) {
      const size = isNumber(this.size) ? `${this.size}px` : this.size;
      styles += `width: ${size}; height: ${size};`;
    }
    if (this.rotate) {
      styles += `transform: rotate(${this.rotate}deg);`;
    }

    return styles;
  };

  static styles?: CSSResultGroup | undefined = iconStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-icon': SemiIcon
  }
}
