import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type {
  DescriptionsAlign,
  DescriptionsDirection,
  DescriptionsSize,
} from './interface';
import { descriptionsItemStyles } from './style/descriptions-item.style';

/**
 * A single label/value pair in a descriptions block.
 */
@customElement('semi-descriptions-item')
export class SemiDescriptionsItem extends LitElement {
  /**
   * @zh 标签
   * @en Label
   */
  @property()
  label = '';

  /**
   * @zh 占用的列数
   * @en Number of columns to span
   * @defaultValue 1
   */
  @property({ type: Number })
  span = 1;

  /**
   * @zh 排列方向，由父级同步
   * @en Direction, synced by the parent
   * @defaultValue 'horizontal'
   */
  @property({ attribute: false })
  direction: DescriptionsDirection = 'horizontal';

  /**
   * @zh 尺寸，由父级同步
   * @en Size, synced by the parent
   * @defaultValue 'medium'
   */
  @property({ attribute: false })
  size: DescriptionsSize = 'medium';

  /**
   * @zh 内容对齐方式，由父级同步
   * @en Content alignment, synced by the parent
   * @defaultValue 'left'
   */
  @property({ attribute: false })
  align: DescriptionsAlign = 'left';

  /**
   * @zh 是否显示边框，由父级同步
   * @en Whether to show borders, synced by the parent
   */
  @property({ attribute: false })
  bordered = false;

  /**
   * @zh 父级列数，由父级同步
   * @en Parent column count, synced by the parent
   */
  @property({ attribute: false })
  column = 3;

  protected updated(): void {
    const span = Math.max(1, Math.floor(this.span) || 1);
    this.style.setProperty(
      '--semi-descriptions-item-span',
      String(Math.min(span, Math.max(1, Math.floor(this.column) || 1)))
    );
  }

  protected render() {
    const classes = [
      'semi-descriptions-item',
      `semi-descriptions-item-${this.size}`,
      `semi-descriptions-item-${this.direction}`,
      `semi-descriptions-item-${this.align}`,
      this.bordered ? 'semi-descriptions-item-bordered' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class=${classes} part="item">
        <div class="semi-descriptions-label" part="label">
          <slot name="label">${this.label}</slot>
        </div>
        <div class="semi-descriptions-content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static styles = descriptionsItemStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-descriptions-item': SemiDescriptionsItem;
  }
}
