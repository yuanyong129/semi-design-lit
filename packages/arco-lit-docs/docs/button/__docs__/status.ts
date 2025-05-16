import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-space direction="vertical">
  <a-space>
    <a-button type="primary" status="success">Primary</a-button>
    <a-button status="success">Default</a-button>
    <a-button type="dashed" status="success">Dashed</a-button>
    <a-button type="outline" status="success">Outline</a-button>
    <a-button type="text" status="success">Text</a-button>
  </a-space>
  <a-space>
    <a-button type="primary" status="warning">Primary</a-button>
    <a-button status="warning">Default</a-button>
    <a-button type="dashed" status="warning">Dashed</a-button>
    <a-button type="outline" status="warning">Outline</a-button>
    <a-button type="text" status="warning">Text</a-button>
  </a-space>
  <a-space>
    <a-button type="primary" status="danger">Primary</a-button>
    <a-button status="danger">Default</a-button>
    <a-button type="dashed" status="danger">Dashed</a-button>
    <a-button type="outline" status="danger">Outline</a-button>
    <a-button type="text" status="danger">Text</a-button>
  </a-space>
</a-space>
`;

@customElement('button-status')
export class ButtonStatus extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>按钮状态</h2>
      <p>按钮的状态分为 normal - 正常（默认）、success - 成功、warning - 警告、danger - 危险四种，可以与按钮类型同时使用。</p>
      <code-demo>
        <a-space direction="vertical">
          <a-space>
            <a-button type="primary" status="success">Primary</a-button>
            <a-button status="success">Default</a-button>
            <a-button type="dashed" status="success">Dashed</a-button>
            <a-button type="outline" status="success">Outline</a-button>
            <a-button type="text" status="success">Text</a-button>
          </a-space>
          <a-space>
            <a-button type="primary" status="warning">Primary</a-button>
            <a-button status="warning">Default</a-button>
            <a-button type="dashed" status="warning">Dashed</a-button>
            <a-button type="outline" status="warning">Outline</a-button>
            <a-button type="text" status="warning">Text</a-button>
          </a-space>
          <a-space>
            <a-button type="primary" status="danger">Primary</a-button>
            <a-button status="danger">Default</a-button>
            <a-button type="dashed" status="danger">Dashed</a-button>
            <a-button type="outline" status="danger">Outline</a-button>
            <a-button type="text" status="danger">Text</a-button>
          </a-space>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}