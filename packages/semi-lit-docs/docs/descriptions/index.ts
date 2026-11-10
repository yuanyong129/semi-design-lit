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

@customElement('descriptions-docs')
class DescriptionsDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>描述列表</h1>
      <p>描述列表用于成组展示多个字段，支持多列、带边框、垂直排列与尺寸配置。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/descriptions" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 column 控制每行列数，label 与内容成对展示。',
        html`
          <semi-descriptions column="2">
            <semi-descriptions-item label="姓名">张三</semi-descriptions-item>
            <semi-descriptions-item label="部门">设计中心</semi-descriptions-item>
            <semi-descriptions-item label="职位">交互设计师</semi-descriptions-item>
            <semi-descriptions-item label="城市">杭州</semi-descriptions-item>
          </semi-descriptions>
        `,
        `<semi-descriptions column="2">
  <semi-descriptions-item label="姓名">张三</semi-descriptions-item>
  <semi-descriptions-item label="部门">设计中心</semi-descriptions-item>
  <semi-descriptions-item label="职位">交互设计师</semi-descriptions-item>
  <semi-descriptions-item label="城市">杭州</semi-descriptions-item>
</semi-descriptions>`
      )}

      ${section(
        '带边框',
        'bordered 展示表格化边框，span 可以让字段跨列。',
        html`
          <semi-descriptions column="2" bordered>
            <semi-descriptions-item label="项目">Semi Design Lit</semi-descriptions-item>
            <semi-descriptions-item label="版本">1.0.0</semi-descriptions-item>
            <semi-descriptions-item label="维护团队">组件与设计系统团队</semi-descriptions-item>
            <semi-descriptions-item label="更新时间">2026-11-10</semi-descriptions-item>
            <semi-descriptions-item label="项目地址" span="2">
              杭州市余杭区文一西路 969 号
            </semi-descriptions-item>
          </semi-descriptions>
        `,
        `<semi-descriptions column="2" bordered>
  <semi-descriptions-item label="项目">Semi Design Lit</semi-descriptions-item>
  <semi-descriptions-item label="版本">1.0.0</semi-descriptions-item>
  <semi-descriptions-item label="项目地址" span="2">…</semi-descriptions-item>
</semi-descriptions>`
      )}

      ${section(
        '垂直排列',
        'direction="vertical" 将标签放在内容上方，适合窄容器。',
        html`
          <semi-descriptions column="3" direction="vertical" bordered>
            <semi-descriptions-item label="创建人">李雷</semi-descriptions-item>
            <semi-descriptions-item label="创建时间">09:30</semi-descriptions-item>
            <semi-descriptions-item label="状态">进行中</semi-descriptions-item>
          </semi-descriptions>
        `,
        `<semi-descriptions column="3" direction="vertical" bordered>
  <semi-descriptions-item label="创建人">李雷</semi-descriptions-item>
  <semi-descriptions-item label="创建时间">09:30</semi-descriptions-item>
  <semi-descriptions-item label="状态">进行中</semi-descriptions-item>
</semi-descriptions>`
      )}

      ${section(
        '尺寸与对齐',
        'size 控制间距，align 控制内容对齐方式。',
        html`
          <semi-descriptions column="2" size="small" align="center">
            <semi-descriptions-item label="任务">组件验收</semi-descriptions-item>
            <semi-descriptions-item label="负责人">韩梅梅</semi-descriptions-item>
            <semi-descriptions-item label="截止日期">2026-11-15</semi-descriptions-item>
            <semi-descriptions-item label="优先级">高</semi-descriptions-item>
          </semi-descriptions>
        `,
        `<semi-descriptions column="2" size="small" align="center">
  <semi-descriptions-item label="任务">组件验收</semi-descriptions-item>
  <semi-descriptions-item label="负责人">韩梅梅</semi-descriptions-item>
</semi-descriptions>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'descriptions-docs': DescriptionsDocs;
  }
}
