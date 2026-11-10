import { html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { TimelineColor, TimelineMode, TimelinePosition } from './interface';
import { timelineItemStyles } from './style/timeline-item.style';

const COLOR_MAP: Record<string, string> = {
  blue: 'var(--semi-color-primary)',
  green: 'var(--semi-color-success)',
  red: 'var(--semi-color-danger)',
  gray: 'var(--semi-color-text-3)',
};

/**
 * A single event in a timeline.
 */
@customElement('semi-timeline-item')
export class SemiTimelineItem extends LitElement {
  /**
   * @zh 时间
   * @en Time
   */
  @property()
  time = '';

  /**
   * @zh 节点颜色
   * @en Dot color
   * @defaultValue 'blue'
   */
  @property()
  color: TimelineColor = 'blue';

  /**
   * @zh 自定义节点
   * @en Custom dot
   */
  @property({ attribute: false })
  dot?: TemplateResult;

  /**
   * @zh 在交替模式下的位置
   * @en Position in alternate mode
   */
  @property()
  position?: TimelinePosition;

  /**
   * @zh 排列模式，由父级同步
   * @en Mode, synced by the parent
   * @defaultValue 'left'
   */
  @property({ attribute: false })
  mode: TimelineMode = 'left';

  /**
   * @zh 序号，由父级同步
   * @en Index, synced by the parent
   */
  @property({ attribute: false })
  index = 0;

  /**
   * @zh 是否为最后一项，由父级同步
   * @en Whether this is the last item, synced by the parent
   */
  @property({ attribute: false })
  last = false;

  private get _side(): TimelinePosition {
    if (this.mode === 'left' || this.mode === 'right') {
      return this.mode;
    }
    return this.position ?? (this.index % 2 === 0 ? 'left' : 'right');
  }

  protected render() {
    const side = this._side;
    const classes = [
      'semi-timeline-item',
      `semi-timeline-item-${side}`,
      this.mode === 'alternate' ? 'semi-timeline-item-alternate' : '',
      this.last ? 'semi-timeline-item-last' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const dotStyle = styleMap({
      background: COLOR_MAP[this.color] ?? this.color,
    });

    return html`
      <div class=${classes} part="item">
        <div class="semi-timeline-tail"></div>
        <div class="semi-timeline-dot" style=${dotStyle} part="dot">
          ${this.dot ?? nothing}
        </div>
        <div class="semi-timeline-content" part="content">
          ${this.time
            ? html`<div class="semi-timeline-time">${this.time}</div>`
            : nothing}
          <div class="semi-timeline-body"><slot></slot></div>
        </div>
      </div>
    `;
  }

  static styles = timelineItemStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-timeline-item': SemiTimelineItem;
  }
}
