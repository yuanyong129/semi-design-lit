import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

@customElement('spin-docs')
class SpinDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _loading = true;

  @state()
  private _delayLoading = false;

  private _delayTimer?: number;

  private _toggleLoading() {
    this._loading = !this._loading;
  }

  private _startDelayLoading() {
    window.clearTimeout(this._delayTimer);
    this._delayLoading = true;
    this._delayTimer = window.setTimeout(() => {
      this._delayLoading = false;
    }, 1800);
  }

  protected render() {
    return html`
      <h1>加载中</h1>
      <p>加载中用于表示页面或区块正在请求数据，支持尺寸、提示文案、延迟显示与包裹内容。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/feedback/spin" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'spinning 为 true 时展示加载指示器，默认尺寸为 middle。',
        html`<semi-spin></semi-spin>`,
        `<semi-spin></semi-spin>`
      )}

      ${section(
        '尺寸与提示',
        'size 支持 small、middle、large，tip 用于展示加载提示。',
        html`
          <semi-space align="center" spacing={24}>
            <semi-spin size="small"></semi-spin>
            <semi-spin size="middle"></semi-spin>
            <semi-spin size="large"></semi-spin>
            <semi-spin tip="加载中..."></semi-spin>
          </semi-space>
        `,
        `<semi-space align="center" spacing={24}>
  <semi-spin size="small"></semi-spin>
  <semi-spin size="middle"></semi-spin>
  <semi-spin size="large"></semi-spin>
  <semi-spin tip="加载中..."></semi-spin>
</semi-space>`
      )}

      ${section(
        '包裹内容',
        '将内容放入 semi-spin，加载时内容会变淡并阻止交互。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
            <semi-spin .spinning=${this._loading} tip="数据加载中">
              <div
                style="width: 420px; padding: 20px; border: 1px solid var(--semi-color-border); border-radius: 8px"
              >
                <strong>项目概览</strong>
                <p style="margin: 8px 0 0; color: var(--semi-color-text-2)">这里是需要加载的内容区域。</p>
              </div>
            </semi-spin>
            <semi-button size="small" @click=${this._toggleLoading}>
              ${this._loading ? '结束加载' : '开始加载'}
            </semi-button>
          </div>
        `,
        `<semi-spin .spinning=\${loading} tip="数据加载中">
  <div class="content">项目概览</div>
</semi-spin>
<semi-button @click=\${toggle}>切换加载</semi-button>`
      )}

      ${section(
        '延迟显示',
        'delay 设置延迟毫秒数，避免短时间请求造成闪烁。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
            <semi-spin .spinning=${this._delayLoading} .delay=${800} tip="延迟 800ms 后显示">
              <div
                style="width: 420px; padding: 20px; border: 1px solid var(--semi-color-border); border-radius: 8px"
              >
                点击按钮后，加载指示器会在 800ms 后出现。
              </div>
            </semi-spin>
            <semi-button size="small" @click=${this._startDelayLoading}>模拟加载</semi-button>
          </div>
        `,
        `<semi-spin .spinning=\${loading} .delay=\${800} tip="延迟 800ms 后显示">
  <div class="content">内容区域</div>
</semi-spin>`
      )}

      ${section(
        '自定义指示器',
        '通过 indicator 属性或 slot="indicator" 替换默认的旋转图标。',
        html`
          <semi-spin>
            <span
              slot="indicator"
              style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background: var(--semi-color-primary); animation: none"
            ></span>
          </semi-spin>
        `,
        `<semi-spin>
  <span slot="indicator" class="custom-indicator"></span>
</semi-spin>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'spin-docs': SpinDocs;
  }
}
