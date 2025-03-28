import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import './basic';
import './loading';
import './text';

@customElement('switch-docs')
class SwitchDocs extends LitElement {
  @state()
  _value?: string;

  handleChange(ev: CustomEvent) {
    this._value = ev.detail.value;
  }

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
      <h1>开关 Switch</h1>
      <p>互斥性的操作控件，用户可打开或关闭某个功能。</p>
      <a-divider></a-divider>

      <switch-basic></switch-basic>

      <h2>开关类型</h2>
      <p>开关分为 circle - 圆形（默认）、round - 圆角、line - 线性三种类型。</p>
      <a-space size="large">
        <a-switch></a-switch>
        <a-switch type="round"></a-switch>
        <a-switch type="line"></a-switch>
      </a-space>
      <a-divider></a-divider>

      <h2>开关尺寸</h2>
      <p>开关分为 small、medium 两种尺寸。</p>
      <a-space size="large">
        <a-switch></a-switch>
        <a-switch size="small"></a-switch>
      </a-space>
      <a-divider></a-divider>

      <h2>禁用状态</h2>
      <p>禁用开关。</p>
      <a-space size="large">
        <a-switch disabled></a-switch>
        <a-switch .defaultChecked=${true} disabled></a-switch>
        <a-switch type="round" disabled></a-switch>
        <a-switch .defaultChecked=${true} type="round" disabled></a-switch>
        <a-switch type="line" disabled></a-switch>
        <a-switch .defaultChecked=${true} type="line" disabled></a-switch>
      </a-space>
      <a-divider></a-divider>

      <h2>自定义开关的颜色</h2>
      <p>通过 checkedColor 和 uncheckedColor 可以自定义开关的颜色。</p>
      <a-switch checkedColor="#F53F3F" uncheckedColor="#14C9C9"></a-switch>
      <a-divider></a-divider>

      <h2>自定义开关的值</h2>
      <p>通过 checkedValue 和 uncheckedValue 可以自定义开关的值。</p>
      <a-space direction="vertical" size="large">
        <a-switch checkedValue="yes" uncheckedValue="no" @change="${this.handleChange}"></a-switch>
        <div>Current Value: ${ this._value }</div>
      </a-space>
      <a-divider></a-divider>

      <h2>切换拦截</h2>
      <p>设置 beforeChange 函数，函数的返回值将用于判断是否阻止切换。</p>
      <a-space size="large">
        <a-switch .beforeChange=${this.handleChangeIntercept}></a-switch>
        <a-switch type="round" .beforeChange=${this.handleChangeIntercept2}></a-switch>
        <a-switch type="line" .beforeChange=${this.handleChangeIntercept3}></a-switch>
      </a-space>
      <a-divider></a-divider>

      <switch-loading></switch-loading>
      <switch-text></switch-text>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'switch-docs': SwitchDocs
  }
}