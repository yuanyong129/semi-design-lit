import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './__docs__/basic';
import './__docs__/closeable';
import './__docs__/dynamically';
import './__docs__/checkable';
import './__docs__/color';
import './__docs__/size';
import './__docs__/loading';
import './__docs__/icon';
import './__docs__/bordered';

@customElement('tag-docs')
class TagDocs extends LitElement {
  protected render() {
    return html`
      <h1>标签 Tag</h1>
      <p>用于信息的选择、筛选、分类。用户通过标签进行信息反馈和交互操作。</p>
      <tag-basic></tag-basic>
      <tag-closeable></tag-closeable>
      <tag-dynamically></tag-dynamically>
      <tag-checkable></tag-checkable>
      <tag-color></tag-color>
      <tag-size></tag-size>
      <tag-loading></tag-loading>
      <tag-icon></tag-icon>
      <tag-bordered></tag-bordered>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-docs': TagDocs
  }
}