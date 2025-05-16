import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = ` <a-space class="wrapper" direction="vertical">
  <a-button type="primary" long>Primary</a-button>
  <a-button long>Default</a-button>
  <a-button type="dashed" long>Dashed</a-button>
  <a-button type="outline" long>Outline</a-button>
  <a-button type="text" long>Text</a-button>
</a-space>
`;

@customElement('button-long')
export class ButtonLong extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>长按钮</h2>
      <p>通过设置 long 属性，使按钮的宽度跟随容器的宽度。</p>
      <code-demo>
        <a-space class="wrapper" direction="vertical">
          <a-button type="primary" long>Primary</a-button>
          <a-button long>Default</a-button>
          <a-button type="dashed" long>Dashed</a-button>
          <a-button type="outline" long>Outline</a-button>
          <a-button type="text" long>Text</a-button>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }

  static styles = css`
    .wrapper::part(a-space){
      width: 400px;
      padding: 20px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
    }
  `;
}
