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

@customElement('form-docs')
class FormDocs extends LitElement {
  @state()
  private _result = '';

  protected createRenderRoot() {
    return this;
  }

  private async _handleSubmit() {
    const form = this.querySelector('semi-form') as any;
    const errors = await form?.validate();
    this._result = errors ? `校验失败：${Object.keys(errors).length} 个字段` : '校验通过';
  }

  protected render() {
    return html`
      <h1>表单</h1>
      <p>Form 负责收集、校验与提交表单数据；FormItem 负责标签、字段注册与校验状态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/form" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'FormItem 通过 field 绑定字段，rules 定义校验规则；Input 的变更会自动写回表单。',
        html`
          <semi-form layout="vertical" style="max-width: 480px;">
            <semi-form-item field="username" label="用户名" .rules=${[{ required: true, message: '请输入用户名' }]}>
              <semi-input placeholder="请输入用户名"></semi-input>
            </semi-form-item>
            <semi-form-item field="email" label="邮箱" .rules=${[{ type: 'email', message: '邮箱格式不正确' }]}>
              <semi-input placeholder="请输入邮箱"></semi-input>
            </semi-form-item>
            <semi-form-item field="description" label="描述">
              <semi-textarea placeholder="请输入描述" .rows=${3}></semi-textarea>
            </semi-form-item>
            <semi-space>
              <semi-button type="primary" @click=${this._handleSubmit}>提交</semi-button>
              <semi-button @click=${() => (this._result = '')}>重置结果</semi-button>
              ${this._result ? html`<semi-tag color=${this._result === '校验通过' ? 'green' : 'red'}>${this._result}</semi-tag>` : ''}
            </semi-space>
          </semi-form>
        `,
        `<semi-form layout="vertical">
  <semi-form-item field="username" label="用户名"
    .rules=\${[{ required: true, message: '请输入用户名' }]}>
    <semi-input placeholder="请输入用户名"></semi-input>
  </semi-form-item>
  <semi-form-item field="email" label="邮箱"
    .rules=\${[{ type: 'email', message: '邮箱格式不正确' }]}>
    <semi-input placeholder="请输入邮箱"></semi-input>
  </semi-form-item>
</semi-form>`
      )}

      ${section(
        '布局',
        'layout 支持 horizontal / vertical；label-position 控制标签在上方或左侧。',
        html`
          <semi-form layout="horizontal" label-position="left" label-width=${96}>
            <semi-form-item field="name" label="名称">
              <semi-input placeholder="水平布局"></semi-input>
            </semi-form-item>
            <semi-form-item field="type" label="类型">
              <semi-input placeholder="标签在左侧"></semi-input>
            </semi-form-item>
          </semi-form>
        `,
        `<semi-form layout="horizontal" label-position="left" label-width=\${96}>
  <semi-form-item field="name" label="名称">
    <semi-input></semi-input>
  </semi-form-item>
</semi-form>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-docs': FormDocs
  }
}
