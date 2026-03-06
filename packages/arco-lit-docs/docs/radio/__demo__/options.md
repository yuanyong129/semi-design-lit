```typescript
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('demo')
export class Demo extends LitElement {
  @state()
  _value1 = 'plain 1';

  plainOptions = ['plain 1', 'plain 2', 'plain 3'];

  handleChange1(e: CustomEvent) {
    this._value1 = e.detail.value;
  }

  @state()
  _value2 = '1';

  options = [
    { label: 'option 1', value: '1' },
    { label: 'option 2', value: '2' },
    { label: 'option 3', value: '3', disabled: true },
  ];

  handleChange2(e: CustomEvent) {
    this._value2 = e.detail.value;
  }

  protected render() {

    const labelSlot = (data: any) => html`<a-tag>${ data.label }</a-tag>`

    return html`
      <h2>单选框组选项</h2>
      <p> a-radio-group 通过 options 属性设置子元素。</p>
      <code-demo>
        <a-space direction="vertical" size="large">
          <a-radio-group defaultValue=${this._value1} .options="${this.plainOptions}" @change="${this.handleChange1}"></a-radio-group>
          <a-radio-group defaultValue=${this._value2} .options="${this.options}" @change="${this.handleChange2}"></a-radio-group>
          <a-radio-group
            defaultValue=${this._value2}
            .options="${this.options}"
            .slots="${{label: labelSlot}}"
            @change="${this.handleChange2}">
          </a-radio-group>
        </a-space>
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
```