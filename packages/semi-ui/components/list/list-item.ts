import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ListSize } from './interface';
import { listItemStyles } from './style/list-item.style';

/**
 * A single row in a list.
 */
@customElement('semi-list-item')
export class SemiListItem extends LitElement {
  /**
   * @zh 标题
   * @en Title
   */
  @property()
  title = '';

  /**
   * @zh 描述
   * @en Description
   */
  @property()
  description = '';

  /**
   * @zh 右侧附加内容
   * @en Extra content on the right
   */
  @property()
  extra = '';

  /**
   * @zh 尺寸，由父级同步
   * @en Size, synced by the parent
   * @defaultValue 'default'
   */
  @property({ attribute: false })
  size: ListSize = 'default';

  /**
   * @zh 是否显示分割线，由父级同步
   * @en Whether to show a split line, synced by the parent
   */
  @property({ attribute: false })
  split = true;

  /**
   * @zh 是否为最后一项，由父级同步
   * @en Whether this is the last item, synced by the parent
   */
  @property({ attribute: false })
  last = false;

  @state()
  private _hasAvatar = false;

  @state()
  private _hasActions = false;

  @state()
  private _hasExtra = false;

  @state()
  private _hasContent = false;

  private _handleAvatarSlot = (event: Event): void => {
    this._hasAvatar = (event.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private _handleActionsSlot = (event: Event): void => {
    this._hasActions = (event.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private _handleExtraSlot = (event: Event): void => {
    this._hasExtra = (event.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private _handleContentSlot = (event: Event): void => {
    const nodes = (event.target as HTMLSlotElement).assignedNodes({ flatten: true });
    this._hasContent = nodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()))
    );
  };

  protected render() {
    const classes = [
      'semi-list-item',
      `semi-list-item-${this.size}`,
      this.split ? 'semi-list-item-split' : '',
      this.last ? 'semi-list-item-last' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class=${classes} part="item">
        <div class="semi-list-item-avatar" ?hidden=${!this._hasAvatar}>
          <slot name="avatar" @slotchange=${this._handleAvatarSlot}></slot>
        </div>
        <div class="semi-list-item-main">
          <div class="semi-list-item-title-row">
            <div class="semi-list-item-title" part="title">
              <slot name="title">${this.title}</slot>
            </div>
            <div class="semi-list-item-extra" ?hidden=${!this.extra && !this._hasExtra}>
              <slot name="extra" @slotchange=${this._handleExtraSlot}>${this.extra}</slot>
            </div>
          </div>
          <div class="semi-list-item-description" part="description">
            ${this.description && !this._hasContent ? html`<span>${this.description}</span>` : ''}
            <slot @slotchange=${this._handleContentSlot}></slot>
          </div>
          <div class="semi-list-item-actions" ?hidden=${!this._hasActions}>
            <slot name="actions" @slotchange=${this._handleActionsSlot}></slot>
          </div>
        </div>
      </div>
    `;
  }

  static styles = listItemStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-list-item': SemiListItem;
  }
}
