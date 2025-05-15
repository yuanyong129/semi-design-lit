import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

@customElement('divider-basic')
export class DividerBasic extends LitElement {

  _code = `
  <div class="divider-demo">
    <p>A design is a plan or specification for the construction of an object.</p>
    <a-divider></a-divider>
    <p>A design is a plan or specification for the construction of an object.</p>
    <a-divider dashed></a-divider>
    <p>A design is a plan or specification for the construction of an object.</p>
    <a-divider :size="2" style="border-bottom-style: dotted"></a-divider>
    <p>A design is a plan or specification for the construction of an object.</p>
  </div>
  <div class="divider-demo" style="margin-top: 48px">
    <div class="flex-box">
      <span class="avatar"><icon-image></icon-image></span>
      <div class="content">
        <a-typography-title :heading="6">Image</a-typography-title>
        May 4, 2010
      </div>
    </div>
    <a-divider class="half-divider"></a-divider>
    <div class="flex-box">
      <span class="avatar"><icon-user></icon-user></span>
      <div class="content">
        <a-typography-title :heading="6">Avatar</a-typography-title>
        May 4, 2010
      </div>
    </div>
    <a-divider class="half-divider"></a-divider>
    <div class="flex-box">
      <span class="avatar"><icon-pen></icon-pen></span>
      <div class="content">
        <a-typography-title :heading="6">Icon</a-typography-title>
        May 4, 2010
      </div>
    </div>
  </div>
`;

  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>对不同章节的文本段落进行分割，默认为水平分割线，可在中间加入文字。</p>
      <code-demo>
        <div class="divider-demo">
          <p>A design is a plan or specification for the construction of an object.</p>
          <a-divider></a-divider>
          <p>A design is a plan or specification for the construction of an object.</p>
          <a-divider dashed></a-divider>
          <p>A design is a plan or specification for the construction of an object.</p>
          <a-divider :size="2" style="border-bottom-style: dotted"></a-divider>
          <p>A design is a plan or specification for the construction of an object.</p>
        </div>
        <div class="divider-demo" style="margin-top: 48px">
          <div class="flex-box">
            <span class="avatar"><icon-image></icon-image></span>
            <div class="content">
              <a-typography-title :heading="6">Image</a-typography-title>
              May 4, 2010
            </div>
          </div>
          <a-divider class="half-divider"></a-divider>
          <div class="flex-box">
            <span class="avatar"><icon-user></icon-user></span>
            <div class="content">
              <a-typography-title :heading="6">Avatar</a-typography-title>
              May 4, 2010
            </div>
          </div>
          <a-divider class="half-divider"></a-divider>
          <div class="flex-box">
            <span class="avatar"><icon-pen></icon-pen></span>
            <div class="content">
              <a-typography-title :heading="6">Icon</a-typography-title>
              May 4, 2010
            </div>
          </div>
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
    .half-divider::part(divider) {
      left: 55px;
      width: calc(100% - 55px);
      min-width: auto;
      margin: 16px 0;
    }
    .flex-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flex-box .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-right: 16px;
      color: var(--color-text-2);
      font-size: 16px;
      background-color: var(--color-fill-3);
      border-radius: 50%;
    }
    .flex-box .content {
      flex: 1;
      color: var(--color-text-2);
      font-size: 12px;
      line-height: 20px;
    }
  `;
}
