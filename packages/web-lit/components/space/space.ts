import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { styles } from './style/space.style';
import { getPrefixCls } from '../_utils/global-config';
import { Direction, Size } from '../_utils/constant';
import { isArray, isNumber } from '../_utils/is';
import { getChildElements, handleCustomSlot } from '../_utils/dom';
import { handleClsList } from '../_utils/web-utils';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { ConfigProvider, configProviderContext } from '../config-provider/context';
import { RenderContent } from '../_utils/types';

const prefixCls = getPrefixCls('space');

type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
type SpaceSize = number | Size;

@customElement('a-space')
export class ArcoSpace extends LitElement {
  /**
   * @zh 对齐方式
   * @en Alignment
   * @values 'start', 'end', 'center', 'baseline'
   */
  @property() align?: SpaceAlign;
  /**
   * @zh 间距方向
   * @en Spacing direction
   */
  @property() direction: Direction = 'horizontal';
  /**
   * @zh 间距大小，支持分别制定横向和竖向的间距
   * @en Spacing size, support for setting horizontal and vertical spacing separately
   */
  @property() size: SpaceSize = 'small';
  /**
   * @zh 环绕类型的间距，用于折行的场景。
   * @en The spacing of the wrapping type, used in the scene of wrapping.
   */
  @property({ type: Boolean })
  wrap: boolean = false;
  /**
   * @zh 充满整行
   * @en fill the block
   */
  @property({ type: Boolean })
  fill: boolean = false;
  /**
   * @zh 设置分隔符
   * @en Set separator
   * @slot split
   */
  @property()
  slots: { split?: RenderContent } = {}
  
  @consume({ context: configProviderContext })
  configCtx = {} as ConfigProvider;

  connectedCallback() {
    super.connectedCallback();
  }
  
  mergedAlign = () => {
    return this.align ?? (this.direction === 'horizontal' ? 'center' : '');
  }

  cls = () => {
    return handleClsList([
      prefixCls,
      this.direction ? `${prefixCls}-${this.direction}` : '',
      this.align ? `${prefixCls}-align-${this.mergedAlign()}` : '',
      this.wrap ? `${prefixCls}-wrap` : '',
      this.fill ? `${prefixCls}-fill` : '',
      (this.configCtx.rtl ?? false) ? `${prefixCls}-rtl` : '' ,
    ]);
  }

  getSize(size: SpaceSize) {
    if (isNumber(size)) {
      return size;
    }
    switch (size) {
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

  getSpaceStyle() {
    const style: StyleInfo = {};
    const sizeArray = isArray(this.size)
      ? this.size
      : [this.size, this.size];
    const [colGap, rowGap] = sizeArray.map(this.getSize);

    style.columnGap = `${colGap}px`;
    style.rowGap = `${rowGap}px`;
    return styleMap(style);
  };

  static styles = styles;

  render() {

    const children = getChildElements(this.childNodes);

    return html`
      <div class="${this.cls()}" style="${this.getSpaceStyle()}" part="a-space">
        ${children.map((child, index) => {
          const shouldRenderSplit = this.slots.split && index > 0;
          return html`
            ${shouldRenderSplit && (
              html`<div class="${prefixCls}-item-split">${handleCustomSlot(this.slots.split)}</div>`
            )}
            <div key="${`item-${index}`}" class="${prefixCls}-item">
              ${child}
            <div>`;
        })}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a-space': ArcoSpace
  }
}