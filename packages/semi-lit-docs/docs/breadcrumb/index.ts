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

@customElement('breadcrumb-docs')
class BreadcrumbDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>面包屑</h1>
      <p>面包屑用于展示当前页面在层级结构中的位置，支持自定义分隔符、链接与紧凑模式。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/breadcrumb" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'semi-breadcrumb 包裹多个 semi-breadcrumb-item，最后一项自动高亮。',
        html`
          <semi-breadcrumb>
            <semi-breadcrumb-item>首页</semi-breadcrumb-item>
            <semi-breadcrumb-item>组件</semi-breadcrumb-item>
            <semi-breadcrumb-item current>面包屑</semi-breadcrumb-item>
          </semi-breadcrumb>
        `,
        `<semi-breadcrumb>
  <semi-breadcrumb-item>首页</semi-breadcrumb-item>
  <semi-breadcrumb-item>组件</semi-breadcrumb-item>
  <semi-breadcrumb-item current>面包屑</semi-breadcrumb-item>
</semi-breadcrumb>`
      )}

      ${section(
        '自定义分隔符',
        'separator 设置分隔符，compact 开启紧凑模式。',
        html`
          <semi-space direction="vertical" .spacing=${16} style="width: 100%">
            <semi-breadcrumb separator="›">
              <semi-breadcrumb-item>设计</semi-breadcrumb-item>
              <semi-breadcrumb-item>基础</semi-breadcrumb-item>
              <semi-breadcrumb-item current>颜色</semi-breadcrumb-item>
            </semi-breadcrumb>
            <semi-breadcrumb separator="·" compact>
              <semi-breadcrumb-item>项目</semi-breadcrumb-item>
              <semi-breadcrumb-item>文档</semi-breadcrumb-item>
              <semi-breadcrumb-item current>快速开始</semi-breadcrumb-item>
            </semi-breadcrumb>
          </semi-space>
        `,
        `<semi-breadcrumb separator="›">…</semi-breadcrumb>
<semi-breadcrumb separator="·" compact>…</semi-breadcrumb>`
      )}

      ${section(
        '链接与禁用',
        '设置 href 渲染为链接，disabled 禁用某一项。',
        html`
          <semi-breadcrumb>
            <semi-breadcrumb-item href="/">首页</semi-breadcrumb-item>
            <semi-breadcrumb-item disabled>工作台</semi-breadcrumb-item>
            <semi-breadcrumb-item current>数据概览</semi-breadcrumb-item>
          </semi-breadcrumb>
        `,
        `<semi-breadcrumb>
  <semi-breadcrumb-item href="/">首页</semi-breadcrumb-item>
  <semi-breadcrumb-item disabled>工作台</semi-breadcrumb-item>
  <semi-breadcrumb-item current>数据概览</semi-breadcrumb-item>
</semi-breadcrumb>`
      )}
    `;
  }
}
