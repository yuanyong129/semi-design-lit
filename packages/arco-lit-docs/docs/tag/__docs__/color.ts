import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import '../../../components/code-content/index';

const code =
``;

@customElement('tag-color')
export class TagColor extends LitElement {
  colors = [
    'red',
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

  custom = [
    '#f53f3f',
    '#7816ff',
    '#00b42a',
    '#165dff',
    '#ff7d00',
    '#eb0aa4',
    '#7bc616',
    '#86909c',
    '#b71de8',
    '#0fc6c2',
    '#ffb400',
    '#168cff',
    '#ff5722'
  ];

  protected render() {
    return html`
      <h2>标签的颜色</h2>
      <p>我们提供多种预设色彩的标签样式，通过 color 设置不同颜色。如果预设值不能满足你的需求，color 字段也可以设置自定义色值。</p>
      <code-demo>
        <a-space wrap>
          ${this.colors.map(color => html`<a-tag color="${color}" closable>${color}</a-tag>`)} 
        </a-space>
        <h3>Custom Color:</h3>
        <a-space wrap>
          ${this.custom.map(color => html`<a-tag color="${color}" closable>${color}</a-tag>`)}
        </a-space>
      </code-demo>
      <code-content .code="${code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}
