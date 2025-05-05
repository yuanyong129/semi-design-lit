import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';
import { loadMdFile } from "../../../utils";

@customElement('tag-bordered')
export class TagBordered extends LitElement {
  @state()
  _code?: string;

  colors = [
    'orangered',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray'
  ];

  async connectedCallback() {
    super.connectedCallback();
    this._code = await loadMdFile('tag', 'bordered');
  }

  protected render() {
    return html`
      <h2>带边框的标签</h2>
      <p>通过参数 bordered，可以显示带边框的标签。</p>
      <a-space wrap>
        <a-tag bordered>default</a-tag>
        ${this.colors.map((color, index) =>
          html`<a-tag key="${index}" color="${color}" bordered>${color}</a-tag>`
        )}
      </a-space>
      <code-content .code="${this._code}" type="markdown"></code-content>
      <a-divider></a-divider>
    `;
  }
}
