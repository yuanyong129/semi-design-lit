import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-scrollbar style="height:200px;overflow: auto;">
  <div style="height: 2000px;width: 2000px; background-color: var(--color-primary-light-4);">Content</div>
</a-scrollbar>`;

@customElement('scrollbar-basic')
export class ScrollbarBasic extends LitElement {
  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>滚动条组件基本用法。scrollbar 的默认插槽需要唯一的子元素。</p>
      <code-demo>
        <a-scrollbar style="height:200px;overflow: auto; display: block">
          <div style="height: 2000px;width: 2000px; background-color: var(--color-primary-light-4);">Content</div>
        </a-scrollbar>
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
