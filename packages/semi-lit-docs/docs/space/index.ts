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

@customElement('space-docs')
class SpaceDocs extends LitElement {
  protected render() {
    return html`
      <h1>间距 Space</h1>
      <p>间距组件用于设置一组元素之间的统一间距。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/space" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '相邻元素默认间距为 8px。',
        html`
          <semi-space>
            <semi-button>按钮</semi-button>
            <semi-tag color="blue">标签</semi-tag>
            <semi-link>链接</semi-link>
          </semi-space>
        `,
        `<semi-space>
  <semi-button>按钮</semi-button>
  <semi-tag color="blue">标签</semi-tag>
  <semi-link>链接</semi-link>
</semi-space>`
      )}

      ${section(
        '垂直间距',
        '设置 direction="vertical" 垂直排列。',
        html`
          <semi-space direction="vertical">
            <semi-button type="primary">第一个按钮</semi-button>
            <semi-button>第二个按钮</semi-button>
            <semi-button type="tertiary">第三个按钮</semi-button>
          </semi-space>
        `,
        `<semi-space direction="vertical">
  <semi-button type="primary">第一个按钮</semi-button>
  <semi-button>第二个按钮</semi-button>
</semi-space>`
      )}

      ${section(
        '自定义间距',
        'spacing 支持数字、tight(8)、medium(16)、loose(24)，以及 [水平, 垂直] 数组。',
        html`
          <semi-space .spacing=${24}>
            <semi-button>24px</semi-button>
            <semi-button>间距</semi-button>
            <semi-button>示例</semi-button>
          </semi-space>
        `,
        `<semi-space .spacing=\${24}>
  <semi-button>24px</semi-button>
  <semi-button>间距</semi-button>
</semi-space>`
      )}

      ${section(
        '自动折行',
        '设置 wrap 后内容自动折行，可配合 spacing 数组控制行间距。',
        html`
          <semi-space wrap .spacing=${[8, 16]} style="width: 320px">
            ${Array.from({ length: 8 }).map((_, index) => html`<semi-tag color="blue">标签 ${index + 1}</semi-tag>`)}
          </semi-space>
        `,
        `<semi-space wrap .spacing=\${[8, 16]}>
  <semi-tag>标签 1</semi-tag>
  <semi-tag>标签 2</semi-tag>
</semi-space>`
      )}

      ${section(
        '对齐方式',
        'align 支持 start、end、center、baseline。',
        html`
          <semi-space align="center" style="height: 64px; background: var(--semi-color-fill-0); padding: 0 12px;">
            <semi-button size="small">小</semi-button>
            <semi-button>默认</semi-button>
            <semi-button size="large">大</semi-button>
          </semi-space>
        `,
        `<semi-space align="center">
  <semi-button size="small">小</semi-button>
  <semi-button>默认</semi-button>
  <semi-button size="large">大</semi-button>
</semi-space>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'space-docs': SpaceDocs
  }
}
