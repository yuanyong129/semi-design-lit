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

const cardStyle =
  'padding: 16px; border: 1px solid var(--semi-color-border); border-radius: 8px; background: var(--semi-color-bg-2);';

@customElement('collapsible-docs')
class CollapsibleDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _open = false;

  @state()
  private _durationOpen = false;

  @state()
  private _heightOpen = false;

  @state()
  private _adaptiveOpen = false;

  @state()
  private _fadeOpen = false;

  @state()
  private _lazyOpen = false;

  @state()
  private _reCalcKey = 0;

  protected render() {
    return html`
      <h1>折叠动画</h1>
      <p>折叠动画是一个无头容器，只负责高度与透明度过渡，标题、图标与键盘交互由 Collapse 组件提供。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/collapsible" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'is-open 控制展开状态，容器会在 250ms 内平滑改变高度。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
            <semi-button @click=${() => (this._open = !this._open)}>
              ${this._open ? '收起' : '展开'}
            </semi-button>
            <semi-collapsible ?is-open=${this._open} style="width: 100%">
              <div style=${cardStyle}>
                <strong>折叠内容</strong>
                <p style="margin: 8px 0 0; color: var(--semi-color-text-2)">
                  这里是需要展开或收起的内容，高度变化会通过 CSS transition 平滑过渡。
                </p>
              </div>
            </semi-collapsible>
          </div>
        `,
        `<semi-collapsible ?is-open=\${open}>
  <div class="content">折叠内容</div>
</semi-collapsible>`
      )}

      ${section(
        '动画时长',
        'duration 控制动画时长，单位为毫秒。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
            <semi-button @click=${() => (this._durationOpen = !this._durationOpen)}>
              ${this._durationOpen ? '收起' : '展开'}
            </semi-button>
            <semi-collapsible
              ?is-open=${this._durationOpen}
              duration="600"
              style="width: 100%"
            >
              <div style=${cardStyle}>
                600ms 的展开与收起动画，适合需要强调过渡的场景。
              </div>
            </semi-collapsible>
          </div>
        `,
        `<semi-collapsible ?is-open=\${open} duration="600">
  <div class="content">600ms 动画</div>
</semi-collapsible>`
      )}

      ${section(
        '折叠高度',
        'collapse-height 在关闭时保留指定高度，collapse-height-adaptive 会将关闭高度限制在内容高度以内。',
        html`
          <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start">
            <div style="width: 100%">
              <semi-button @click=${() => (this._heightOpen = !this._heightOpen)}>
                ${this._heightOpen ? '收起' : '展开'}
              </semi-button>
              <semi-collapsible
                ?is-open=${this._heightOpen}
                collapse-height="48"
                style="width: 100%"
              >
                <div style=${cardStyle}>
                  <strong>保留 48px</strong>
                  <p style="margin: 8px 0 0; color: var(--semi-color-text-2)">
                    关闭时只展示标题区域，剩余内容被裁剪。
                  </p>
                </div>
              </semi-collapsible>
            </div>
            <div style="width: 100%">
              <semi-button @click=${() => (this._adaptiveOpen = !this._adaptiveOpen)}>
                ${this._adaptiveOpen ? '收起' : '展开'}
              </semi-button>
              <semi-collapsible
                ?is-open=${this._adaptiveOpen}
                collapse-height="96"
                collapse-height-adaptive
                style="width: 100%"
              >
                <div style=${cardStyle}>内容高度小于 96px 时，关闭高度自适应为内容高度。</div>
              </semi-collapsible>
            </div>
          </div>
        `,
        `<semi-collapsible ?is-open=\${open} collapse-height="48">
  <div class="content">保留 48px</div>
</semi-collapsible>
<semi-collapsible ?is-open=\${open} collapse-height="96" collapse-height-adaptive>
  <div class="content">高度自适应</div>
</semi-collapsible>`
      )}

      ${section(
        '淡入淡出',
        'fade 在关闭时同时淡出内容，collapse-height 为 0 时效果最明显。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
            <semi-button @click=${() => (this._fadeOpen = !this._fadeOpen)}>
              ${this._fadeOpen ? '收起' : '展开'}
            </semi-button>
            <semi-collapsible
              ?is-open=${this._fadeOpen}
              fade
              style="width: 100%"
            >
              <div style=${cardStyle}>淡入淡出的折叠内容。</div>
            </semi-collapsible>
          </div>
        `,
        `<semi-collapsible ?is-open=\${open} fade>
  <div class="content">淡入淡出</div>
</semi-collapsible>`
      )}

      ${section(
        '延迟渲染',
        'lazy-render 在首次展开时才挂载内容，re-calc-key 变化会重新测量高度。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
            <div style="display: flex; gap: 8px">
              <semi-button @click=${() => (this._lazyOpen = !this._lazyOpen)}>
                ${this._lazyOpen ? '收起' : '展开'}
              </semi-button>
              <semi-button
                @click=${() => {
                  this._reCalcKey += 1;
                }}
              >
                重新测量
              </semi-button>
            </div>
            <semi-collapsible
              ?is-open=${this._lazyOpen}
              lazy-render
              re-calc-key=${this._reCalcKey}
              style="width: 100%"
            >
              <div style=${cardStyle}>
                <p style="margin: 0">这段内容首次展开后才被渲染。</p>
                <p style="margin: 8px 0 0; color: var(--semi-color-text-2)">
                  打开后点击“重新测量”，容器会重新读取内容高度。
                </p>
              </div>
            </semi-collapsible>
          </div>
        `,
        `<semi-collapsible ?is-open=\${open} lazy-render re-calc-key=\${reCalcKey}>
  <div class="content">首次展开后渲染</div>
</semi-collapsible>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'collapsible-docs': CollapsibleDocs;
  }
}
