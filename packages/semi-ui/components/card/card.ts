import { html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from './style/card.style';
import { CardShadows } from './interface';
import '../skeleton/skeleton';

/**
 * Card container with an optional header, cover and footer.
 */
@customElement('semi-card')
export class SemiCard extends LitElement {
  /**
   * @zh 卡片标题
   * @en Card title
   */
  @property({ attribute: 'title' })
  cardTitle = '';

  /**
   * @zh 标题右侧内容
   * @en Content on the right side of the header
   */
  @property({ attribute: false })
  headerExtraContent?: TemplateResult;

  /**
   * @zh 封面内容
   * @en Card cover
   */
  @property({ attribute: false })
  cover?: TemplateResult;

  /**
   * @zh 卡片底部内容
   * @en Card footer
   */
  @property({ attribute: false })
  footer?: TemplateResult;

  /**
   * @zh 底部操作区
   * @en Card actions
   */
  @property({ attribute: false })
  actions?: TemplateResult[];

  /**
   * @zh 是否显示边框
   * @en Whether to show the border
   * @defaultValue true
   */
  @property({ type: Boolean })
  bordered = true;

  /**
   * @zh 阴影显示时机
   * @en When to show the shadow
   * @values 'always','hover'
   * @defaultValue 'always'
   */
  @property()
  shadows: CardShadows = 'always';

  /**
   * @zh 是否加载中
   * @en Whether the card is loading
   */
  @property({ type: Boolean })
  loading = false;

  /**
   * @zh 内容区内联样式
   * @en Inline style of the body
   */
  @property({ attribute: false })
  bodyStyle?: Record<string, string>;

  /**
   * @zh 标题区内联样式
   * @en Inline style of the header
   */
  @property({ attribute: false })
  headerStyle?: Record<string, string>;

  /**
   * @zh 底部区内联样式
   * @en Inline style of the footer
   */
  @property({ attribute: false })
  footerStyle?: Record<string, string>;

  private _hasSlot(name: string): boolean {
    return Boolean(this.querySelector(`:scope > [slot="${name}"]`));
  }

  private get _hasHeader(): boolean {
    return Boolean(this.cardTitle || this.headerExtraContent || this._hasSlot('header-extra'));
  }

  private get _hasFooter(): boolean {
    return Boolean(this.footer || this._hasSlot('footer'));
  }

  private get _hasActions(): boolean {
    return Boolean(this.actions?.length || this._hasSlot('actions'));
  }

  private _classes(): string {
    return [
      'semi-card',
      this.bordered ? 'semi-card-bordered' : '',
      `semi-card-shadows-${this.shadows}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected render() {
    return html`
      <section class="${this._classes()}" part="card">
        ${this.cover || this._hasSlot('cover')
          ? html`<div class="semi-card-cover" part="cover">
              <slot name="cover">${this.cover}</slot>
            </div>`
          : nothing}

        ${this._hasHeader
          ? html`<div class="semi-card-header" style=${styleMap(this.headerStyle ?? {})} part="header">
              <div class="semi-card-header-title">${this.cardTitle}</div>
              ${this.headerExtraContent || this._hasSlot('header-extra')
                ? html`<div class="semi-card-header-extra">
                    <slot name="header-extra">${this.headerExtraContent}</slot>
                  </div>`
                : nothing}
            </div>`
          : nothing}

        <div
          class="semi-card-body ${this.loading ? 'semi-card-body-loading' : ''}"
          style=${styleMap(this.bodyStyle ?? {})}
          part="body"
        >
          ${this.loading
            ? html`<semi-skeleton active rows="3"></semi-skeleton>`
            : html`<slot></slot>`}
        </div>

        ${this._hasFooter
          ? html`<div class="semi-card-footer" style=${styleMap(this.footerStyle ?? {})} part="footer">
              <slot name="footer">${this.footer}</slot>
            </div>`
          : nothing}

        ${this.actions?.length
          ? html`<ul class="semi-card-actions" part="actions">
              ${this.actions.map(
                (action) => html`<li class="semi-card-action">${action}</li>`
              )}
            </ul>`
          : this._hasSlot('actions')
            ? html`<div class="semi-card-footer"><slot name="actions"></slot></div>`
            : nothing}
      </section>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-card': SemiCard;
  }
}
