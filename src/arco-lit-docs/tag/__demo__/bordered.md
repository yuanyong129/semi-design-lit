```typescript
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('demo')
export class Demo extends LitElement {
  colors = [
    'orangered',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray'
  ];

  protected render() {
    return html`
      <a-space wrap>
        <a-tag bordered>default</a-tag>
        ${this.colors.map((color, index) =>
          html`<a-tag key="${index}" color="${color}" bordered>${color}</a-tag>`
        )}
      </a-space>
    `;
  }
}
```