import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { prefixCls, styles } from './space.style';
import { Direction, Size } from '../_utils/constant';
import { isArray, isNumber } from '../_utils/is';

type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
type SpaceSize = number | Size;

@customElement('a-space')
export class ArcoSpace extends LitElement {
  /**
   * @zh 对齐方式
   */
  @property() align: SpaceAlign = 'start';
  /**
   * @zh 间距方向
   */
  @property() direction: Direction = 'horizontal';
  /**
   * @zh 间距大小，支持分别制定横向和竖向的间距
   */
  @property() size: SpaceSize = 'small';

  @property() wrap: boolean = false;

  @property() fill: boolean = false;

  connectedCallback() {
    super.connectedCallback();
  }
  

  getChildElements (childNodes: NodeListOf<ChildNode>): any[] {
    const result: any[] = [];
    childNodes.forEach(item => {
      if(item.nodeType === 3) {
        if(item.nodeValue?.replace('/n', '').trim() !== '') {
          result.push(item);
        }
      } else {
        return result.push(item);
      }
    });
    console.log(result)
    return result;
  }

  mergedAlign = () => {
    return this.align ?? (this.direction === 'horizontal' ? 'center' : '');
  }

  cls = () => {
    return [
      prefixCls,
      this.direction && `${prefixCls}-${this.direction}`,
      this.align ? `${prefixCls}-align-${this.mergedAlign()}` : '',
      this.wrap ? `${prefixCls}-wrap` : '',
      this.fill ? `${prefixCls}-fill` : ''
    ].join(' ').trim();
  }

  getMargin = (size: SpaceSize) => {
    if(isNumber(size)) {
      return size;
    }
    switch(size) {
      case 'mini':
        return 4;
      case 'small':
        return 8;
      case 'medium':
        return 16;
      case 'large':
        return 24;
      default:
        return 8;
    }
  }

  getMarginStyle = (isLast: boolean) => {
    let style = '';

    const marginRight = `${this.getMargin(
      isArray(this.size) ? this.size[0] : this.size
    )}px`;
    const marginBottom = `${this. getMargin(
      isArray(this.size) ? this.size[1] : this.size
    )}px`;

    if (isLast) {
      return this.wrap ? { marginBottom } : '';
    }

    if (this.direction === 'horizontal') {
      style = `margin-right: ${marginRight};`;
    }
    if (this.direction === 'vertical' || this.wrap) {
      style = `margin-bottom: ${marginBottom};`;
    }

    return style;
  }

  static styles = styles;

  render() {

    const children = this.getChildElements(this.childNodes);

    return html`
      <div class="${this.cls()}">
        ${children.map((item, index) => {
          return html`<div class="${prefixCls}-item"
                           style="${this.getMarginStyle(index === children.length - 1)}">
                        ${item}
                      <div>`
        })}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a-space': ArcoSpace
  }
}