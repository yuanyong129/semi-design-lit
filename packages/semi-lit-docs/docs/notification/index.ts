import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Notification } from '../../../semi-ui/components/notification';
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

@customElement('notification-docs')
class NotificationDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>通知</h1>
      <p>Notification 在页面右上角展示带标题的通知，适合需要更多上下文的反馈。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/notification" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '类型',
        '通过 Notification.success / info / warning / error 展示通知。',
        html`
          <semi-space wrap>
            <semi-button
              type="primary"
              @click=${() => Notification.success({ title: '发布成功', content: '新版本已发布到生产环境。' })}
            >成功</semi-button>
            <semi-button
              @click=${() => Notification.info({ title: '系统提示', content: '今天 18:00 将进行系统维护。' })}
            >信息</semi-button>
            <semi-button
              @click=${() => Notification.warning({ title: '空间不足', content: '当前存储空间已使用 90%。' })}
            >警告</semi-button>
            <semi-button
              type="danger"
              @click=${() => Notification.error({ title: '部署失败', content: '构建过程中出现错误，请查看日志。' })}
            >错误</semi-button>
          </semi-space>
        `,
        `import { Notification } from '@semi-design/semi-ui';

Notification.success({ title: '发布成功', content: '新版本已发布。' });
Notification.info({ title: '系统提示', content: '今天 18:00 系统维护。' });`
      )}

      ${section(
        '手动关闭',
        'Notification 默认展示关闭按钮，也可以调用 close / destroyAll。',
        html`
          <semi-button
            @click=${() => Notification.open({ title: '可关闭通知', content: '点击右上角关闭按钮关闭。', duration: 0 })}
          >打开常驻通知</semi-button>
        `,
        `Notification.open({ title: '通知', content: '内容', duration: 0 });
Notification.destroyAll();`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'notification-docs': NotificationDocs
  }
}
