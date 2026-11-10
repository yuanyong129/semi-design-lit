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

@customElement('steps-docs')
class StepsDocs extends LitElement {
  @state()
  private _current = 1;

  @state()
  private _navCurrent = 0;

  protected createRenderRoot() {
    return this;
  }

  private _onChange(event: CustomEvent<{ current: number }>) {
    this._current = event.detail.current;
  }

  private _onNavChange(event: CustomEvent<{ current: number }>) {
    this._navCurrent = event.detail.current;
  }

  protected render() {
    return html`
      <h1>步骤条</h1>
      <p>步骤条引导用户按照流程完成任务，支持水平 / 垂直、点状、导航与点击切换。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/steps" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'current 指定当前步骤，status 控制当前步骤状态。',
        html`
          <semi-steps
            .current=${this._current}
            clickable
            @change=${this._onChange}
            style="width: 100%"
          >
            <semi-step title="创建账号" description="填写基础信息"></semi-step>
            <semi-step title="完成配置" description="选择团队与权限"></semi-step>
            <semi-step title="开始使用" description="进入工作台"></semi-step>
          </semi-steps>
          <p style="margin: 16px 0 0; color: var(--semi-color-text-2); font-size: 12px;">
            当前步骤：${this._current + 1}
          </p>
        `,
        `<semi-steps current="1" clickable>
  <semi-step title="创建账号" description="填写基础信息"></semi-step>
  <semi-step title="完成配置" description="选择团队与权限"></semi-step>
  <semi-step title="开始使用" description="进入工作台"></semi-step>
</semi-steps>`
      )}

      ${section(
        '状态',
        '通过 status 指定当前步骤的 error、warning 或 finish 状态。',
        html`
          <semi-space direction="vertical" .spacing=${24} style="width: 100%">
            <semi-steps current="1" status="error">
              <semi-step title="提交申请"></semi-step>
              <semi-step title="审核失败"></semi-step>
              <semi-step title="重新提交"></semi-step>
            </semi-steps>
            <semi-steps current="2" status="finish">
              <semi-step title="填写信息"></semi-step>
              <semi-step title="确认信息"></semi-step>
              <semi-step title="完成"></semi-step>
            </semi-steps>
          </semi-space>
        `,
        `<semi-steps current="1" status="error">…</semi-steps>
<semi-steps current="2" status="finish">…</semi-steps>`
      )}

      ${section(
        '点状与垂直',
        'type="dot" 展示点状步骤，direction="vertical" 切换为垂直排列。',
        html`
          <semi-space direction="vertical" .spacing=${24} style="width: 100%">
            <semi-steps current="1" type="dot">
              <semi-step title="创建"></semi-step>
              <semi-step title="部署"></semi-step>
              <semi-step title="验证"></semi-step>
            </semi-steps>
            <semi-steps current="1" direction="vertical">
              <semi-step title="准备环境" description="安装依赖并初始化项目"></semi-step>
              <semi-step title="构建产物" description="执行构建命令"></semi-step>
              <semi-step title="发布上线" description="推送至生产环境"></semi-step>
            </semi-steps>
          </semi-space>
        `,
        `<semi-steps current="1" type="dot">…</semi-steps>
<semi-steps current="1" direction="vertical">…</semi-steps>`
      )}

      ${section(
        '导航式',
        'type="nav" 将步骤展示为导航块，点击任意步骤切换。',
        html`
          <semi-steps
            type="nav"
            .current=${this._navCurrent}
            @change=${this._onNavChange}
            style="width: 100%"
          >
            <semi-step title="基本信息" description="账号与团队"></semi-step>
            <semi-step title="项目配置" description="仓库与构建"></semi-step>
            <semi-step title="完成" description="进入控制台"></semi-step>
          </semi-steps>
        `,
        `<semi-steps type="nav" current="0">…</semi-steps>`
      )}
    `;
  }
}
