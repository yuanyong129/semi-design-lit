import { html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type {
  FloatButtonBadge,
  FloatButtonShape,
  FloatButtonSize,
} from './interface';
import { floatButtonStyles } from './style/float-button.style';
import '../badge/badge';

/**
 * A floating action button fixed at the bottom-right corner.
 */
@customElement('semi-float-button')
export class SemiFloatButton extends LitElement {
  /**
   * @zh 按钮形状
   * @en Button shape
   */
  @property()
  shape: FloatButtonShape = 'round';

  /**
   * @zh 按钮尺寸
   * @en Button size
   */
  @property()
  size: FloatButtonSize = 'default';

  /**
   * @zh 是否使用彩色背景
   * @en Whether to use a colorful background
   */
  @property({ type: Boolean, reflect: true })
  colorful = false;

  /**
   * @zh 图标
   * @en Icon
   */
  @property({ attribute: false })
  icon?: TemplateResult;

  /**
   * @zh 徽标配置
   * @en Badge configuration
   */
  @property({ attribute: false })
  badge?: FloatButtonBadge;

  /**
   * @zh 链接地址
   * @en Link href
   */
  @property()
  href?: string;

  /**
   * @zh 链接打开方式
   * @en Link target
   */
  @property()
  target?: string;

  /**
   * @zh 是否禁用
   * @en Whether the button is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  private _handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.href) {
      event.preventDefault();
      if (this.target === '_blank') {
        window.open(this.href, this.target);
      } else {
        window.location.href = this.href;
      }
    }
  }

  private _renderBadge(body: TemplateResult): TemplateResult {
    const badge = this.badge;
    if (!badge) {
      return body;
    }
    return html`<semi-badge
      .count=${badge.count ?? 0}
      .dot=${badge.dot ?? false}
      .overflowCount=${badge.overflowCount ?? 99}
      .showZero=${badge.showZero ?? false}
      .type=${badge.type ?? 'danger'}
    >${body}</semi-badge>`;
  }

  protected render() {
    const classes = {
      'semi-float-button': true,
      'semi-float-button-round': this.shape === 'round',
      'semi-float-button-square': this.shape === 'square',
      'semi-float-button-small': this.size === 'small',
      'semi-float-button-large': this.size === 'large',
      'semi-float-button-colorful': this.colorful,
      'semi-float-button-disabled': this.disabled,
    };
    const icon = html`<span class="semi-float-button-icon" part="icon">
      <slot name="icon">${this.icon}</slot>
    </span>`;
    const body = this.href
      ? html`<a
          class=${classMap(classes)}
          part="button"
          href=${this.href}
          target=${this.target ?? nothing}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this._handleClick}
        >${icon}</a>`
      : html`<button
          class=${classMap(classes)}
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this._handleClick}
        >${icon}</button>`;

    return html`${this._renderBadge(body)}`;
  }

  static styles = floatButtonStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-float-button': SemiFloatButton;
  }
}
