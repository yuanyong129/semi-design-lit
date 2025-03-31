import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import prism from 'prismjs';
import { prismStyles } from "./style/prism.style";

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

  connectedCallback(): void {
    super.connectedCallback();
    switch (this.type) {
      case 'html':
        this._docs = prism.highlight(this.code, prism.languages.html, this.type);
        break;
      case 'ts':
      case 'typescript':
        this._docs = prism.highlight(this.code, prism.languages.javascript, this.type);
        break;
      default:
        break;
    }
  }

  protected render() {
    return html`
      <div style="margin-top: 18px;">
        <a-button shape="round" @click="${this.handleClick}"></a-button>
      </div>
      <div style="margin-top: 18px; height: ${this._height}; overflow: hidden; transition: height 0.2s">
        <pre class="code-content"><code class="language-lang">${this._docs && unsafeHTML(this._docs)}</code></pre>
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