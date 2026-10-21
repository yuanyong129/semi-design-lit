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

@customElement('scrollbar-docs')
class ScrollbarDocs extends LitElement {
  protected render() {
    return html`
      <h1>滚动条 Scrollbar</h1>
      <p>
        自定义滚动条是 Semi Design Lit 提供的扩展组件（Semi Design 官方未提供该组件），
        统一了各浏览器下的滚动条样式。
      </p>
      <semi-divider></semi-divider>

      ${section(
        '垂直滚动',
        '设置固定高度，内容溢出时显示自定义滚动条。',
        html`
          <semi-scrollbar style="height: 200px; overflow: auto; border: 1px solid var(--semi-color-border); border-radius: 6px;">
            <div style="padding: 12px;">
              ${Array.from({ length: 12 }).map((_, index) => html`
                <div style="height: 40px; line-height: 40px; border-bottom: 1px solid var(--semi-color-border);">
                  列表项 ${index + 1}
                </div>
              `)}
            </div>
          </semi-scrollbar>
        `,
        `<semi-scrollbar style="height: 200px; overflow: auto;">
  <div style="height: 600px;">内容</div>
</semi-scrollbar>`
      )}

      ${section(
        '横向滚动',
        '宽度受限时横向滚动同样使用自定义滚动条。',
        html`
          <semi-scrollbar style="width: 100%; overflow: auto; border: 1px solid var(--semi-color-border); border-radius: 6px;">
            <div style="display: flex; gap: 12px; padding: 12px; width: max-content;">
              ${Array.from({ length: 10 }).map((_, index) => html`
                <div style="width: 120px; height: 80px; display: flex; align-items: center; justify-content: center; background: var(--semi-color-fill-0); border-radius: 6px;">
                  卡片 ${index + 1}
                </div>
              `)}
            </div>
          </semi-scrollbar>
        `,
        `<semi-scrollbar style="width: 100%; overflow: auto;">
  <div style="width: 1200px;">内容</div>
</semi-scrollbar>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scrollbar-docs': ScrollbarDocs
  }
}
