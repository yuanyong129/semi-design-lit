import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@web-lit/icon/build/edit";
import './__docs__/basic';
import './__docs__/status';
import './__docs__/hoverable';
import './__docs__/icon';
import './__docs__/loading';

@customElement('link-docs')
export class LinkDocs extends LitElement {

  protected render(): unknown {
    return html`
      <h1>链接 Link</h1>
      <p>链接的基本样式。</p>
      <a-divider></a-divider>
      <link-basic></link-basic>
      <link-status></link-status>
      <link-hoverable></link-hoverable>
      <link-icon></link-icon>
      <link-loading></link-loading>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-docs': LinkDocs
  }
}
