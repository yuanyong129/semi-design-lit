```typescript
import { html, LitElement } from 'lit';
import { customElement } from "lit/decorators.js";

@customElement('demo')
class Demo extends LitElement {
  render() {
    return html`
      <a-empty>
        <icon-exclamation-circle-fill slot="image"></icon-exclamation-circle-fill>
        No data, please reload!
      </a-empty>
    `;
  }
}
```