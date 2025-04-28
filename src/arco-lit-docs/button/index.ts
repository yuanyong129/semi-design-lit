import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('button-docs')
class ButtonDocs extends LitElement {
  protected render() {
    return html`
      <h1>按钮 Button</h1>
      <p>按钮是一种命令组件，可发起一个即时操作。</p>
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'button-docs': ButtonDocs
  }
}
