import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
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

@customElement('button-docs')
class ButtonDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _loading = false;

  private async _handleLoadingClick() {
    this._loading = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this._loading = false;
  }

  protected render() {
    return html`
      <h1>按钮</h1>
      <p>按钮用于触发一个即时操作，支持多种类型、主题、尺寸与图标组合。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/button" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '按钮分为 primary、secondary、tertiary、warning、danger 五种类型，默认类型为 primary、主题为 light。',
        html`
          <semi-space wrap>
            <semi-button type="primary" theme="solid">主要按钮</semi-button>
            <semi-button type="secondary">次要按钮</semi-button>
            <semi-button type="tertiary">第三按钮</semi-button>
            <semi-button type="warning">警告按钮</semi-button>
            <semi-button type="danger">危险按钮</semi-button>
          </semi-space>
        `,
        `<semi-space wrap>
  <semi-button type="primary" theme="solid">主要按钮</semi-button>
  <semi-button type="secondary">次要按钮</semi-button>
  <semi-button type="tertiary">第三按钮</semi-button>
  <semi-button type="warning">警告按钮</semi-button>
  <semi-button type="danger">危险按钮</semi-button>
</semi-space>`
      )}

      ${section(
        '按钮主题',
        '通过 theme 设置按钮主题：solid 实心、light 浅色（默认）、outline 描边、borderless 无边框。',
        html`
          <semi-space wrap>
            <semi-button type="primary" theme="solid">Solid</semi-button>
            <semi-button type="primary" theme="light">Light</semi-button>
            <semi-button type="primary" theme="outline">Outline</semi-button>
            <semi-button type="primary" theme="borderless">Borderless</semi-button>
          </semi-space>
        `,
        `<semi-space wrap>
  <semi-button type="primary" theme="solid">Solid</semi-button>
  <semi-button type="primary" theme="light">Light</semi-button>
  <semi-button type="primary" theme="outline">Outline</semi-button>
  <semi-button type="primary" theme="borderless">Borderless</semi-button>
</semi-space>`
      )}

      ${section(
        '按钮尺寸',
        '支持 large、default、small 三种尺寸，默认 default。',
        html`
          <semi-space wrap align="center">
            <semi-button type="primary" size="large">Large</semi-button>
            <semi-button type="primary">Default</semi-button>
            <semi-button type="primary" size="small">Small</semi-button>
          </semi-space>
        `,
        `<semi-space wrap align="center">
  <semi-button type="primary" size="large">Large</semi-button>
  <semi-button type="primary">Default</semi-button>
  <semi-button type="primary" size="small">Small</semi-button>
</semi-space>`
      )}

      ${section(
        '图标按钮',
        '通过 slot="icon" 添加图标，通过 icon-position 控制图标位置；只有图标时按钮自动变为正方形。',
        html`
          <semi-space wrap align="center">
            <semi-button type="primary">
              <semi-icon-plus slot="icon"></semi-icon-plus>新建
            </semi-button>
            <semi-button>
              <semi-icon-star slot="icon"></semi-icon-star>收藏
            </semi-button>
            <semi-button type="primary" icon-position="right">
              下一步<semi-icon-right slot="icon"></semi-icon-right>
            </semi-button>
            <semi-button type="primary">
              <semi-icon-plus slot="icon"></semi-icon-plus>
            </semi-button>
          </semi-space>
        `,
        `<semi-button type="primary">
  <semi-icon-plus slot="icon"></semi-icon-plus>新建
</semi-button>
<semi-button icon-position="right">
  下一步<semi-icon-right slot="icon"></semi-icon-right>
</semi-button>
<semi-button type="primary">
  <semi-icon-plus slot="icon"></semi-icon-plus>
</semi-button>`
      )}

      ${section(
        '撑满容器',
        '设置 block 后按钮宽度撑满父容器。',
        html`
          <div style="width: 360px">
            <semi-button type="primary" block>Block Button</semi-button>
          </div>
        `,
        `<div style="width: 360px">
  <semi-button type="primary" block>Block Button</semi-button>
</div>`
      )}

      ${section(
        '按钮组',
        '使用 semi-button-group 组合多个按钮，可统一设置 type、theme、size。',
        html`
          <semi-space wrap>
            <semi-button-group>
              <semi-button>复制</semi-button>
              <semi-button>粘贴</semi-button>
              <semi-button>剪切</semi-button>
            </semi-button-group>
            <semi-button-group type="primary" theme="solid">
              <semi-button>左侧</semi-button>
              <semi-button>中间</semi-button>
              <semi-button>右侧</semi-button>
            </semi-button-group>
            <semi-button-group type="primary" theme="outline">
              <semi-button>年</semi-button>
              <semi-button>月</semi-button>
              <semi-button>日</semi-button>
            </semi-button-group>
          </semi-space>
        `,
        `<semi-button-group>
  <semi-button>复制</semi-button>
  <semi-button>粘贴</semi-button>
  <semi-button>剪切</semi-button>
</semi-button-group>

<semi-button-group type="primary" theme="solid">
  <semi-button>左侧</semi-button>
  <semi-button>中间</semi-button>
  <semi-button>右侧</semi-button>
</semi-button-group>`
      )}

      ${section(
        '禁用状态',
        '设置 disabled 后按钮不可点击，并按主题展示禁用样式。',
        html`
          <semi-space wrap>
            <semi-button disabled>禁用按钮</semi-button>
            <semi-button type="primary" theme="solid" disabled>禁用按钮</semi-button>
            <semi-button type="primary" theme="outline" disabled>禁用按钮</semi-button>
            <semi-button type="danger" theme="borderless" disabled>禁用按钮</semi-button>
          </semi-space>
        `,
        `<semi-button disabled>禁用按钮</semi-button>
<semi-button type="primary" theme="solid" disabled>禁用按钮</semi-button>
<semi-button type="primary" theme="outline" disabled>禁用按钮</semi-button>`
      )}

      ${section(
        '加载状态',
        '设置 loading 后按钮显示加载图标并阻止点击。',
        html`
          <semi-space wrap align="center">
            <semi-button type="primary" loading>加载中</semi-button>
            <semi-button type="primary" .loading=${this._loading} @click=${this._handleLoadingClick}>
              点击加载
            </semi-button>
          </semi-space>
        `,
        `<semi-button type="primary" loading>加载中</semi-button>
<semi-button type="primary" .loading=\${loading} @click=\${handleClick}>
  点击加载
</semi-button>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'button-docs': ButtonDocs
  }
}
