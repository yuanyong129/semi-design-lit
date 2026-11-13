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

const scrollDemoStyle =
  'position: relative; height: 220px; overflow: hidden; border: 1px solid var(--semi-color-border); border-radius: 8px; background: var(--semi-color-bg-2);';
const scrollAreaStyle = 'height: 100%; overflow: auto; padding: 16px; box-sizing: border-box;';

@customElement('back-top-docs')
class BackTopDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected firstUpdated(): void {
    window.setTimeout(() => {
      const first = this.querySelector<HTMLElement>('.back-top-scroll-a');
      const second = this.querySelector<HTMLElement>('.back-top-scroll-b');
      if (first) {
        first.scrollTop = 140;
        first.dispatchEvent(new Event('scroll'));
      }
      if (second) {
        second.scrollTop = 90;
        second.dispatchEvent(new Event('scroll'));
      }
    }, 120);
  }

  protected render() {
    return html`
      <h1>回到顶部</h1>
      <p>回到顶部按钮在滚动超过阈值后出现，点击后平滑滚动回容器顶部。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/backTop" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'target 指定滚动容器，visibility-height 控制按钮出现的滚动阈值，duration 控制回滚动画时长。',
        html`
          <div style=${scrollDemoStyle}>
            <div class="back-top-scroll-a" style=${scrollAreaStyle}>
              <p style="margin: 0 0 12px; font-weight: 600">滚动容器</p>
              <p style="color: var(--semi-color-text-2)">向下滚动超过 80px 后，右下角出现回到顶部按钮。</p>
              ${Array.from(
                { length: 8 },
                (_, index) => html`
                  <div
                    style="height: 48px; display: flex; align-items: center; border-bottom: 1px solid var(--semi-color-border); color: var(--semi-color-text-1)"
                  >
                    列表项 ${index + 1}
                  </div>
                `
              )}
            </div>
            <semi-back-top
              style="position: absolute; right: 16px; bottom: 16px"
              target=".back-top-scroll-a"
              visibility-height="80"
            ></semi-back-top>
          </div>
        `,
        `<div class="scroll-container" style="height: 220px; overflow: auto">
  <div style="height: 600px">滚动内容</div>
</div>
<semi-back-top target=".scroll-container" visibility-height="80"></semi-back-top>`
      )}

      ${section(
        '自定义内容与时长',
        '默认插槽可替换按钮内容，duration 设置为 800ms 可获得更慢的回滚动画。',
        html`
          <div style=${scrollDemoStyle}>
            <div class="back-top-scroll-b" style=${scrollAreaStyle}>
              <p style="margin: 0 0 12px; font-weight: 600">自定义按钮</p>
              <p style="color: var(--semi-color-text-2)">按钮内容替换为 TOP，回滚动画时长 800ms。</p>
              ${Array.from(
                { length: 7 },
                (_, index) => html`
                  <div
                    style="height: 52px; display: flex; align-items: center; border-bottom: 1px solid var(--semi-color-border); color: var(--semi-color-text-1)"
                  >
                    自定义内容 ${index + 1}
                  </div>
                `
              )}
            </div>
            <semi-back-top
              style="position: absolute; right: 16px; bottom: 16px"
              target=".back-top-scroll-b"
              visibility-height="40"
              duration="800"
            >
              <span style="font-size: 12px; font-weight: 600">TOP</span>
            </semi-back-top>
          </div>
        `,
        `<semi-back-top target=".scroll-container" visibility-height="40" duration="800">
  <span>TOP</span>
</semi-back-top>`
      )}

      ${section(
        '页面级回到顶部',
        '不传 target 时监听 window，适合长页面。',
        html`
          <p style="margin: 0; color: var(--semi-color-text-2)">
            页面滚动超过 400px 后，按钮会固定在视口右下角。
          </p>
          <semi-back-top></semi-back-top>
        `,
        `<semi-back-top></semi-back-top>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'back-top-docs': BackTopDocs;
  }
}
