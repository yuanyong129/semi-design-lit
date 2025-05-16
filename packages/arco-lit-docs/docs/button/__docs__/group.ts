import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-space>
  <a-button type="primary">Primary</a-button>
  <a-button>Secondary</a-button>
  <a-button type="dashed">Dashed</a-button>
  <a-button type="outline">Outline</a-button>
  <a-button type="text">Text</a-button>
</a-space>
`;

@customElement('button-group')
export class ButtonGroup extends LitElement {
  _code = code;
  protected render() {
    return html`
      <h2>组合按钮</h2>
      <p>通过 ${'<a-button-group>'} 组件使按钮以组合方式出现。可用在同级多项操作中。</p>
      <code-demo>
        <a-space direction="vertical">
          <a-button-group>
            <a-button>Publish</a-button>
            <a-button .slots="${{ icon: html`<icon-down></icon-down>` }}"></a-button>
          </a-button-group>
          <a-button-group>
            <a-button>Publish</a-button>
            <a-button .slots="${{ icon: html`<icon-more></icon-more>` }}"></a-button>
          </a-button-group>
          <a-button-group>
            <a-button type="primary" .slots="${{ icon: html`<icon-left></icon-left>` }}">
              Prev
            </a-button>
            <a-button type="primary">
              Next
              <icon-right></icon-right>
            </a-button>
          </a-button-group>
          <a-space size="large">
            <a-button-group type="primary">
              <a-button> copy </a-button>
              <a-button> cut </a-button>
              <a-button> find </a-button>
            </a-button-group>
            <a-button-group type="primary" status="warning">
              <a-button .slots="${{ icon: html`<icon-heart-fill></icon-heart-fill>` }}"></a-button>
              <a-button .slots="${{ icon: html`<icon-star-fill></icon-star-fill>` }}"></a-button>
              <a-button .slots="${{ icon: html`<icon-thumb-up-fill></icon-thumb-up-fill>` }}"></a-button>
            </a-button-group>
            <a-button-group size="small" disabled>
              <a-button> prev </a-button>
              <a-button> next </a-button>
            </a-button-group>
          </a-space>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
