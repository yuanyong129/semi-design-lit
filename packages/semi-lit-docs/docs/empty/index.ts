import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <h2>${title}</h2>
    <p>${description}</p>
    <code-demo>${demo}</code-demo>
    <code-content .code=${code}></code-content>
  `;
}

@customElement('empty-docs')
class EmptyDocs extends LitElement {
  protected render() {
    return html`
      <h1>空状态 Empty</h1>
      <p>空状态用于展示暂无数据、搜索无结果等场景。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/empty" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认展示内置插画与「暂无数据」描述。',
        html`<semi-empty></semi-empty>`,
        `<semi-empty></semi-empty>`
      )}

      ${section(
        '自定义文案',
        '通过 title 与 description 自定义标题和描述。',
        html`
          <semi-empty title="暂无搜索结果" description="尝试更换关键词后重试"></semi-empty>
        `,
        `<semi-empty
  title="暂无搜索结果"
  description="尝试更换关键词后重试"
></semi-empty>`
      )}

      ${section(
        '自定义图片',
        '通过 image 属性或 slot="image" 自定义插画。',
        html`
          <semi-empty
            title="还没有收藏"
            description="收藏的内容会出现在这里"
            .image=${html`<semi-icon-star-fill style="color: var(--semi-color-warning);"></semi-icon-star-fill>`}
          ></semi-empty>
        `,
        `<semi-empty title="还没有收藏" description="收藏的内容会出现在这里">
  <semi-icon-star-fill slot="image"></semi-icon-star-fill>
</semi-empty>`
      )}

      ${section(
        '横向布局',
        '设置 layout="horizontal" 让图片与文案横向排列。',
        html`
          <semi-empty layout="horizontal" title="暂无数据" description="请先创建一个任务"></semi-empty>
        `,
        `<semi-empty
  layout="horizontal"
  title="暂无数据"
  description="请先创建一个任务"
></semi-empty>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'empty-docs': EmptyDocs
  }
}
