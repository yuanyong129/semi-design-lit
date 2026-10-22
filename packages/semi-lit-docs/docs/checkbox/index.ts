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

@customElement('checkbox-docs')
class CheckboxDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>复选框</h1>
      <p>复选框用于在一组选项中选中多个选项，支持受控、非受控、半选与禁用状态。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/checkbox" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'CheckboxGroup 通过 value / defaultValue 管理选中的值数组。',
        html`
          <semi-checkbox-group .defaultValue=${['semi']}>
            <semi-checkbox value="semi">Semi Design</semi-checkbox>
            <semi-checkbox value="arco">Arco Design</semi-checkbox>
            <semi-checkbox value="antd">Ant Design</semi-checkbox>
          </semi-checkbox-group>
        `,
        `<semi-checkbox-group .defaultValue=\${['semi']}>
  <semi-checkbox value="semi">Semi Design</semi-checkbox>
  <semi-checkbox value="arco">Arco Design</semi-checkbox>
</semi-checkbox-group>`
      )}

      ${section(
        '选项与半选',
        '通过 options 渲染选项；indeterminate 展示半选状态。',
        html`
          <semi-space direction="vertical">
            <semi-checkbox-group
              .options=${[
                { label: 'Semi Design', value: 'semi' },
                { label: 'Arco Design', value: 'arco' },
                { label: 'Ant Design', value: 'antd', disabled: true },
              ]}
            ></semi-checkbox-group>
            <semi-checkbox indeterminate>半选状态</semi-checkbox>
          </semi-space>
        `,
        `<semi-checkbox-group .options=\${options}></semi-checkbox-group>
<semi-checkbox indeterminate>半选状态</semi-checkbox>`
      )}

      ${section(
        '禁用',
        '禁用单个选项或整个复选框组。',
        html`
          <semi-checkbox-group disabled>
            <semi-checkbox value="a" checked>选项 A</semi-checkbox>
            <semi-checkbox value="b">选项 B</semi-checkbox>
          </semi-checkbox-group>
        `,
        `<semi-checkbox-group disabled>
  <semi-checkbox value="a" checked>选项 A</semi-checkbox>
</semi-checkbox-group>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'checkbox-docs': CheckboxDocs
  }
}
