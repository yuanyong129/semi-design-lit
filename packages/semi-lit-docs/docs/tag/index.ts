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

const colors = [
  'amber', 'blue', 'cyan', 'green', 'grey', 'indigo', 'light-blue', 'light-green',
  'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'violet', 'yellow', 'white',
];

@customElement('tag-docs')
class TagDocs extends LitElement {
  protected render() {
    return html`
      <h1>标签 Tag</h1>
      <p>标签用于标记事物的属性与分类，支持多种颜色、尺寸、形状与关闭交互。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/tag" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '默认标签为 light 类型，浅色背景；type 还支持 ghost 与 solid。',
        html`
          <semi-space wrap>
            <semi-tag>默认标签</semi-tag>
            <semi-tag color="blue">蓝色标签</semi-tag>
            <semi-tag color="green">绿色标签</semi-tag>
            <semi-tag color="orange">橙色标签</semi-tag>
            <semi-tag color="red">红色标签</semi-tag>
          </semi-space>
        `,
        `<semi-tag color="blue">蓝色标签</semi-tag>`
      )}

      ${section(
        '全部颜色',
        '内置 17 种颜色，也支持传入自定义色值。',
        html`
          <semi-space wrap>
            ${colors.map((color) => html`<semi-tag color=${color}>${color}</semi-tag>`)}
            <semi-tag color="#8e44ad">#8e44ad</semi-tag>
          </semi-space>
        `,
        `<semi-tag color="amber">amber</semi-tag>
<semi-tag color="blue">blue</semi-tag>
<semi-tag color="cyan">cyan</semi-tag>
<semi-tag color="#8e44ad">#8e44ad</semi-tag>`
      )}

      ${section(
        '实心标签',
        '设置 type="solid" 使用实心背景。',
        html`
          <semi-space wrap>
            <semi-tag type="solid">默认</semi-tag>
            <semi-tag type="solid" color="blue">蓝色</semi-tag>
            <semi-tag type="solid" color="green">绿色</semi-tag>
            <semi-tag type="solid" color="red">红色</semi-tag>
          </semi-space>
        `,
        `<semi-tag type="solid" color="blue">蓝色</semi-tag>`
      )}

      ${section(
        '尺寸与形状',
        '支持 small、default、large 尺寸，shape="circle" 渲染为圆角胶囊。',
        html`
          <semi-space wrap align="center">
            <semi-tag size="small" color="blue">Small</semi-tag>
            <semi-tag color="blue">Default</semi-tag>
            <semi-tag size="large" color="blue">Large</semi-tag>
            <semi-tag shape="circle" color="green">Circle</semi-tag>
            <semi-tag shape="circle" size="large" color="purple">Circle Large</semi-tag>
          </semi-space>
        `,
        `<semi-tag size="small" color="blue">Small</semi-tag>
<semi-tag size="large" color="blue">Large</semi-tag>
<semi-tag shape="circle" color="green">Circle</semi-tag>`
      )}

      ${section(
        '可关闭',
        '设置 closable 显示关闭按钮，点击后触发 close 事件并隐藏。',
        html`
          <semi-space wrap>
            <semi-tag closable color="blue">可关闭标签</semi-tag>
            <semi-tag closable color="green">点击右侧关闭</semi-tag>
            <semi-tag closable type="solid" color="red">实心可关闭</semi-tag>
          </semi-space>
        `,
        `<semi-tag closable color="blue">可关闭标签</semi-tag>`
      )}

      ${section(
        '带图标',
        '通过 slot="prefix-icon" 与 slot="suffix-icon" 添加图标。',
        html`
          <semi-space wrap>
            <semi-tag color="blue">
              <semi-icon-star slot="prefix-icon"></semi-icon-star>收藏
            </semi-tag>
            <semi-tag color="green">
              已完成<semi-icon-check slot="suffix-icon"></semi-icon-check>
            </semi-tag>
          </semi-space>
        `,
        `<semi-tag color="blue">
  <semi-icon-star slot="prefix-icon"></semi-icon-star>收藏
</semi-tag>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-docs': TagDocs
  }
}
