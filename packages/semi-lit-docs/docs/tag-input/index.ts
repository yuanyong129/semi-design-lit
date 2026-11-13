import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

@customElement('tag-input-docs')
class TagInputDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _tags: string[] = ['设计', '前端'];

  private _handleChange = (event: CustomEvent<{ value: string[] }>) => {
    this._tags = event.detail.value;
  };

  protected render() {
    return html`
      <h1>标签输入框</h1>
      <p>标签输入框将用户输入的内容转换为标签，支持分隔符、数量限制、折叠展示与校验状态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/tagInput" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '输入内容后按 Enter 创建标签，Backspace 删除最后一个标签。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px">
            <semi-tag-input
              .value=${this._tags}
              placeholder="输入标签后按回车"
              show-clear
              @change=${this._handleChange}
            ></semi-tag-input>
            <span style="color: var(--semi-color-text-2)">当前标签：${this._tags.join('、') || '空'}</span>
          </div>
        `,
        `<semi-tag-input
  .value=\${tags}
  placeholder="输入标签后按回车"
  show-clear
  @change=\${handleChange}
></semi-tag-input>`
      )}

      ${section(
        '数量与长度',
        'max 限制标签总数，max-length 限制单个标签字符数，max-tag-count 将多余标签折叠为 +N。',
        html`
          <semi-tag-input
            .defaultValue=${['Semi', 'Lit', 'Web']}
            max="3"
            max-length="8"
            max-tag-count="2"
            placeholder="最多三个标签"
          ></semi-tag-input>
        `,
        `<semi-tag-input
  .defaultValue=\${['Semi', 'Lit', 'Web']}
  max="3"
  max-length="8"
  max-tag-count="2"
  placeholder="最多三个标签"
></semi-tag-input>`
      )}

      ${section(
        '分隔符与失焦提交',
        'separator 支持字符串或字符串数组，add-on-blur 在失焦时提交输入内容。',
        html`
          <semi-tag-input
            .separator=${['/', '，']}
            add-on-blur
            placeholder="使用 / 或 ，分隔，失焦提交"
          ></semi-tag-input>
        `,
        `<semi-tag-input
  .separator=\${['/', '，']}
  add-on-blur
  placeholder="使用 / 或 ，分隔，失焦提交"
></semi-tag-input>`
      )}

      ${section(
        '状态与尺寸',
        'validate-status 提供 error、warning、success，size 支持 small、default、large。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px">
            <semi-tag-input
              .defaultValue=${['错误']}
              validate-status="error"
              placeholder="错误状态"
            ></semi-tag-input>
            <semi-tag-input
              .defaultValue=${['警告']}
              validate-status="warning"
              placeholder="警告状态"
            ></semi-tag-input>
            <semi-tag-input size="small" placeholder="小尺寸"></semi-tag-input>
            <semi-tag-input size="large" placeholder="大尺寸"></semi-tag-input>
            <semi-tag-input disabled .defaultValue=${['禁用']} placeholder="禁用状态"></semi-tag-input>
          </div>
        `,
        `<semi-tag-input validate-status="error"></semi-tag-input>
<semi-tag-input validate-status="warning"></semi-tag-input>
<semi-tag-input size="small"></semi-tag-input>
<semi-tag-input size="large"></semi-tag-input>
<semi-tag-input disabled></semi-tag-input>`
      )}

      ${section(
        '前缀、后缀与内嵌标签',
        '通过 prefix、suffix 插槽扩展输入框，inset-label 在输入框内展示标签。',
        html`
          <div style="display: flex; flex-direction: column; gap: 12px">
            <semi-tag-input inset-label="标签" placeholder="输入后回车">
              <semi-icon-search slot="prefix"></semi-icon-search>
              <span slot="suffix" style="font-size: 12px; color: var(--semi-color-text-2)">Enter</span>
            </semi-tag-input>
            <semi-tag-input .defaultValue=${['前端', '设计']} placeholder="带前后缀">
              <span slot="prefix">#</span>
              <span slot="suffix">个</span>
            </semi-tag-input>
          </div>
        `,
        `<semi-tag-input inset-label="标签" placeholder="输入后回车">
  <semi-icon-search slot="prefix"></semi-icon-search>
  <span slot="suffix">Enter</span>
</semi-tag-input>
<semi-tag-input .defaultValue=\${['前端', '设计']}>
  <span slot="prefix">#</span>
  <span slot="suffix">个</span>
</semi-tag-input>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-input-docs': TagInputDocs;
  }
}
