import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContextProvider } from "@lit/context";
import { SemiLang } from "../locale/interface";
import { Size } from "../_utils/constant";
import { ConfigProvider, configProviderContext } from "./context";

@customElement('semi-config-provider')
export class SemiConfigProvider extends LitElement {
  /**
   * @zh 组件类名前缀
   * @en Component classname prefix
   */
  @property({ attribute: 'prefix-cls' })
  prefixCls: string = 'semi';

  /**
   * @zh 配置语言包
   * @en Locale messages
   */
  @property({ attribute: false })
  locale?: SemiLang;

  /**
   * @zh 全局尺寸
   * @en Global size
   */
  @property()
  size?: Size;

  /**
   * @zh 主题模式，设置为 dark 时启用暗色模式
   * @en Theme mode, enables dark mode when set to dark
   * @values 'light','dark'
   */
  @property({ attribute: 'theme-mode' })
  themeMode?: 'light' | 'dark';

  /**
   * @zh 视图方向是否从右到左
   * @en Whether the direction is right-to-left
   */
  @property({ type: Boolean })
  rtl: boolean = false;

  /**
   * @zh 是否在容器滚动时更新弹出框的位置
   * @en Whether to update the popup position when the container scrolls
   */
  @property({ attribute: 'update-at-scroll', type: Boolean })
  updateAtScroll: boolean = false;

  /**
   * @zh 是否在滚动时关闭弹出框
   * @en Whether to close the popup when scrolling
   */
  @property({ attribute: 'scroll-to-close', type: Boolean })
  scrollToClose: boolean = false;

  /**
   * @zh 是否交换时间
   * @en Whether to exchange time
   */
  @property({ attribute: 'exchange-time', type: Boolean })
  exchangeTime: boolean = true;

  /**
   * @zh 自定义空状态元素
   * @en Custom empty element
   */
  @property({ attribute: false })
  empty?: TemplateResult;

  /**
   * @zh 自定义加载中元素
   * @en Custom loading element
   */
  @property({ attribute: false })
  loading?: TemplateResult;

  private _provider = new ContextProvider(this, {
    context: configProviderContext,
    initialValue: {} as ConfigProvider,
  });

  private _lastThemeMode?: 'light' | 'dark';

  connectedCallback() {
    super.connectedCallback();
    this._syncContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._lastThemeMode) {
      document.body.removeAttribute('theme-mode');
    }
  }

  protected updated() {
    this._syncContext();

    if (this.themeMode) {
      document.body.setAttribute('theme-mode', this.themeMode);
      this._lastThemeMode = this.themeMode;
    } else if (this._lastThemeMode) {
      document.body.removeAttribute('theme-mode');
      this._lastThemeMode = undefined;
    }
  }

  private _syncContext() {
    this._provider.setValue({
      slots: { empty: this.empty, loading: this.loading },
      prefixCls: this.prefixCls,
      locale: this.locale,
      size: this.size,
      themeMode: this.themeMode,
      updateAtScroll: this.updateAtScroll,
      scrollToClose: this.scrollToClose,
      exchangeTime: this.exchangeTime,
      rtl: this.rtl,
    });
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-config-provider': SemiConfigProvider
  }
}
