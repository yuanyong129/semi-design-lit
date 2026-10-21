import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContextProvider } from "@lit/context";
import { SemiLang } from "../locale/interface";
import { Size } from "../_utils/constant";
import { ConfigProvider, configProviderContext } from "./context";

export type LayoutDirection = 'ltr' | 'rtl';

/**
 * ConfigProvider 为子树提供全局配置：语言、方向、尺寸、主题模式与弹层容器。
 *
 * 对应 Semi React 的 ConfigProvider，额外保留本项目已有的 size / themeMode 扩展。
 */
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
   * @zh 视图方向
   * @en Layout direction
   * @values 'ltr','rtl'
   * @defaultValue 'ltr'
   */
  @property()
  direction: LayoutDirection = 'ltr';

  /**
   * @zh 视图方向是否从右到左（direction 的便捷写法）
   * @en Shorthand for direction="rtl"
   */
  @property({ type: Boolean })
  rtl: boolean = false;

  /**
   * @zh 弹层挂载容器
   * @en Container for popups
   */
  @property({ attribute: false })
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;

  /**
   * @zh 时区
   * @en Time zone
   */
  @property({ attribute: 'time-zone' })
  timeZone?: string | number;

  /**
   * @zh 是否在容器滚动时更新弹出框的位置
   * @en Whether to update popup position when the container scrolls
   */
  @property({ attribute: 'update-at-scroll', type: Boolean })
  updateAtScroll: boolean = false;

  /**
   * @zh 是否在滚动时关闭弹出框
   * @en Whether to close popups when scrolling
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
  private _previousThemeMode: string | null = null;
  private _themeApplied: boolean = false;

  /** Effective direction, honoring the legacy rtl flag. */
  get mergedDirection(): LayoutDirection {
    return this.rtl ? 'rtl' : this.direction;
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._restoreThemeMode();
  }

  private _restoreThemeMode() {
    if (!this._themeApplied) return;
    if (this._previousThemeMode === null) {
      document.body.removeAttribute('theme-mode');
    } else {
      document.body.setAttribute('theme-mode', this._previousThemeMode);
    }
    this._themeApplied = false;
    this._previousThemeMode = null;
    this._lastThemeMode = undefined;
  }

  protected updated() {
    this._syncContext();

    if (this.themeMode) {
      if (!this._themeApplied) {
        this._previousThemeMode = document.body.getAttribute('theme-mode');
        this._themeApplied = true;
      }
      document.body.setAttribute('theme-mode', this.themeMode);
      this._lastThemeMode = this.themeMode;
    } else if (this._lastThemeMode) {
      this._restoreThemeMode();
    }
  }

  private _syncContext() {
    this._provider.setValue({
      slots: { empty: this.empty, loading: this.loading },
      prefixCls: this.prefixCls,
      locale: this.locale,
      size: this.size,
      themeMode: this.themeMode,
      direction: this.mergedDirection,
      rtl: this.mergedDirection === 'rtl',
      getPopupContainer: this.getPopupContainer,
      timeZone: this.timeZone,
      updateAtScroll: this.updateAtScroll,
      scrollToClose: this.scrollToClose,
      exchangeTime: this.exchangeTime,
    });
  }

  protected render() {
    if (this.mergedDirection === 'rtl') {
      return html`<div class="semi-rtl" dir="rtl" part="config-provider"><slot></slot></div>`;
    }
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: contents;
    }

    .semi-rtl {
      display: contents;
      direction: rtl;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-config-provider': SemiConfigProvider
  }
}
