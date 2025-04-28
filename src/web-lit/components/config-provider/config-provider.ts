import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ArcoLang } from "../locale/interface";
import { Size } from "../_utils/constant";
import { ConfigProvider, configProviderContext } from "./context";
import { provide } from "@lit/context";

@customElement('a-config-provider')
export class ArcoConfigProvider extends LitElement {
  /**
   * @zh 组件类名前缀
   * @en Component classname prefix
   */
  @property()
  prefixCls: string = 'arco';
  /**
   * @zh 配置语言包
   * @en Configure language pack
   */
  @property()
  locale?: ArcoLang;
  /**
   * @zh 大小
   * @en Size
   */
  @property()
  size?: Size;
  /**
   * @zh 是否全局生效
   * @en Is global effect
   */
  @property({ type: Boolean })
  global?: boolean = false;
  /**
   * @zh 是否在容器滚动时更新弹出框的位置
   * @us Whether to update the position of the popup when the container is scrolled
   */
  @property({ type: Boolean })
  updateAtScroll?: boolean = false;
  /**
   * @zh 是否在滚动时关闭弹出框
   * @en Whether to close the popover when scrolling
   */
  @property({ type: Boolean })
  scrollToClose?: boolean = false;
  /**
   * @zh 是否交换时间
   * @en Whether to exchange time
   */
  @property({ type: Boolean })
  exchangeTime?: boolean = true;
  /**
   * @zh 视图的表现形式是从右开始向左结束
   * @en View starts from the right and ends on the left
   */
  @property({ type: Boolean })
  rtl?: boolean = false;
  /**
   * @zh 自定义空状态元素
   * @en Custom empty element
   * @slot empty
   */
  @property()
  empty?: TemplateResult;
  /**
   * @zh 自定义加载中元素
   * @en Custom loading element
   * @slot loading
   */
  @property()
  loading?: TemplateResult;
  
  @provide({ context: configProviderContext })
  @state()
  _config: ConfigProvider = {} as ConfigProvider;  

  protected render() {
  
    const slots = { empty: this.empty, loading: this.loading };
    this._config = {
      slots,
      prefixCls: this.prefixCls,
      locale: this.locale,
      size: this.size,
      updateAtScroll: this.updateAtScroll,
      scrollToClose: this.scrollToClose,
      exchangeTime: this.exchangeTime,
      rtl: this.rtl,
    };

    return html`<slot></slot>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'a-config-provider': ArcoConfigProvider
  }
}
