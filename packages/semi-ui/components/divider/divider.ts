import { CSSResultGroup, LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { Direction } from '../_utils/constant';
import { isNumber, isUndefined } from '../_utils/is';
import { getPrefixCls } from '../_utils/global-config';
import { styles } from './style/divider.style';
import { getChildElements } from '../_utils/dom';

const prefixCls = getPrefixCls('divider');

@customElement('semi-divider')
export class SemiDivider extends LitElement {

  /**
   * @zh 分割线方向，水平或垂直
   * @en Direction of the divider, horizontal or vertical
   * @values 'horizontal','vertical'
   * @defaultValue 'horizontal'
   */
  @property()
  layout: Direction = 'horizontal';

  /**
   * @zh 分割线文字的位置
   * @en Position of the divider text
   * @values 'left','center','right'
   * @defaultValue 'center'
   */
  @property()
  orientation: 'left' | 'center' | 'right' = 'center';

  /**
   * @zh 分割线样式类型
   * @en Divider line style
   * @values 'solid','dashed','dotted'
   * @defaultValue 'solid'
   */
  @property()
  type: 'solid' | 'dashed' | 'dotted' = 'solid';

  /**
   * @zh 分割线上下 margin（垂直方向时为左右 margin）
   * @en Margin around the divider
   */
  @property()
  margin?: number | string;

  private get _isHorizontal() {
    return this.layout !== 'vertical';
  }

  private _style(): StyleInfo {
    const styles: StyleInfo = {};

    if (!isUndefined(this.margin)) {
      const margin = isNumber(this.margin) ? `${this.margin}px` : this.margin;
      styles.margin = this._isHorizontal ? `${margin} 0` : `0 ${margin}`;
    }

    return styles;
  }

  render() {
    const hasChildren = this._isHorizontal && getChildElements(this.childNodes).length > 0;

    return html`
      <div
        role="separator"
        class="${[
          prefixCls,
          `${prefixCls}-${this.layout}`,
          `${prefixCls}-${this.type}`,
          hasChildren ? `${prefixCls}-with-text` : '',
          hasChildren ? `${prefixCls}-text-${this.orientation}` : '',
        ].filter(Boolean).join(' ')}"
        style="${styleMap(this._style())}"
        part="divider"
      >
        ${hasChildren
          ? html`<span class="${prefixCls}-text"><slot></slot></span>`
          : nothing}
      </div>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-divider': SemiDivider
  }
}
