import { html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from "lit/decorators.js";
import { getPrefixCls } from "../_utils/global-config";
import { useI18n } from "../locale";
import { styles } from "./style/empty.style";
import "../../../semi-icons/build/empty";

@customElement('semi-empty')
export class SemiEmpty extends LitElement {
  /**
   * @zh 空状态布局
   * @en Empty layout
   * @values 'vertical','horizontal'
   * @defaultValue 'vertical'
   */
  @property()
  layout: 'vertical' | 'horizontal' = 'vertical';

  /**
   * @zh 标题
   * @en Title
   */
  @property()
  title: string = '';

  /**
   * @zh 描述内容
   * @en Description
   */
  @property()
  description?: string;

  /**
   * @zh 自定义图片地址
   * @en The src of the custom image
   */
  @property({ attribute: 'image-src' })
  imageSrc?: string;

  /**
   * @zh 自定义图片节点
   * @en Custom image node
   */
  @property({ attribute: false })
  image?: TemplateResult;

  protected render() {
    const prefixCls = getPrefixCls('empty');
    const { t } = useI18n(this);
    const description = this.description ?? t('empty.description');

    const image = this.image
      ? this.image
      : this.imageSrc
        ? html`<img src=${this.imageSrc} alt=${this.title || description} />`
        : html`<semi-icon-empty></semi-icon-empty>`;

    return html`
      <div class="${prefixCls} ${prefixCls}-${this.layout}" part="empty">
        <div class="${prefixCls}-image">
          <slot name="image">${image}</slot>
        </div>
        <div class="${prefixCls}-content">
          ${this.title ? html`<div class="${prefixCls}-title">${this.title}</div>` : nothing}
          <div class="${prefixCls}-description">
            <slot>${description}</slot>
          </div>
        </div>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-empty': SemiEmpty
  }
}
