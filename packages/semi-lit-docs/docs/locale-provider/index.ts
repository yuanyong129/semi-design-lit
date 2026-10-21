import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import zhCN from '../../../semi-ui/components/locale/lang/zh-cn';
import enUS from '../../../semi-ui/components/locale/lang/en-us';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

@customElement('locale-provider-docs')
class LocaleProviderDocs extends LitElement {
  @state()
  private _locale = 'zh-CN';

  protected createRenderRoot() {
    return this;
  }

  private get _localeData() {
    return this._locale === 'en-US' ? enUS : zhCN;
  }

  private _handleLocaleChange(ev: CustomEvent<{ value: string }>) {
    this._locale = ev.detail.value;
  }

  protected render() {
    return html`
      <h1>多语言</h1>
      <p>LocaleProvider 为子树提供语言包，嵌套时以最近的一层为准。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/other/locale" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 locale 设置语言包；semi-empty 等组件会读取最近的 LocaleProvider。',
        html`
          <semi-radio-group type="button" .value=${this._locale} @change=${this._handleLocaleChange}>
            <semi-radio value="zh-CN">中文</semi-radio>
            <semi-radio value="en-US">English</semi-radio>
          </semi-radio-group>
          <div style="margin-top: 16px;">
            <semi-locale-provider .locale=${this._localeData}>
              <semi-empty></semi-empty>
            </semi-locale-provider>
          </div>
        `,
        `<semi-locale-provider .locale=\${zhCN}>
  <semi-empty></semi-empty>
</semi-locale-provider>`
      )}

      ${section(
        '嵌套覆盖',
        'ConfigProvider.locale 的优先级高于 LocaleProvider；未设置 ConfigProvider.locale 时，最近一层 LocaleProvider 生效。',
        html`
          <semi-locale-provider .locale=${zhCN}>
            <semi-config-provider .locale=${enUS}>
              <semi-empty title="ConfigProvider 优先"></semi-empty>
            </semi-config-provider>
          </semi-locale-provider>
        `,
        `<semi-locale-provider .locale=\${zhCN}>
  <semi-config-provider .locale=\${enUS}>
    <semi-empty></semi-empty>
  </semi-config-provider>
</semi-locale-provider>`
      )}

      ${section(
        '语言包',
        '语言包包含 code / locale、empty、calendar、form 等字段，可自行扩展并通过 addI18nMessages 注册。',
        html`
          <semi-space direction="vertical">
            <semi-tag color="blue">zh-CN</semi-tag>
            <semi-tag color="green">en-US</semi-tag>
          </semi-space>
        `,
        `import { addI18nMessages } from '@semi-design/semi-ui';

addI18nMessages({ 'ja-JP': jaJP });`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'locale-provider-docs': LocaleProviderDocs
  }
}
