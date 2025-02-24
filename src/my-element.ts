import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'
import './index'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

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
      <h2>基本用法</h2>
      <p>按钮分为 primary - 主要按钮、secondary - 次要按钮（默认）、dashed - 虚线按钮、outline - 线形按钮、text - 文本按钮五种类型。</p>
      <a-space>
        <a-button type="primary">Primary</a-button>
        <a-button>Secondary</a-button>
        <a-button type="dashed">Dashed</a-button>
        <a-button type="outline">Outline</a-button>
        <a-button type="text">Text</a-button>
      </a-space>
      <a-divider></a-divider>
      <h2>按钮尺寸</h2>
      <p>按钮分为 mini、small、medium、large 四种尺寸。高度分别为：24px、28px、32px、36px。推荐（默认）尺寸为 medium。可在不同场景及不同业务需求选择适合尺寸。</p>
      <a-space>
        <a-button type="primary" size="mini">Mini</a-button>
        <a-button type="primary" size="small">Small</a-button>
        <a-button type="primary">Medium</a-button>
        <a-button type="primary" size="large">Large</a-button>
      </a-space>
      <a-divider></a-divider>
      <h2>按钮状态</h2>
      <p>按钮的状态分为 normal - 正常（默认）、success - 成功、warning - 警告、danger - 危险四种，可以与按钮类型同时使用。</p>
      <a-space direction="vertical">
      <a-space>
        <a-button type="primary" status="success">Primary</a-button>
        <a-button status="success">Default</a-button>
        <a-button type="dashed" status="success">Dashed</a-button>
        <a-button type="outline" status="success">Outline</a-button>
        <a-button type="text" status="success">Text</a-button>
      </a-space>
      <a-space>
        <a-button type="primary" status="warning">Primary</a-button>
        <a-button status="warning">Default</a-button>
        <a-button type="dashed" status="warning">Dashed</a-button>
        <a-button type="outline" status="warning">Outline</a-button>
        <a-button type="text" status="warning">Text</a-button>
      </a-space>
      <a-space>
        <a-button type="primary" status="danger">Primary</a-button>
        <a-button status="danger">Default</a-button>
        <a-button type="dashed" status="danger">Dashed</a-button>
        <a-button type="outline" status="danger">Outline</a-button>
        <a-button type="text" status="danger">Text</a-button>
      </a-space>
    </a-space>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
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
