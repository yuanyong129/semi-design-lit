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

@customElement('timeline-docs')
class TimelineDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>时间线</h1>
      <p>时间线按时间顺序展示一系列事件，支持左右布局、交替布局、反向排列与自定义节点颜色。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/timeline" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认在左侧展示时间与内容。',
        html`
          <semi-timeline>
            <semi-timeline-item time="09:00">提交需求评审</semi-timeline-item>
            <semi-timeline-item time="11:30">完成交互稿</semi-timeline-item>
            <semi-timeline-item time="15:00">组件开发与自测</semi-timeline-item>
            <semi-timeline-item time="18:00">发布预览版本</semi-timeline-item>
          </semi-timeline>
        `,
        `<semi-timeline>
  <semi-timeline-item time="09:00">提交需求评审</semi-timeline-item>
  <semi-timeline-item time="11:30">完成交互稿</semi-timeline-item>
  <semi-timeline-item time="15:00">组件开发与自测</semi-timeline-item>
</semi-timeline>`
      )}

      ${section(
        '节点颜色',
        'color 支持 blue、green、red 与 gray，用于区分事件状态。',
        html`
          <semi-timeline>
            <semi-timeline-item time="10:00" color="green">构建成功</semi-timeline-item>
            <semi-timeline-item time="10:15" color="blue">部署预发环境</semi-timeline-item>
            <semi-timeline-item time="10:40" color="red">自动化用例失败</semi-timeline-item>
            <semi-timeline-item time="11:20" color="gray">等待人工排查</semi-timeline-item>
          </semi-timeline>
        `,
        `<semi-timeline>
  <semi-timeline-item time="10:00" color="green">构建成功</semi-timeline-item>
  <semi-timeline-item time="10:40" color="red">自动化用例失败</semi-timeline-item>
  <semi-timeline-item time="11:20" color="gray">等待人工排查</semi-timeline-item>
</semi-timeline>`
      )}

      ${section(
        '交替布局',
        'mode="alternate" 让内容在时间轴两侧交替排列。',
        html`
          <semi-timeline mode="alternate">
            <semi-timeline-item time="11-01">项目立项</semi-timeline-item>
            <semi-timeline-item time="11-03">完成设计稿</semi-timeline-item>
            <semi-timeline-item time="11-06">组件开发</semi-timeline-item>
            <semi-timeline-item time="11-10">文档与发布</semi-timeline-item>
          </semi-timeline>
        `,
        `<semi-timeline mode="alternate">
  <semi-timeline-item time="11-01">项目立项</semi-timeline-item>
  <semi-timeline-item time="11-03">完成设计稿</semi-timeline-item>
  <semi-timeline-item time="11-10">文档与发布</semi-timeline-item>
</semi-timeline>`
      )}

      ${section(
        '自定义节点',
        '通过 dot 属性替换默认圆点，可配合业务图标使用。',
        html`
          <semi-timeline>
            <semi-timeline-item time="09:00" .dot=${html`<span class="timeline-star">★</span>`}>
              创建发布计划
            </semi-timeline-item>
            <semi-timeline-item time="12:00" color="green" .dot=${html`<span class="timeline-star">✓</span>`}>
              完成构建
            </semi-timeline-item>
            <semi-timeline-item time="16:00" color="red" .dot=${html`<span class="timeline-star">!</span>`}>
              回滚异常版本
            </semi-timeline-item>
          </semi-timeline>
        `,
        `<semi-timeline>
  <semi-timeline-item time="09:00" .dot=\${html\`<span>★</span>\`}>
    创建发布计划
  </semi-timeline-item>
</semi-timeline>`
      )}

      ${section(
        '反向排列',
        'reverse 将最新事件排在最前面。',
        html`
          <semi-timeline reverse>
            <semi-timeline-item time="10:00">创建任务</semi-timeline-item>
            <semi-timeline-item time="11:00">开始处理</semi-timeline-item>
            <semi-timeline-item time="12:00">任务完成</semi-timeline-item>
          </semi-timeline>
        `,
        `<semi-timeline reverse>
  <semi-timeline-item time="10:00">创建任务</semi-timeline-item>
  <semi-timeline-item time="11:00">开始处理</semi-timeline-item>
  <semi-timeline-item time="12:00">任务完成</semi-timeline-item>
</semi-timeline>`
      )}

      <style>
        .timeline-star {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          line-height: 1;
          color: #fff;
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'timeline-docs': TimelineDocs;
  }
}
