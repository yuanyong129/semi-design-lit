import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { localeContext } from './context';
import { SemiLang } from './interface';
import zhCN from './lang/zh-cn';

/**
 * LocaleProvider 为子树提供 Semi 语言包。
 *
 * 与 ConfigProvider 的 locale 属性相比，LocaleProvider 只负责语言上下文，
 * 更接近 Semi React 的 `LocaleProvider` 组件；嵌套时以最近的一层为准。
 */
@customElement('semi-locale-provider')
export class SemiLocaleProvider extends LitElement {
  /**
   * @zh 语言包
   * @en Locale messages
   */
  @property({ attribute: false })
  locale: SemiLang = zhCN;

  private _provider = new ContextProvider(this, {
    context: localeContext,
    initialValue: zhCN,
  });

  connectedCallback() {
    super.connectedCallback();
    this._syncContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected updated() {
    this._syncContext();
  }

  private _syncContext() {
    this._provider.setValue(this.locale ?? zhCN);
  }

  protected render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-locale-provider': SemiLocaleProvider
  }
}
