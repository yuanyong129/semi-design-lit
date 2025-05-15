import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

@customElement('divider-vertical')
export class DividerVertical extends LitElement {

  _code = ` <div class="divider-demo">
  <span>Item 1</span>
  <a-divider direction="vertical"></a-divider>
  <span>Item 2</span>
  <a-divider direction="vertical"></a-divider>
  <span>Item 3</span>
</div>
`;

  protected render() {
    return html`
      <h2>竖直分割线</h2>
      <p>指定 direction 为 vertical 即可使用竖直分割线。竖直分割线不能带文字。</p>
      <code-demo>
        <div class="divider-demo">
          <span>Item 1</span>
          <a-divider direction="vertical"></a-divider>
          <span>Item 2</span>
          <a-divider direction="vertical"></a-divider>
          <span>Item 3</span>
        </div>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }

   static styles = css`
    .divider-demo {
      box-sizing: border-box;
      padding: 24px;
      border: 30px solid rgb(var(--gray-2));
      width: 560px;
    }
  `;
}
