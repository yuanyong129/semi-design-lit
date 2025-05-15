import { CSSResultGroup, LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { Direction } from '../_utils/constant';
import { isNumber, isUndefined } from '../_utils/is';
import { getPrefixCls } from '../_utils/global-config';
import { styles } from './style/divider.style';
import { getChildElements } from '../_utils/dom';

const prefixCls = getPrefixCls('divider');

@customElement('a-divider')
export class ArcoDivider extends LitElement {

  /**
   * @zh 分割线的方向，是水平还是竖直
   * @en The direction of the dividing line. Can be horizontal or vertical
   * @values 'horizontal','vertical'
   */
  @property()
  direction: Direction = 'horizontal';
  /**
   * @zh 分割线文字的位置
   * @en The position of the dividing line text
   */
  @property()
  orientation: 'left' | 'center' | 'right' = 'center';
  /**
   * @zh 分割线样式类型
   * @en Dividing line style type
   */
  @property()
  type?: 'solid' | 'dashed' | 'dotted' | 'double';
  /**
   * @zh 分割线宽度/高度
   * @en The wide/height of the dividing line
   */
  @property()
  size?: number;
  /**
   * @zh 分割线上下 margin (垂直方向时为左右 margin)
   * @en Margin up and down the split line (left and right margin in vertical direction)
   */
  @property()
  margin?: number | string;

  @state() _isHorizontal: boolean = false;


  connectedCallback(): void {
    super.connectedCallback();
    this._isHorizontal = this.direction === 'horizontal';
  }

  mergedStyles () {
    let styles: StyleInfo = {};

    if (this.size) {
      styles[
        this._isHorizontal ? 'border-bottom-width' : 'border-left-width'
      ] = isNumber(this.size) ? `${this.size}px` : this.size;
    }
    if (this.type) {
      styles[
        this._isHorizontal ? 'border-bottom-style' : 'border-left-style'
      ] = this.type;
    }
    if (!isUndefined(this.margin)) {
      const margin = isNumber(this.margin)
        ? `${this.margin}px`
        : this.margin;
      styles.margin = this._isHorizontal ? `${margin} 0` : `0 ${margin}`;
    }

    return styleMap(styles) 
  }

  cls = (hasChildren: boolean) => {
    return [
      prefixCls,
      `${prefixCls}-${this.direction}`,
      hasChildren ? `${prefixCls}-with-text` : '',
    ].join(' ');
  }

  render() {

    const hasChildren = getChildElements(this.childNodes).length > 0;

    return html`
      <div role="separator" class="${this.cls(hasChildren)}" style="${this.mergedStyles()}" part="divider">
        ${hasChildren && this.direction === 'horizontal' ? (
          html`<span
            class=${[
              `${prefixCls}-text`,
              `${prefixCls}-text-${this.orientation}`,
            ].join(' ')}
          >
            ${this.childNodes}
          </span>`
        ) : nothing}
      </div>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;

}

declare global {
  interface HTMLElementTagNameMap {
    'a-divider': ArcoDivider
  }
}