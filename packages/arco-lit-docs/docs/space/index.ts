import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';

@customElement('space-docs')
class SpaceDocs extends LitElement {
  connectedCallback(): void {
    super.connectedCallback()
  }
  protected render() {
    return html`
      <h1>间距 Space</h1>
      <p>设置组件之间的间距</p>
      <a-divider></a-divider>
      <space-basic></space-basic>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'space-docs': SpaceDocs
  }
}