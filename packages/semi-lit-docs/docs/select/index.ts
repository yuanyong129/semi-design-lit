import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
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

@customElement('select-docs')
class SelectDocs extends LitElement {
  private get _options() {
    return [
      { label: 'Semi Design', value: 'semi' },
      { label: 'Arco Design', value: 'arco' },
      { label: 'Ant Design', value: 'antd' },
      { label: '不可选项', value: 'disabled', disabled: true },
    ];
  }

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>选择器</h1>
      <p>Select 从选项列表中选择单个或多个值，支持搜索、清除与禁用。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/select" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '点击选择器打开选项，选择后自动关闭。',
        html`
          <semi-select .options=${this._options} placeholder="请选择设计系统" style="max-width: 320px;"></semi-select>
        `,
        `<semi-select .options=\${options} placeholder="请选择设计系统"></semi-select>`
      )}

      ${section(
        '多选与搜索',
        'multiple 开启多选，filter 开启搜索。',
        html`
          <semi-select
            multiple
            filter
            .options=${this._options}
            .defaultValue=${['semi', 'arco']}
            placeholder="请选择"
            style="max-width: 420px;"
          ></semi-select>
        `,
        `<semi-select multiple filter .options=\${options}
  .defaultValue=\${['semi', 'arco']}></semi-select>`
      )}

      ${section(
        '尺寸与禁用',
        'size 控制尺寸，disabled 禁用交互。',
        html`
          <semi-space direction="vertical" style="width: 100%;">
            <semi-select size="small" .options=${this._options} placeholder="Small" style="max-width: 320px;"></semi-select>
            <semi-select size="large" .options=${this._options} placeholder="Large" style="max-width: 320px;"></semi-select>
            <semi-select disabled .options=${this._options} .defaultValue=${'semi'} style="max-width: 320px;"></semi-select>
          </semi-space>
        `,
        `<semi-select size="large" .options=\${options}></semi-select>
<semi-select disabled .options=\${options}></semi-select>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'select-docs': SelectDocs
  }
}
