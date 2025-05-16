import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-space>
  <a-button type="primary" size="mini">Mini</a-button>
  <a-button type="primary" size="small">Small</a-button>
  <a-button type="primary">Medium</a-button>
  <a-button type="primary" size="large">Large</a-button>
</a-space>
`;

@customElement('button-size')
export class ButtonSize extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>按钮尺寸</h2>
      <p>按钮分为 mini、small、medium、large 四种尺寸。高度分别为：24px、28px、32px、36px。推荐（默认）尺寸为 medium。可在不同场景及不同业务需求选择适合尺寸。</p>
      <code-demo>
        <a-space>
          <a-button type="primary" size="mini">Mini</a-button>
          <a-button type="primary" size="small">Small</a-button>
          <a-button type="primary">Medium</a-button>
          <a-button type="primary" size="large">Large</a-button>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}