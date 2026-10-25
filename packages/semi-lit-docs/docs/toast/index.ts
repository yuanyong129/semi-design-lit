import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Toast } from '../../../semi-ui/components/toast';
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

@customElement('toast-docs')
class ToastDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>轻提示</h1>
      <p>Toast 提供命令式的轻量反馈，默认 3 秒后自动关闭，可手动关闭或设置持续时间。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/toast" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '类型',
        '通过 Toast.success / info / warning / error 快速展示不同类型。',
        html`
          <semi-space wrap>
            <semi-button type="primary" @click=${() => Toast.success('保存成功')}>成功</semi-button>
            <semi-button @click=${() => Toast.info('这是一条提示')}>信息</semi-button>
            <semi-button @click=${() => Toast.warning('请检查输入内容')}>警告</semi-button>
            <semi-button type="danger" @click=${() => Toast.error('操作失败')}>错误</semi-button>
          </semi-space>
        `,
        `import { Toast } from '@semi-design/semi-ui';

Toast.success('保存成功');
Toast.info('这是一条提示');
Toast.warning('请检查输入内容');
Toast.error('操作失败');`
      )}

      ${section(
        '手动关闭',
        '设置 closable 后可以手动关闭；close 方法可通过返回的 id 关闭指定提示。',
        html`
          <semi-button @click=${() => Toast.success({ content: '可手动关闭的提示', closable: true })}>
            打开可关闭提示
          </semi-button>
        `,
        `const id = Toast.success({ content: '可手动关闭的提示', closable: true });
Toast.close(id);`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toast-docs': ToastDocs
  }
}
