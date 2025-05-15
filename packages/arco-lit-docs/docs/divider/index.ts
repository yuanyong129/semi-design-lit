import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';
import './__docs__/with-text';
import './__docs__/vertical';

@customElement('divider-docs')
class DividerDocs extends LitElement {
  render () {
    return html`
      <h1>分割线 Divider</h1>
      <p>划分内容区域，对模块做分隔。</p>
      <a-divider></a-divider>
      <divider-basic></divider-basic>
      <divider-with-text></divider-with-text>
      <divider-vertical></divider-vertical>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'divider-docs': DividerDocs
  }
}