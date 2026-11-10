import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
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

const avatarImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4c6ef5"/>
        <stop offset="1" stop-color="#d6336c"/>
      </linearGradient>
    </defs>
    <rect width="160" height="160" fill="url(#g)"/>
    <circle cx="80" cy="62" r="28" fill="rgba(255,255,255,.9)"/>
    <path d="M28 160c0-30 23-52 52-52s52 22 52 52" fill="rgba(255,255,255,.9)"/>
  </svg>
`)}`;

@customElement('avatar-docs')
class AvatarDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>头像</h1>
      <p>头像用于展示用户或实体身份，支持文字、图片、尺寸、形状与自定义颜色。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/avatar" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认展示 40px 圆形头像，可放置文字或图片。',
        html`
          <semi-space align="center" wrap>
            <semi-avatar>S</semi-avatar>
            <semi-avatar color="#2f9e44">A</semi-avatar>
            <semi-avatar color="#e8590c">B</semi-avatar>
            <semi-avatar src=${avatarImage} alt="Semi Design"></semi-avatar>
          </semi-space>
        `,
        `<semi-avatar>S</semi-avatar>
<semi-avatar src="/avatar.png" alt="Semi Design"></semi-avatar>`
      )}

      ${section(
        '尺寸',
        'size 支持内置尺寸，也可以传入数字设置具体像素。',
        html`
          <semi-space align="center" wrap>
            <semi-avatar size="extra-small">XS</semi-avatar>
            <semi-avatar size="small">S</semi-avatar>
            <semi-avatar>D</semi-avatar>
            <semi-avatar size="medium">M</semi-avatar>
            <semi-avatar size="large">L</semi-avatar>
            <semi-avatar size="extra-large">XL</semi-avatar>
            <semi-avatar size="72" color="#7048e8">72</semi-avatar>
          </semi-space>
        `,
        `<semi-avatar size="small">S</semi-avatar>
<semi-avatar size="large">L</semi-avatar>
<semi-avatar size="72">72</semi-avatar>`
      )}

      ${section(
        '形状与颜色',
        'shape 支持 circle 与 square，color 设置背景色。',
        html`
          <semi-space align="center" wrap>
            <semi-avatar shape="square">S</semi-avatar>
            <semi-avatar shape="square" color="#2f9e44">A</semi-avatar>
            <semi-avatar shape="square" color="#e8590c">B</semi-avatar>
            <semi-avatar shape="circle" color="#7048e8">C</semi-avatar>
            <semi-avatar shape="circle" color="#0b7285">D</semi-avatar>
          </semi-space>
        `,
        `<semi-avatar shape="square" color="#2f9e44">A</semi-avatar>
<semi-avatar shape="circle" color="#7048e8">C</semi-avatar>`
      )}

      ${section(
        '组合',
        '多个头像可以通过负边距叠放，用于展示协作成员。',
        html`
          <div style="display: flex; align-items: center; padding-left: 12px">
            ${['S', 'A', 'B', 'C'].map(
              (text, index) => html`
                <semi-avatar
                  style="margin-left: -12px; border: 2px solid var(--semi-color-bg-1); z-index: ${4 - index}"
                  color=${['#4c6ef5', '#2f9e44', '#e8590c', '#7048e8'][index]}
                >
                  ${text}
                </semi-avatar>
              `
            )}
            <span style="margin-left: 12px; color: var(--semi-color-text-2); font-size: 14px">等 8 人</span>
          </div>
        `,
        `<div style="display: flex">
  <semi-avatar style="margin-left: -12px">S</semi-avatar>
  <semi-avatar style="margin-left: -12px">A</semi-avatar>
</div>`
      )}

      ${section(
        '图片与回退',
        '设置 src 展示图片；图片加载失败时回退到默认插槽内容。',
        html`
          <semi-space align="center" wrap>
            <semi-avatar size="large" src=${avatarImage} alt="Semi Design"></semi-avatar>
            <semi-avatar size="large" src="/not-found-avatar.png" alt="Fallback">S</semi-avatar>
            <semi-avatar size="large" fallback="SD"></semi-avatar>
          </semi-space>
        `,
        `<semi-avatar src="/avatar.png" alt="Semi Design">S</semi-avatar>
<semi-avatar src="/not-found.png" fallback="SD"></semi-avatar>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'avatar-docs': AvatarDocs;
  }
}
