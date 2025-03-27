import { CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { prefixCls, styles } from "./link.style";
import { Status } from "../_utils/constant";

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
  @property({ type: Boolean })
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
    return [
      prefixCls,
      `${prefixCls}-status-${this.status}`,
      this.disabled ? `${prefixCls}-disabled` : '',
      this.loading ? `${prefixCls}-loading` : '',
      this.hoverable ? '' : `${prefixCls}-hoverless`,
      this.loading || showIcon ? `${prefixCls}-with-icon` : '',
    ].join(' ').trim();
  }

  handleClick(ev: MouseEvent) {
    if(this.disabled || this.loading) {
      ev.preventDefault();
      return;
    }
    this.dispatchEvent(new CustomEvent('click', ev));
  }

  protected render(): unknown {
    console.log(this.status, this.hoverable)
    const showIcon = false;
    return html`
      <a .herf="${this.disabled ? undefined : this.href }" class=${this.cls(showIcon)} @click="${this.handleClick}">
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