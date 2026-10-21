import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { styles } from './style/space.style';
import { getPrefixCls } from '../_utils/global-config';
import { Direction } from '../_utils/constant';
import { isArray, isNumber } from '../_utils/is';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { ConfigProvider, configProviderContext } from '../config-provider/context';

const prefixCls = getPrefixCls('space');

type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
type SpaceSize = number | 'tight' | 'medium' | 'loose';

@customElement('semi-space')
export class SemiSpace extends LitElement {
  /**
   * @zh 对齐方式
   * @en Alignment
   * @values 'start','end','center','baseline'
   */
  @property() align?: SpaceAlign;

  /**
   * @zh 间距方向
   * @en Spacing direction
   * @defaultValue 'horizontal'
   */
  @property() direction: Direction = 'horizontal';

  /**
   * @zh 间距大小，支持分别制定横向和竖向的间距
   * @en Spacing, supports setting horizontal and vertical spacing separately
   * @defaultValue 8
   */
  @property({ attribute: false })
  spacing: SpaceSize | [SpaceSize, SpaceSize] = 8;

  /**
   * @zh 是否自动折行
   * @en Whether to wrap items
   */
  @property({ type: Boolean })
  wrap: boolean = false;

  @consume({ context: configProviderContext })
  configCtx = {} as ConfigProvider;

  private _mergedAlign(): SpaceAlign | undefined {
    return this.align ?? (this.direction === 'horizontal' ? 'center' : undefined);
  }

  private _sizeValue(size: SpaceSize): number {
    if (isNumber(size)) return size;
    switch (size) {
      case 'tight':
        return 8;
      case 'medium':
        return 16;
      case 'loose':
        return 24;
      default:
        return 8;
    }
  }

  private _spaceStyle(): StyleInfo {
    const sizeArray: [SpaceSize, SpaceSize] = isArray(this.spacing)
      ? [this.spacing[0], this.spacing[1]]
      : [this.spacing, this.spacing];
    const [horizontal, vertical] = sizeArray.map((size) => this._sizeValue(size));

    return {
      columnGap: `${horizontal}px`,
      rowGap: `${vertical}px`,
    };
  }

  private _cls(): string {
    return [
      prefixCls,
      `${prefixCls}-${this.direction}`,
      this._mergedAlign() ? `${prefixCls}-align-${this._mergedAlign()}` : '',
      this.wrap ? `${prefixCls}-wrap` : '',
      this.configCtx?.rtl || this.configCtx?.direction === 'rtl' ? `${prefixCls}-rtl` : '',
    ].filter(Boolean).join(' ');
  }

  render() {
    return html`
      <div class="${this._cls()}" style="${styleMap(this._spaceStyle())}" part="space">
        <slot></slot>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-space': SemiSpace
  }
}
