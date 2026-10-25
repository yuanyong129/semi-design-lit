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

@customElement('progress-docs')
class ProgressDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>进度条</h1>
      <p>Progress 展示任务进度，支持线性 / 环形、状态、尺寸与自定义文本。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/progress" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '线性进度',
        '通过 percent 设置进度，status 控制颜色与动画。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
            <semi-progress percent=${30}></semi-progress>
            <semi-progress percent=${60} status="active"></semi-progress>
            <semi-progress percent=${100} status="success"></semi-progress>
          </div>
        `,
        `<semi-progress percent="30"></semi-progress>
<semi-progress percent="60" status="active"></semi-progress>
<semi-progress percent="100" status="success"></semi-progress>`
      )}

      ${section(
        '环形进度',
        'type="circle" 展示环形进度，可配合 size 调整尺寸。',
        html`
          <semi-space>
            <semi-progress type="circle" percent=${25} size="small"></semi-progress>
            <semi-progress type="circle" percent=${50}></semi-progress>
            <semi-progress type="circle" percent=${75} status="success" size="large"></semi-progress>
          </semi-space>
        `,
        `<semi-progress type="circle" percent="50"></semi-progress>
<semi-progress type="circle" percent="75" status="success" size="large"></semi-progress>`
      )}

      ${section(
        '自定义文本',
        '通过 format 自定义百分比文本；show-info="false" 可隐藏文本。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
            <semi-progress percent=${45} .format=${(percent: number) => `${percent} / 100 项`}></semi-progress>
            <semi-progress percent=${70} .showInfo=${false}></semi-progress>
          </div>
        `,
        `<semi-progress percent="45" .format=\${(p) => p + ' / 100 项'}></semi-progress>
<semi-progress percent="70" show-info="false"></semi-progress>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'progress-docs': ProgressDocs
  }
}
