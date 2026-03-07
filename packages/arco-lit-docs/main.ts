import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js';
import { Router } from '@lit-labs/router';

import litLogo from './assets/lit.svg';
import viteLogo from './assets/vite.svg'
import arcoLogo from './assets/favicon.ico';
import '@web-lit/index';
import '@web-lit/icon/index';
import './docs/index';
import { routers } from './router';


@customElement('arco-lit-docs')
export class ArcoLitDocs extends LitElement {
  @state() private key?: string = 'button';

  private _router = new Router(this, routers);

  handleClick(type: string) {
    this.key = type;
    this._router.goto(`/${type}`);
  }

  firstUpdated(): void {
    this._router.goto(`/${this.key}`);
  }

  render() {
    return html`
      <a-config-provider>
        <div style="${styleMap({ display: 'flex' })}">
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src=${viteLogo} class="logo" alt="Vite logo" />
            </a>
            <a href="https://lit.dev" target="_blank">
              <img src=${litLogo} class="logo lit" alt="Lit logo" />
            </a>
            <a href="https://arco.design" target="_blank">
              <img src=${arcoLogo} class="logo arco" alt="Arco logo" />
            </a>
          </div>
          <h1>Vite + Lit + Arco Design</h1>
        </div>
        <a-divider></a-divider>
        <div class="docs-pane">
          <div class="docs-list">
            <a-space fill direction="vertical">
              <div>通用</div>
              <a-button long="true" @click="${() => this.handleClick('button')}">按钮 Button</a-button>
              <a-button long="true" @click="${() => this.handleClick('link')}">链接 Link</a-button>
              <div>布局</div>
              <a-button long="true" @click="${() => this.handleClick('divider')}">分割线 Divider</a-button>
              <a-button long="true" @click="${() => this.handleClick('space')}">间距 Space</a-button>
              <div>数据展示</div>
              <a-button long="true" @click="${() => this.handleClick('empty')}">空状态 Empty</a-button>
              <a-button long="true" @click="${() => this.handleClick('tag')}">标签 Tag</a-button>
              <div>数据输入</div>
              <a-button long="true" @click="${() => this.handleClick('radio')}">单选框 Radio</a-button>
              <a-button long="true" @click="${() => this.handleClick('switch')}">开关 Switch</a-button>
              <div>其他</div>
              <a-button long="true" @click="${() => this.handleClick('scrollbar')}">滚动条 Scrollbar</a-button>
            </a-space>
          </div>
          <div class="docs-wrapper">
            <a-scrollbar style="height: 500px; overflow: auto;">
              <div class="docs-main">${this._router.outlet()}</div>
            </a-scrollbar>
          </div>
        </div>
      </a-config-provider>
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
    }

    .docs-pane {
      width: 100%;
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .docs-list {
      width: 260px;      
      overflow: auto;
    }

    .docs-wrapper {
      height: 100%;
      flex: 1;
      overflow: auto;
      display: block;
      padding: 0 1.2em;
      box-sizing: border-box;
    }

    .docs-main {
      max-width: 985px;
      margin: 0 auto;
    }

    .logo {
      height: 4em;
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
    'arco-lit-docs': ArcoLitDocs
  }
}
