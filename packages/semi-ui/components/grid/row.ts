import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { StyleInfo } from 'lit/directives/style-map.js';
import type { GridAlign, GridGutter, GridJustify } from './interface';
import { rowStyles } from './style/row.style';

function parseGutter(value: unknown): GridGutter {
  if (typeof value === 'number') return value;
  if (Array.isArray(value) && value.length >= 2) {
    return [Number(value[0]) || 0, Number(value[1]) || 0];
  }
  const text = String(value ?? '').trim();
  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return [Number(parsed[0]) || 0, Number(parsed[1]) || 0];
    } catch {
      // Fall through to a single numeric value.
    }
  }
  return Number(text) || 0;
}

/**
 * A 24-column flex row. Place `semi-col` elements inside it.
 */
@customElement('semi-row')
export class SemiRow extends LitElement {
  /**
   * @zh 栅格间隔，支持数字或 [水平, 垂直]
   * @en Grid gutter, a number or [horizontal, vertical]
   * @defaultValue 0
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) => parseGutter(value),
      toAttribute: (value: GridGutter) =>
        Array.isArray(value) ? JSON.stringify(value) : String(value),
    },
  })
  gutter: GridGutter = 0;

  /**
   * @zh 垂直对齐方式
   * @en Vertical alignment
   */
  @property()
  align?: GridAlign;

  /**
   * @zh 水平排列方式
   * @en Horizontal alignment
   */
  @property()
  justify?: GridJustify;

  /**
   * @zh 是否自动换行
   * @en Whether columns wrap
   */
  @property({ type: Boolean })
  wrap = true;

  /**
   * @zh 布局模式
   * @en Layout type
   * @defaultValue 'flex'
   */
  @property()
  type: 'flex' | 'block' = 'flex';

  private get _gutter(): [number, number] {
    const gutter = parseGutter(this.gutter);
    return Array.isArray(gutter) ? gutter : [gutter, 0];
  }

  protected render() {
    const [horizontal, vertical] = this._gutter;
    const classes = [
      'semi-row',
      this.wrap ? 'semi-row-wrap' : 'semi-row-nowrap',
      this.align ? `semi-row-align-${this.align}` : '',
      this.justify ? `semi-row-justify-${this.justify}` : '',
      this.type === 'block' ? 'semi-row-block' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const style: StyleInfo = {
      '--semi-grid-gutter-x': `${horizontal}px`,
      '--semi-grid-gutter-y': `${vertical}px`,
      marginLeft: horizontal ? `${-horizontal / 2}px` : undefined,
      marginRight: horizontal ? `${-horizontal / 2}px` : undefined,
    };

    return html`
      <div class=${classes} style=${styleMap(style)} part="row">
        <slot></slot>
      </div>
    `;
  }

  static styles = rowStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-row': SemiRow;
  }
}
