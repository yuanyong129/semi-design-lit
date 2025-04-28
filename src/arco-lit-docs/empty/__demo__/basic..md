```typescript
import { html, LitElement } from 'lit';
import { customElement } from "lit/decorators.js";

@customElement('demo')
class Demo extends LitElement {
  render() {
    return html`
      <a-empty></a-empty>
    `;
  }
}
```