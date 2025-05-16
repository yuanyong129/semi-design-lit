```typescript
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('demo')
export class Demo extends LitElement {
  protected render() {
    return html`
      <a-space>
        <a-button
          type="primary"
          .slots=${{ icon: html`<icon-plus></icon-plus>` }}>
        </a-button>
        <a-button type="primary" .slots=${{ icon: html`<icon-delete></icon-delete>` }}>
          Delete
        </a-button>
      </a-space>
    `;
  }
}
```