import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

@customElement('divider-with-text')
export class DividerWithText extends LitElement {

  _code = `<div class="divider-demo">
  <p>A design is a plan or specification for the construction of an object.</p>
  <a-divider orientation="left">Text</a-divider>
  <p>A design is a plan or specification for the construction of an object.</p>
  <a-divider orientation="center">Text</a-divider>
  <p>A design is a plan or specification for the construction of an object.</p>
  <a-divider orientation="right">Text</a-divider>
  <a-divider :margin="10"><icon-star></icon-star></a-divider>
</div>
`;

  protected render() {
    return html`
      <h2>带有文字的分割线</h2>
      <p>通过 orientation 为分割线添加描述文字。</p>
      <code-demo>
        <div class="divider-demo">
          <p>A design is a plan or specification for the construction of an object.</p>
          <a-divider orientation="left">Text</a-divider>
          <p>A design is a plan or specification for the construction of an object.</p>
          <a-divider orientation="center">Text</a-divider>
          <p>A design is a plan or specification for the construction of an object.</p>
          <a-divider orientation="right">Text</a-divider>
          <a-divider :margin="10"><icon-star></icon-star></a-divider>
        </div>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }

   static styles = css`
    .divider-demo {
      box-sizing: border-box;
      width: 560px;
      padding: 24px;
      border: 30px solid rgb(var(--gray-2));
    }
  `;
}
