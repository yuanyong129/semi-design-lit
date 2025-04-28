```typescript
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

export class Demo extends LitElement {
  @state()
  _value?: string;

  handleChange(ev: CustomEvent) {
    this._value = ev.detail.value;
  }

  render () {
    return html`
      <a-space direction="vertical" size="large">
        <a-switch checkedValue="yes" uncheckedValue="no" @change="${this.handleChange}"></a-switch>
        <div>Current Value: ${ this._value }</div>
      </a-space>
    `;
  }
};
```