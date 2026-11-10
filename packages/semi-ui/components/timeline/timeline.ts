import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { TimelineMode } from './interface';
import type { SemiTimelineItem } from './timeline-item';
import { timelineStyles } from './style/timeline.style';
import './timeline-item';

/**
 * Displays a vertical sequence of events.
 */
@customElement('semi-timeline')
export class SemiTimeline extends LitElement {
  /**
   * @zh 排列模式
   * @en Layout mode
   * @defaultValue 'left'
   */
  @property()
  mode: TimelineMode = 'left';

  /**
   * @zh 是否反转顺序
   * @en Whether to reverse the order
   */
  @property({ type: Boolean })
  reverse = false;

  private get _items(): SemiTimelineItem[] {
    return Array.from(
      this.querySelectorAll(':scope > semi-timeline-item')
    ) as SemiTimelineItem[];
  }

  private _syncItems(): void {
    const items = this._items;
    items.forEach((item, index) => {
      const order = this.reverse ? items.length - 1 - index : index;
      item.mode = this.mode;
      item.index = order;
      item.last = order === items.length - 1;
      item.setAttribute('role', 'listitem');
      item.style.setProperty('--semi-timeline-order', String(order));
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
    return html`
      <div
        class="semi-timeline semi-timeline-${this.mode}"
        part="timeline"
        role="list"
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  static styles = timelineStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-timeline': SemiTimeline;
  }
}
