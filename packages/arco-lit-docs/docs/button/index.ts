import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';
import './__docs__/icon';
import './__docs__/shape';
import './__docs__/size';
import './__docs__/status';
import './__docs__/disabled';
import './__docs__/loading';
import './__docs__/long';
import './__docs__/group';

@customElement('button-docs')
class ButtonDocs extends LitElement {
  protected render() {
    return html`
      <h1>按钮 Button</h1>
      <p>按钮是一种命令组件，可发起一个即时操作。</p>
      <a-divider></a-divider>
      <button-basic></button-basic>
      <button-icon></button-icon>
      <button-shape></button-shape>
      <button-size></button-size>
      <button-status></button-status>
      <button-disabled></button-disabled>
      <button-loading></button-loading>
      <button-long></button-long>
      <button-group></button-group>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'button-docs': ButtonDocs
  }
}
