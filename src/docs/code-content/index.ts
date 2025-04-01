import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import prism from 'prismjs';
import 'prismjs/components/prism-typescript.js';
import { prismStyles } from "./style/prism.style";
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const marked = new Marked(markedHighlight({
  highlight(code) {
    return prism.highlight(code, prism.languages.typescript, 'typescript');
  }
}));

const styles = css`
  .code-content {
    box-sizing: border-box;
    margin: 0;
    padding: 28px 48px;
    background-color: var(--color-neutral-2);
    border-radius: 4px;
  }
`;

@customElement('code-content')
export class CodeContent extends LitElement {
  @property({ attribute: false })
  code: string = '';

  @property()
  type: string = 'html';

  @state()
  _docs?: string;

  @state()
  _height = '0';

  handleClick() {
    if (this._height === '0') {
      this._height = 'fit-content';
    } else {
      this._height = '0';
    }
  }

  async handleCode () {
    switch (this.type) {
      case 'html':
        this._docs = prism.highlight(this.code, prism.languages.html, this.type);
        break;
      case 'markdown':
        this._docs = this.code && (await marked.parse(this.code)).replace('<pre>', '<pre class="code-content">');
        break;
      default:
        this._docs = this.code;
        break;
    }
  }

  protected render() {
    this.handleCode();
    return html`
      <div style="margin-top: 18px; text-align: right">
        <a-space>
          <a-button shape="round" @click="${this.handleClick}"></a-button>
        </a-space>
      </div>
      <div style="margin-top: 18px; height: ${this._height}; overflow: hidden; transition: height 0.2s">
        ${ this.type === 'markdown'
            ? html`${this._docs && unsafeHTML(this._docs)}`
            : html`<pre class="code-content"><code class="language-lang">${this._docs && unsafeHTML(this._docs)}</code></pre>`
         }
      </div>
    `;
  }

  static styles = [prismStyles, styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'code-content': CodeContent
  }
}