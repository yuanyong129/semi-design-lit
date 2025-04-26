```typescript
import { html, LitElement } from 'lit';
import { customElement } from "lit/decorators.js";

@customElement('demo')
class Demo extends LitElement {
  
  private _renderImageSlot() {
    return html`<icon-exclamation-circle-fill></icon-exclamation-circle-fill>`
  }

  render() {
    return html`
      <a-empty .imageSlot="${this._renderImageSlot()}">
        No data, please reload!
      </a-empty>
    `;
  }
}
```