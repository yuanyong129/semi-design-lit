import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  DescriptionsAlign,
  DescriptionsDirection,
  DescriptionsSize,
} from './interface';
import type { SemiDescriptionsItem } from './descriptions-item';
import { descriptionsStyles } from './style/descriptions.style';
import './descriptions-item';

/**
 * Displays label/value pairs in an aligned grid.
 */
@customElement('semi-descriptions')
export class SemiDescriptions extends LitElement {
  /**
   * @zh 每行列数
   * @en Number of columns per row
   * @defaultValue 3
   */
  @property({ type: Number })
  column = 3;

  /**
   * @zh 排列方向
   * @en Layout direction
   * @defaultValue 'horizontal'
   */
  @property()
  direction: DescriptionsDirection = 'horizontal';

  /**
   * @zh 尺寸
   * @en Size
   * @defaultValue 'medium'
   */
  @property()
  size: DescriptionsSize = 'medium';

  /**
   * @zh 内容对齐方式
   * @en Content alignment
   * @defaultValue 'left'
   */
  @property()
  align: DescriptionsAlign = 'left';

  /**
   * @zh 是否显示边框
   * @en Whether to show borders
   */
  @property({ type: Boolean, reflect: true })
  bordered = false;

  private get _items(): SemiDescriptionsItem[] {
    return Array.from(
      this.querySelectorAll(':scope > semi-descriptions-item')
    ) as SemiDescriptionsItem[];
  }

  private _syncItems(): void {
    const column = Math.max(1, Math.floor(this.column) || 1);
    this._items.forEach((item) => {
      item.direction = this.direction;
      item.size = this.size;
      item.align = this.align;
      item.bordered = this.bordered;
      item.column = column;
      item.setAttribute('role', 'listitem');
      const span = Math.max(1, Math.floor(item.span) || 1);
      item.style.setProperty(
        '--semi-descriptions-item-span',
        String(Math.min(span, column))
      );
    });
  }

  private _handleSlotChange = (): void => {
    this._syncItems();
  };

  protected firstUpdated(): void {
    this._syncItems();
  }

  protected updated(): void {
    this._syncItems();
  }

  protected render() {
    const column = Math.max(1, Math.floor(this.column) || 1);
    const classes = [
      'semi-descriptions',
      this.bordered ? 'semi-descriptions-bordered' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div
        class=${classes}
        part="descriptions"
        role="list"
        style=${styleMap({
          '--semi-descriptions-columns': String(column),
        })}
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  static styles = descriptionsStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-descriptions': SemiDescriptions;
  }
}
