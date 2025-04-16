import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, queryAssignedElements, queryAssignedNodes, state } from "lit/decorators.js";
import { getPrefixCls } from "../_utils/global-config";
import { ConfigProvider, configProviderContext } from "../config-provider/context";
import { consume } from "@lit/context";
import { useI18n } from "../locale";
import { styles } from "./style/empty.style";

@customElement('a-empty')
export class ArcoEmpty extends LitElement {
  /**
   * @zh 描述内容
   * @en Description
   */
  @property()
  description?: string;
  /**
   * @zh 自定义图片的地址
   * @en The src of the Custom Image
   */
  @property()
  imgSrc?: string;
  /**
   * @zh 是否在 ConfigProvider 中使用
   * @en Whether to use in ConfigProvider
   */
  @property()
  inConfigProvider?: boolean = false;

  @queryAssignedNodes({ slot: 'image', flatten: false })
  image!: Array<HTMLElement>;

  @consume({ context: configProviderContext })
  @state()
  _configCtx?: ConfigProvider;
  
  protected render() {
    const prefixCls = getPrefixCls('empty');
    const { t } = useI18n(this);
    
    if (
      !this.inConfigProvider &&
      this._configCtx?.slots.empty &&
      !(this.image?.length || this.imgSrc || this.description)
    ) {
      return this._configCtx.slots.empty;
    }

    return html`
      <div class="${prefixCls}" ${this.attributes}>
        <div class=${`${prefixCls}-image`}>
          <slot name="image">
            ${ this.imgSrc
                ? html`<img src=${this.imgSrc} alt=${this.description || 'empty'} />`
                : html`<icon-empty></icon-empty>`}
          </slot>
        </div>
        <div class=${`${prefixCls}-description`}>
          <slot>${ this.description || t('empty.description') }</slot>
        </div>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'a-empty': ArcoEmpty
  }
}