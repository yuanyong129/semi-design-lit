import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('divider-docs')
class DividerDocs extends LitElement {
  render () {
    return html`
      <h1>分割线 Divider</h1>
      <p>划分内容区域，对模块做分隔。</p>
      <a-divider></a-divider>
      <h2>基本用法</h2>
      <p>对不同章节的文本段落进行分割，默认为水平分割线，可在中间加入文字。</p>
      <div class="divider-demo">
        <p>A design is a plan or specification for the construction of an object.</p>
        <a-divider></a-divider>
        <p>A design is a plan or specification for the construction of an object.</p>
        <a-divider dashed></a-divider>
        <p>A design is a plan or specification for the construction of an object.</p>
        <a-divider .size="2" style="border-bottom-style: dotted"></a-divider>
        <p>A design is a plan or specification for the construction of an object.</p>
      </div>
      <a-divider></a-divider>
      <h2>基本用法</h2>
      <p>对不同章节的文本段落进行分割，默认为水平分割线，可在中间加入文字。</p>
      <div class="divider-demo">
        <span>Item 1</span>
        <a-divider direction="vertical"></a-divider>
        <span>Item 2</span>
        <a-divider direction="vertical"></a-divider>
        <span>Item 3</span>
      </div>
    `;
  }

  static styles = css`
    .divider-demo {
      box-sizing: border-box;
      padding: 24px;
      border: 30px solid rgb(var(--gray-2));
      margin: 0 auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'divider-docs': DividerDocs
  }
}