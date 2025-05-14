import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import '../../../components/code-content/index';
import { when } from "lit/directives/when.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement('tag-dynamically')
export class TagDynamically extends LitElement {
  _code?: string = ``;
  @state()
  tags = ['Tag 1', 'Tag 2', 'Tag 3'];
  inputRef = null;
  @state()
  _showInput = false;
  inputVal = '';

  handleEdit() {
    this._showInput = true;
    console.log(this._showInput)

    // nextTick(() => {
    //   if (inputRef.value) {
    //     inputRef.value.focus();
    //   }
    // });
  };

  handleAdd() {
    if (this.inputVal) {
      this.tags.push(this.inputVal);
      this.inputVal = '';
    }
    this._showInput = false;
  };

  handleRemove (key: string) {
    this.tags = this.tags.filter((tag) => tag !== key);
  };

  protected render() {
    return html`
      <h2>动态编辑标签</h2>
      <p>可动态添加和删除标签。</p>
      <code-demo>
        <a-space wrap>
          ${this.tags.map((tag, index) => {
            return html`
              <a-tag
                .closable="${index !== 0}"
                @close="${() => this.handleRemove(tag)}"
              >${tag}</a-tag>`;
          })}
        </a-space>
        ${when(this._showInput, () => {
          return html`
            <a-input
              id="inputRef"
              style="${styleMap({width: '90px'})}"
              size="mini"
              v-model.trim="inputVal"
              @keyup.enter="${this.handleAdd}"
              @blur="${this.handleAdd}">
            </a-input>
          `; 
        }, () => {
          return html`
            <a-tag
              style="${styleMap({
                width: '90px',
                backgroundColor: 'var(--color-fill-2)',
                border: '1px dashed var(--color-fill-3)',
                cursor: 'pointer',
              })}"
              @click="${this.handleEdit}"
            >
              <icon-plus slot="icon"></icon-plus>
              Add Tag
            </a-tag>
          `;
        })}
      </code-demo>
      <code-content .code="${this._code}"></code-content>
      <a-divider></a-divider>
    `;
  }
}