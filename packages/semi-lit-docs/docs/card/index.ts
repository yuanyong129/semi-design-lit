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

const coverStyle = [
  'height: 120px',
  'display: flex',
  'align-items: center',
  'justify-content: center',
  'background: linear-gradient(135deg, #4c6ef5 0%, #7048e8 50%, #d6336c 100%)',
  'color: #fff',
  'font-size: 20px',
  'font-weight: 600',
  'letter-spacing: 1px',
].join('; ');

@customElement('card-docs')
class CardDocs extends LitElement {
  @state()
  private _loading = false;

  protected createRenderRoot() {
    return this;
  }

  private _toggleLoading() {
    this._loading = !this._loading;
  }

  protected render() {
    return html`
      <h1>卡片</h1>
      <p>卡片用于承载一组相关信息，支持标题、封面、底部区域、操作区与加载态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/card" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 title 设置标题，header-extra 插槽放置标题右侧内容，footer 插槽放置底部内容。',
        html`
          <semi-card title="设计系统" style="width: 100%">
            <span slot="header-extra"><semi-tag color="blue" size="small">NEW</semi-tag></span>
            <div>设计系统是组件库的基础，统一颜色、字体、间距与圆角，让产品在视觉上保持一致。</div>
            <div slot="footer">更新于 2026-10-25</div>
          </semi-card>
        `,
        `<semi-card title="设计系统">
  <span slot="header-extra"><semi-tag color="blue" size="small">NEW</semi-tag></span>
  <div>设计系统是组件库的基础……</div>
  <div slot="footer">更新于 2026-10-25</div>
</semi-card>`
      )}

      ${section(
        '封面',
        'cover 插槽用于放置封面图片或自定义内容。',
        html`
          <semi-card title="Semi Design Lit" style="width: 100%">
            <div slot="cover" style=${coverStyle}>Semi Design</div>
            <div>基于 Lit 与 Web Components 实现的 Semi Design 组件库，可在任意框架中使用。</div>
          </semi-card>
        `,
        `<semi-card title="Semi Design Lit">
  <img slot="cover" src="/cover.png" alt="cover" />
  <div>基于 Lit 与 Web Components 实现的 Semi Design 组件库。</div>
</semi-card>`
      )}

      ${section(
        '阴影与边框',
        'shadows 控制阴影显示时机，bordered 控制是否显示边框。',
        html`
          <div style="display: grid; gap: 16px; width: 100%">
            <semi-card title="默认阴影" style="width: 100%">
              <div>shadows="always"，始终显示阴影。</div>
            </semi-card>
            <semi-card title="悬浮阴影" shadows="hover" .bordered=${false} style="width: 100%">
              <div>shadows="hover"，鼠标悬浮时显示阴影，适合可点击卡片。</div>
            </semi-card>
          </div>
        `,
        `<semi-card title="悬浮阴影" shadows="hover" .bordered=\${false}>
  悬浮时显示阴影
</semi-card>`
      )}

      ${section(
        '操作区',
        'actions 在卡片底部生成等宽操作区，适合喜欢、收藏、分享等操作。',
        html`
          <semi-card
            title="组件更新"
            style="width: 100%"
            .actions=${[
              html`<semi-icon-heart-fill></semi-icon-heart-fill>喜欢`,
              html`<semi-icon-star-fill></semi-icon-star-fill>收藏`,
              html`<semi-icon-more></semi-icon-more>更多`,
            ]}
          >
            <div>本次更新包含 Card、Avatar 与 Badge 三个基础展示组件。</div>
          </semi-card>
        `,
        `<semi-card title="组件更新" .actions=\${[html\`喜欢\`, html\`收藏\`]}>
  <div>本次更新包含三个基础展示组件。</div>
</semi-card>`
      )}

      ${section(
        '加载状态',
        'loading 为 true 时，内容区展示骨架屏占位。',
        html`
          <div style="display: grid; gap: 12px; width: 100%">
            <semi-card title="加载中" .loading=${this._loading} style="width: 100%">
              <div>这里是被加载的内容，切换加载状态后重新出现。</div>
            </semi-card>
            <semi-button size="small" @click=${this._toggleLoading}>
              ${this._loading ? '显示内容' : '切换加载'}
            </semi-button>
          </div>
        `,
        `<semi-card title="加载中" .loading=\${true}>
  这里是被加载的内容。
</semi-card>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'card-docs': CardDocs;
  }
}
