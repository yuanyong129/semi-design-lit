import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './style/badge.style';
import { BadgeStatus, BadgeType } from './interface';

/**
 * Badge for counts, dots and status labels.
 */
@customElement('semi-badge')
export class SemiBadge extends LitElement {
  /**
   * @zh 展示的数字
   * @en Count to display
   */
  @property()
  count?: number | string;

  /**
   * @zh 是否展示为小红点
   * @en Whether to show a dot
   */
  @property({ type: Boolean })
  dot = false;

  /**
   * @zh 最大显示数字，超出后显示为 ${overflowCount}+
   * @en Maximum count before showing an overflow suffix
   * @defaultValue 99
   */
  @property({ type: Number, attribute: 'overflow-count' })
  overflowCount = 99;

  /**
   * @zh 数字为 0 时是否展示
   * @en Whether to show the badge when count is 0
   */
  @property({ type: Boolean, attribute: 'show-zero' })
  showZero = false;

  /**
   * @zh 徽标颜色
   * @en Badge color
   * @values 'primary','success','warning','danger'
   * @defaultValue 'danger'
   */
  @property()
  type: BadgeType = 'danger';

  /**
   * @zh 状态点类型
   * @en Status dot type
   * @values 'success','info','warning','danger'
   */
  @property()
  status?: BadgeStatus;

  /**
   * @zh 状态点后的文本
   * @en Text next to the status dot
   */
  @property()
  text?: string;

  private get _hasChildren(): boolean {
    return this.children.length > 0;
  }

  private get _standalone(): boolean {
    return Boolean((this.status || this.text) && !this._hasChildren);
  }

  private get _displayCount(): string | null {
    if (this.dot) return null;
    if (this.count === undefined || this.count === null || this.count === '') return null;

    const numeric = typeof this.count === 'number' ? this.count : Number(this.count);
    if (!Number.isNaN(numeric)) {
      if (numeric === 0 && !this.showZero) return null;
      const overflow = Math.max(0, Number(this.overflowCount) || 0);
      return numeric > overflow ? `${overflow}+` : String(numeric);
    }
    return String(this.count);
  }

  private _countClasses(): string {
    return [
      'semi-badge-count',
      this.dot ? 'semi-badge-dot' : '',
      `semi-badge-count-${this.type}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected render() {
    if (this._standalone) {
      return html`
        <span class="semi-badge-status semi-badge-status-${this.status ?? 'info'}" part="badge">
          <span class="semi-badge-status-dot"></span>
          ${this.text ? html`<span class="semi-badge-text">${this.text}</span>` : nothing}
        </span>
      `;
    }

    const display = this._displayCount;
    const shouldShow = this.dot || display !== null;

    return html`
      <span class="semi-badge" part="badge">
        <slot></slot>
        ${shouldShow
          ? html`<sup class="${this._countClasses()}" part="count">
              ${this.dot ? nothing : display}
            </sup>`
          : nothing}
      </span>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-badge': SemiBadge;
  }
}
