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

@customElement('radio-docs')
class RadioDocs extends LitElement {
  protected render() {
    return html`
      <h1>单选框 Radio</h1>
      <p>单选框用于在多个互斥的选项中选择一个，支持普通、按钮与卡片三种形态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/radio" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '使用 semi-radio-group 包裹一组 semi-radio。',
        html`
          <semi-radio-group default-value="A">
            <semi-radio value="A">选项 A</semi-radio>
            <semi-radio value="B">选项 B</semi-radio>
            <semi-radio value="C">选项 C</semi-radio>
          </semi-radio-group>
        `,
        `<semi-radio-group default-value="A">
  <semi-radio value="A">选项 A</semi-radio>
  <semi-radio value="B">选项 B</semi-radio>
  <semi-radio value="C">选项 C</semi-radio>
</semi-radio-group>`
      )}

      ${section(
        '按钮样式',
        '设置 type="button" 渲染为分段控制器，button-style 支持 solid 与 outline。',
        html`
          <semi-space direction="vertical">
            <semi-radio-group type="button" button-style="solid" default-value="week">
              <semi-radio value="day">日</semi-radio>
              <semi-radio value="week">周</semi-radio>
              <semi-radio value="month">月</semi-radio>
            </semi-radio-group>
            <semi-radio-group type="button" button-style="outline" default-value="month">
              <semi-radio value="day">日</semi-radio>
              <semi-radio value="week">周</semi-radio>
              <semi-radio value="month">月</semi-radio>
            </semi-radio-group>
          </semi-space>
        `,
        `<semi-radio-group type="button" button-style="solid" default-value="week">
  <semi-radio value="day">日</semi-radio>
  <semi-radio value="week">周</semi-radio>
  <semi-radio value="month">月</semi-radio>
</semi-radio-group>`
      )}

      ${section(
        '卡片样式',
        '设置 type="card" 渲染为卡片选择器。',
        html`
          <semi-radio-group type="card" default-value="pro">
            <semi-radio value="standard">标准版</semi-radio>
            <semi-radio value="pro">专业版</semi-radio>
            <semi-radio value="enterprise">企业版</semi-radio>
          </semi-radio-group>
        `,
        `<semi-radio-group type="card" default-value="pro">
  <semi-radio value="standard">标准版</semi-radio>
  <semi-radio value="pro">专业版</semi-radio>
</semi-radio-group>`
      )}

      ${section(
        '选项组',
        '通过 options 属性渲染选项组（字符串数组或对象数组）。',
        html`
          <semi-radio-group .options=${['Semi', 'Lit', 'Vite']} default-value="Semi"></semi-radio-group>
        `,
        `<semi-radio-group .options=\${['Semi', 'Lit', 'Vite']} default-value="Semi">
</semi-radio-group>`
      )}

      ${section(
        '垂直排列与禁用',
        'direction="vertical" 垂直排列；disabled 禁用整组。',
        html`
          <semi-space direction="vertical">
            <semi-radio-group direction="vertical">
              <semi-radio value="1">选项一</semi-radio>
              <semi-radio value="2">选项二</semi-radio>
            </semi-radio-group>
            <semi-radio-group disabled>
              <semi-radio value="1">禁用选项一</semi-radio>
              <semi-radio value="2">禁用选项二</semi-radio>
            </semi-radio-group>
          </semi-space>
        `,
        `<semi-radio-group direction="vertical">
  <semi-radio value="1">选项一</semi-radio>
  <semi-radio value="2">选项二</semi-radio>
</semi-radio-group>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'radio-docs': RadioDocs
  }
}
