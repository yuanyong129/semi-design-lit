import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import '../../../components/code-content/index';

const code =
`<a-space>
  <a-tag color="gray">
    <icon-github slot="icon"></icon-github>
    Github
  </a-tag>
  <a-tag color="orangered">
    <icon-gitlab slot="icon"></icon-gitlab>
    Gitlab
  </a-tag>
  <a-tag color="blue">
    <icon-twitter slot="icon"></icon-twitter>
    Twitter
  </a-tag>
  <a-tag color="arcoblue">
    <icon-facebook slot="icon"></icon-facebook>
    Facebook
  </a-tag>
</a-space>`;

@customElement('tag-icon')
export class TagIcon extends LitElement {
  protected render() {
    return html`
      <h2>带图标的标签</h2>
      <p>可通过 icon 插槽在标签中加入图标。</p>
      <code-demo>
        ${unsafeHTML(code)}
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}