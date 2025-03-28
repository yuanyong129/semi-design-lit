import { CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { prefixCls, styles } from "./style/link.style";
import { Status } from "../_utils/constant";
import "../../icon/build/loading";
import "../../icon/build/link";
import { getSlots } from "../_utils/dom";
import { hasPropOrSlot } from "../_utils/use-prop-or-slot";
import { handleClsList } from "../_utils/web-utils";

@customElement('a-link')
export class ArcoLink extends LitElement {
  /**
   * @zh 链接地址
   * @en Link address
   */
  @property()
  href?: string;
  /**
   * @zh 链接的状态
   * @en Link status
   * @values 'normal','warning','success','danger'
   */
  @property()
  status: Status = 'normal';
  /**
   * @zh 鼠标悬浮时存在底色
   * @en Whether to hide background when hover
   */
  @property({ type: Boolean, attribute: false })
  hoverable: boolean = true;
  /**
   * @zh 图标
   * @en icon
   */
  @property({ type: Boolean })
  icon?: boolean;
  /**
   * @zh 链接是否为加载中状态
   * @en Whether the link is in the loading state
   */
  @property({ type: Boolean })
  loading?: boolean;
  /**
   * @zh 链接是否禁用
   * @en Whether the link is disabled
   */
  @property({ type: Boolean })
  disabled?: boolean;

  cls(showIcon: boolean) {
    return handleClsList([
      prefixCls,
      `${prefixCls}-status-${this.status}`,
      this.disabled ? `${prefixCls}-disabled` : '',
      this.loading ? `${prefixCls}-loading` : '',
      this.hoverable ? '' : `${prefixCls}-hoverless`,
      this.loading || showIcon ? `${prefixCls}-with-icon` : '',
    ]);
  }

  handleClick(ev: MouseEvent) {
    if(this.disabled || this.loading) {
      ev.preventDefault();
      return;
    }
    this.dispatchEvent(new CustomEvent('click', ev));
  }

  protected render(): unknown {
    const slots = getSlots(this.children);
    const showIcon = hasPropOrSlot(this, slots, 'icon');

    return html`
      <a .herf="${this.disabled ? undefined : this.href }"
         class=${this.cls(showIcon)}
         @click="${this.handleClick}">
        ${ (this.loading || showIcon)
            ? html`
                <span class="${prefixCls}-icon">
                  ${ this.loading
                      ? html`<icon-loading></icon-loading>`
                      : html`<slot name="icon"><icon-link></icon-link></slot>` }
                </span>`
            : nothing }
        <slot></slot>
      </a>
    `;
  }
  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'a-link': ArcoLink
  }
}