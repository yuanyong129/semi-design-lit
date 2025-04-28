```typescript
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('demo')
export class Demo extends LitElement {
  async handleChangeIntercept() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  async handleChangeIntercept2(newValue?: string | boolean | number) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!newValue) {
      alert("OH, You can't change")
      return false
    }
    return true
  }

  async handleChangeIntercept3() {
    await new Promise((_, reject) => setTimeout(() => {
      alert("OH, Something went wrong")
      reject()
    }, 1000))
    return true
  }

  protected render() {
    return html`
      <a-space size="large">
        <a-switch .beforeChange=${this.handleChangeIntercept}></a-switch>
        <a-switch type="round" .beforeChange=${this.handleChangeIntercept2}></a-switch>
        <a-switch type="line" .beforeChange=${this.handleChangeIntercept3}></a-switch>
      </a-space>
    `;
  }
}
```