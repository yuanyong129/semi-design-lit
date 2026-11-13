import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block demo-block-wide">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

function makeImage(from: string, to: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
</linearGradient></defs>
<rect width="960" height="600" fill="url(#g)"/>
<circle cx="760" cy="130" r="96" fill="rgba(255,255,255,0.16)"/>
<circle cx="840" cy="250" r="42" fill="rgba(255,255,255,0.12)"/>
<text x="64" y="330" fill="#fff" font-family="Arial, sans-serif" font-size="66" font-weight="700">${label}</text>
<text x="66" y="388" fill="rgba(255,255,255,0.82)" font-family="Arial, sans-serif" font-size="24">Semi Design Lit</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const cover = makeImage('#4c6ef5', '#7048e8', 'Semi');
const mountain = makeImage('#0ca678', '#1098ad', 'Nature');
const sunset = makeImage('#f08c00', '#d6336c', 'Sunset');

@customElement('image-docs')
class ImageDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>图片</h1>
      <p>图片组件支持加载占位、失败替换、不同填充方式与点击预览，预览中可缩放和旋转。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/image" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 src 设置图片地址，width 与 height 控制容器尺寸，点击图片可打开预览。',
        html`
          <semi-image
            .src=${cover}
            alt="Semi Design"
            .width=${320}
            .height=${200}
            style="border-radius: 8px; overflow: hidden;"
          ></semi-image>
        `,
        `<semi-image
  src="/cover.png"
  alt="Semi Design"
  .width=\${320}
  .height=\${200}
/>`
      )}

      ${section(
        '填充方式',
        'fit 对应 object-fit，可选 cover、contain、fill、none 与 scale-down。',
        html`
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div>
              <semi-image .src=${mountain} alt="cover" fit="cover" .width=${220} .height=${150} style="border-radius: 6px; overflow: hidden;"></semi-image>
              <p style="margin: 8px 0 0; font-size: 12px; color: var(--semi-color-text-2);">cover</p>
            </div>
            <div>
              <semi-image .src=${mountain} alt="contain" fit="contain" .width=${220} .height=${150} style="border-radius: 6px; overflow: hidden;"></semi-image>
              <p style="margin: 8px 0 0; font-size: 12px; color: var(--semi-color-text-2);">contain</p>
            </div>
            <div>
              <semi-image .src=${sunset} alt="fill" fit="fill" .width=${220} .height=${150} style="border-radius: 6px; overflow: hidden;"></semi-image>
              <p style="margin: 8px 0 0; font-size: 12px; color: var(--semi-color-text-2);">fill</p>
            </div>
          </div>
        `,
        `<semi-image src="/cover.png" fit="contain" .width=\${220} .height=\${150} />`
      )}

      ${section(
        '预览',
        'preview 默认为 true，点击图片打开大图预览，底部工具条支持放大、缩小、旋转与关闭。',
        html`
          <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
            <semi-image .src=${sunset} alt="Sunset" .width=${300} .height=${188} style="border-radius: 8px; overflow: hidden;"></semi-image>
            <p style="margin: 0; max-width: 300px; font-size: 13px; color: var(--semi-color-text-2);">
              点击左侧图片体验预览，按 Esc 或点击关闭按钮退出。
            </p>
          </div>
        `,
        `<semi-image src="/sunset.png" .width=\${300} .height=\${188} preview />`
      )}

      ${section(
        '加载失败',
        '图片加载失败时可使用 fallback 指定替换图，未指定时展示错误占位。',
        html`
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <semi-image
              src="/missing-image.png"
              alt="加载失败"
              .fallback=${mountain}
              .width=${220}
              .height=${150}
              style="border-radius: 6px; overflow: hidden;"
            ></semi-image>
            <semi-image
              src="/missing-image-2.png"
              alt="无替换图"
              .width=${220}
              .height=${150}
              style="border-radius: 6px; overflow: hidden;"
            ></semi-image>
          </div>
        `,
        `<semi-image src="/missing.png" fallback="/fallback.png" .width=\${220} .height=\${150} />
<semi-image src="/missing.png" .width=\${220} .height=\${150} />`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-docs': ImageDocs;
  }
}
