import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import zhCN from '../../../semi-ui/components/locale/lang/zh-cn';
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

@customElement('config-provider-docs')
class ConfigProviderDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>配置</h1>
      <p>ConfigProvider 为子树提供语言、方向、尺寸、主题模式与弹层容器等全局配置。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/other/configprovider" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '语言',
        '通过 locale 为子树设置语言包，未设置时使用 LocaleProvider 或全局默认语言。',
        html`
          <semi-config-provider .locale=${zhCN}>
            <semi-empty></semi-empty>
          </semi-config-provider>
        `,
        `<semi-config-provider .locale=\${zhCN}>
  <semi-empty></semi-empty>
</semi-config-provider>`
      )}

      ${section(
        '视图方向',
        '设置 direction="rtl" 后，子树继承从右到左的布局方向。',
        html`
          <semi-config-provider direction="rtl">
            <semi-space>
              <semi-button type="primary">按钮一</semi-button>
              <semi-button>按钮二</semi-button>
              <semi-button>按钮三</semi-button>
            </semi-space>
          </semi-config-provider>
        `,
        `<semi-config-provider direction="rtl">
  <semi-space>
    <semi-button type="primary">按钮一</semi-button>
    <semi-button>按钮二</semi-button>
  </semi-space>
</semi-config-provider>`
      )}

      ${section(
        '全局尺寸',
        '通过 size 统一设置子树内支持 size 的组件尺寸。',
        html`
          <semi-config-provider size="large">
            <semi-space>
              <semi-input placeholder="Large Input"></semi-input>
              <semi-button type="primary">按钮</semi-button>
            </semi-space>
          </semi-config-provider>
        `,
        `<semi-config-provider size="large">
  <semi-space>
    <semi-input placeholder="Large Input"></semi-input>
    <semi-button type="primary">按钮</semi-button>
  </semi-space>
</semi-config-provider>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'config-provider-docs': ConfigProviderDocs
  }
}
