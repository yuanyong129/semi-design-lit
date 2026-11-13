import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

function slide(from: string, to: string, index: string, title: string) {
  return html`
    <div
      style="display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; padding: 0 56px; color: #fff; background: linear-gradient(120deg, ${from}, ${to});"
    >
      <span style="font-size: 13px; letter-spacing: 2px; opacity: 0.72;">SLIDE ${index}</span>
      <span style="margin-top: 8px; font-size: 32px; font-weight: 700;">${title}</span>
      <span style="margin-top: 10px; font-size: 14px; opacity: 0.82;">Semi Design Lit Carousel</span>
    </div>
  `;
}

@customElement('carousel-docs')
class CarouselDocs extends LitElement {
  @state()
  private _current = 0;

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>轮播图</h1>
      <p>轮播图用于循环展示一组内容，支持自动播放、循环、指示器、箭头与切换事件。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/carousel" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '将内容作为 semi-carousel 的直接子元素，默认显示圆点指示器，鼠标移入显示箭头。',
        html`
          <semi-carousel height="240">
            ${slide('#4c6ef5', '#7048e8', '01', '设计系统')}
            ${slide('#0ca678', '#1098ad', '02', '组件库')}
            ${slide('#f08c00', '#d6336c', '03', '主题定制')}
          </semi-carousel>
        `,
        `<semi-carousel height="240">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</semi-carousel>`
      )}

      ${section(
        '指示器与箭头',
        'indicator-type 支持 dot、line、slider，show-arrow 控制箭头显示时机，indicator-position 控制水平位置。',
        html`
          <semi-carousel
            height="220"
            indicator-type="line"
            indicator-position="left"
            show-arrow="always"
          >
            ${slide('#7048e8', '#4c6ef5', '01', '线性指示器')}
            ${slide('#1098ad', '#0ca678', '02', '箭头常显')}
            ${slide('#d6336c', '#f08c00', '03', '左侧对齐')}
          </semi-carousel>
        `,
        `<semi-carousel
  indicator-type="line"
  indicator-position="left"
  show-arrow="always"
>
  …
</semi-carousel>`
      )}

      ${section(
        '自动播放',
        'autoplay 开启自动播放，interval 设置间隔毫秒数，pause-on-hover 控制悬停时是否暂停。',
        html`
          <semi-carousel height="220" autoplay interval="2500">
            ${slide('#0ca678', '#1098ad', '01', '自动播放')}
            ${slide('#f08c00', '#d6336c', '02', '悬停暂停')}
            ${slide('#4c6ef5', '#7048e8', '03', '循环切换')}
          </semi-carousel>
        `,
        `<semi-carousel autoplay interval="2500" pause-on-hover>
  …
</semi-carousel>`
      )}

      ${section(
        '滑块指示器',
        'indicator-type="slider" 在底部展示进度条，适合强调播放进度的场景。',
        html`
          <semi-carousel height="200" indicator-type="slider" show-arrow="never">
            ${slide('#d6336c', '#f08c00', '01', '进度指示')}
            ${slide('#4c6ef5', '#7048e8', '02', '简洁展示')}
            ${slide('#0ca678', '#1098ad', '03', '自动推进')}
          </semi-carousel>
        `,
        `<semi-carousel indicator-type="slider" show-arrow="never">
  …
</semi-carousel>`
      )}

      ${section(
        '切换事件',
        '切换时派发 change 事件，detail 包含 current、prev 与当前元素。',
        html`
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <semi-tag color="blue">当前第 ${this._current + 1} 张</semi-tag>
          </div>
          <semi-carousel
            height="200"
            @change=${(event: CustomEvent<{ current: number }>) => {
              this._current = event.detail.current;
            }}
          >
            ${slide('#4c6ef5', '#1098ad', '01', '事件一')}
            ${slide('#0ca678', '#7048e8', '02', '事件二')}
            ${slide('#f08c00', '#d6336c', '03', '事件三')}
          </semi-carousel>
        `,
        `<semi-carousel @change=\${(e) => (current = e.detail.current)}>
  …
</semi-carousel>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'carousel-docs': CarouselDocs;
  }
}
