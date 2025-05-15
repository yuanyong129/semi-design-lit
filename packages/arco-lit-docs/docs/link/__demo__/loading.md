```typescript
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement('demo')
export class Demo extends LitElement {

  @state()
  _loading1 = false;

  @state()
  _loading2 = false;

  handleClick1() {
    this._loading1 = true;
    setTimeout(() => {
      this._loading1 = false;
    }, 3000);
  }
  
  handleClick2() {
    this._loading2 = true;
    setTimeout(() => {
      this._loading2 = false;
    }, 3000);
  }
  
  protected render() {
    return html`
      <a-space>
        <a-link loading>Link</a-link>
        <a-link .loading="${this._loading1}" @click="${this.handleClick1}">Link</a-link>
        <a-link .loading="${this._loading2}" @click="${this.handleClick2}">
          <icon-edit slot="icon"></icon-edit>
          Link
        </a-link>
      </a-space> 
    `;
  }
}

```