import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code = `<a-space>
  <a-typography-text>Space:</a-typography-text>
  ${ false ? html`<a-tag color='arcoblue'>Tag</a-tag>` : '' } 
  <a-button type="primary">Item1</a-button>
  <a-button type="primary">Item2</a-button>
  <a-switch defaultChecked />
</a-space>`;

@customElement('space-basic')
export class SpaceBasic extends LitElement {
  protected render() {
    return html`
      <h2>基本用法</h2>
      <p>间距组件的基本用法。</p>
      <code-demo>
        <a-space>
          <a-typography-text>Space:</a-typography-text>
          ${ false ? html`<a-tag color='arcoblue'>Tag</a-tag>` : '' } 
          <a-button type="primary">Item1</a-button>
          <a-button type="primary">Item2</a-button>
          <a-switch defaultChecked />
        </a-space>
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
