import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import prism from 'prismjs';
import 'prismjs/components/prism-typescript.js';
import { prismStyles } from "./style/prism.style";
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const marked = new Marked(markedHighlight({
  highlight(code, language) {
    return prism.highlight(code, prism.languages[language], language);
  }
}));

const styles = css`
  .code-toolbar {
    margin-top: 12px;
    text-align: right;
  }

  .code-body {
    margin-top: 12px;
    overflow: hidden;
    transition: height 0.2s ease;
  }

  .code-content {
    box-sizing: border-box;
    margin: 0;
    padding: 20px 24px;
    overflow: auto;
    color: var(--semi-color-text-0);
    font-family: Consolas, Menlo, monospace;
    font-size: 13px;
    line-height: 1.6;
    background-color: var(--semi-color-fill-0);
    border-radius: 0 0 6px 6px;
  }

  .code-content code {
    font-family: inherit;
  }
`;

@customElement('code-content')
export class CodeContent extends LitElement {
  @property({ attribute: false })
  code: string = '';

  @property()
  type: string = 'html';

  @state()
  private _docs: string = '';

  @state()
  private _height = '0';

  private _updateDocs() {
    switch (this.type) {
      case 'html':
        this._docs = prism.highlight(this.code, prism.languages.html, 'html');
        break;
      case 'markdown':
        Promise.resolve(marked.parse(this.code)).then((result: string) => {
          this._docs = result.replace('<pre>', '<pre class="code-content">');
        });
        break;
      default:
        this._docs = this.code;
        break;
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('code') || changed.has('type')) {
      this._updateDocs();
    }
  }

  private handleClick() {
    this._height = this._height === '0' ? 'auto' : '0';
  }

  protected render() {
    return html`
      <div class="code-toolbar">
        <semi-button
          size="small"
          theme="borderless"
          type="tertiary"
          .icon=${html`<semi-icon-code></semi-icon-code>`}
          @click=${this.handleClick}
        >${this._height === '0' ? '查看代码' : '收起代码'}</semi-button>
      </div>
      <div class="code-body" style="height: ${this._height}">
        ${this.type === 'markdown'
          ? html`${this._docs ? unsafeHTML(this._docs) : nothing}`
          : html`<pre class="code-content"><code class="language-html">${this._docs ? unsafeHTML(this._docs) : nothing}</code></pre>`}
      </div>
    `;
  }

  static styles = [prismStyles, styles];
}

@customElement('code-demo')
export class CodeDemo extends LitElement {
  protected render() {
    return html`
      <div class="code-demo">
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    .code-demo {
      margin-top: 16px;
      padding: 32px;
      background-color: var(--semi-color-bg-1);
      border: 1px solid var(--semi-color-border);
      border-radius: 6px 6px 0 0;
    }

    .code-demo + code-content .code-content {
      border-top: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'code-demo': CodeDemo
    'code-content': CodeContent
  }
}
