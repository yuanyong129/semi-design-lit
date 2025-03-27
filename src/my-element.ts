import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'
import './index'
import './docs/index'
import './icon/index'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  @state() private key?: string = 'button';

  getDocs() {
    switch (this.key) {
      case 'button':
        return html`<button-docs></button-docs>`;
      case 'divider':
        return html`<divider-docs></divider-docs>`;
      case 'link':
        return html`<link-docs></link-docs>`;
      default:
        break;
    }
  }

  handleClick(type: string) {
    this.key = type;
  }

  render() {
    return html`
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src=${viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${litLogo} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <a-divider></a-divider>
      <div class="docs-pane">
        <a-space direction="vertical">
          <div>通用</div>
          <a-button long="true" @click="${() => this.handleClick('button')}">按钮 Button</a-button>
          <a-button long="true" @click="${() => this.handleClick('link')}">链接 Link</a-button>
          <div>布局</div>
          <a-button long="true" @click="${() => this.handleClick('divider')}">分割线 Divider</a-button>
        </a-space>
        <div class="docs-wrapper"> ${ this.getDocs() } </div>
      </div>
    `
  }

  static styles = css`
    :host {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      padding: 1.2rem;
      box-sizing: border-box;
      text-align: center;
    }

    .docs-pane {
      width: 100%;
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .docs-wrapper {
      height: 100%;
      flex: 1;
      margin-left: 1.2em;
      overflow: auto;
    }

    .logo {
      height: 6em;
      padding: 1.2em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
