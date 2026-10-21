import { CSSResultGroup, html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { prefixCls, styles } from "./style/link.style";
import { handleClsList } from "../_utils/web-utils";

export const LINK_THEMES = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const;
export type LinkTheme = typeof LINK_THEMES[number];

@customElement('semi-link')
export class SemiLink extends LitElement {
  /**
   * @zh 链接地址
   * @en Link address
   */
  @property()
  href?: string;

  /**
   * @zh a 标签的 target 属性
   * @en Native `target` attribute of the anchor
   */
  @property()
  target?: string;

  /**
   * @zh 链接主题
   * @en Link theme
   * @values 'primary','secondary','tertiary','success','warning','danger'
   * @defaultValue 'primary'
   */
  @property()
  theme: LinkTheme = 'primary';

  /**
   * @zh 是否显示下划线
   * @en Whether to show underline
   */
  @property({ type: Boolean })
  underline: boolean = false;

  /**
   * @zh 链接是否禁用
   * @en Whether the link is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 链接图标，也可以使用 `slot="icon"`
   * @en Link icon, `slot="icon"` is also supported
   */
  @property({ attribute: false })
  icon?: TemplateResult;

  private get _hasIcon(): boolean {
    return Boolean(this.icon || this.querySelector(':scope > [slot="icon"]'));
  }

  cls(hasIcon: boolean) {
    return handleClsList([
      prefixCls,
      `${prefixCls}-${this.theme}`,
      this.underline ? `${prefixCls}-underline` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      hasIcon ? `${prefixCls}-with-icon` : '',
    ]);
  }

  private handleClick(ev: MouseEvent) {
    if (this.disabled) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
  }

  protected render(): unknown {
    const hasIcon = this._hasIcon;

    return html`
      <a
        class=${this.cls(hasIcon)}
        href=${this.disabled ? undefined : (this.href ?? nothing)}
        target=${this.target ?? nothing}
        part="link"
        @click=${this.handleClick}
      >
        ${hasIcon
          ? html`<span class="${prefixCls}-icon">
              ${this.icon ?? html`<slot name="icon"></slot>`}
            </span>`
          : nothing}
        <span class="${prefixCls}-content"><slot></slot></span>
      </a>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-link': SemiLink
  }
}
