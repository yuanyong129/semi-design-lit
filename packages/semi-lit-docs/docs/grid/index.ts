import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block demo-block-wide">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

const cell = (label: string, background = 'var(--semi-color-primary-light-default)') => html`
  <div
    style="padding: 12px 0; text-align: center; font-size: 13px; color: var(--semi-color-primary); background: ${background}; border-radius: 4px;"
  >
    ${label}
  </div>
`;

@customElement('grid-docs')
class GridDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>栅格</h1>
      <p>栅格基于 24 列布局，通过 Row 与 Col 组合完成页面分栏、间隔、偏移与响应式适配。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/basic/grid" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '将内容放入 semi-col，通过 span 指定占用的列数，每行共 24 列。',
        html`
          <semi-row gutter="16">
            <semi-col span="6">${cell('span=6')}</semi-col>
            <semi-col span="6">${cell('span=6')}</semi-col>
            <semi-col span="6">${cell('span=6')}</semi-col>
            <semi-col span="6">${cell('span=6')}</semi-col>
          </semi-row>
        `,
        `<semi-row gutter="16">
  <semi-col span="6">span=6</semi-col>
  <semi-col span="6">span=6</semi-col>
  <semi-col span="6">span=6</semi-col>
  <semi-col span="6">span=6</semi-col>
</semi-row>`
      )}

      ${section(
        '栅格间隔',
        'gutter 支持单个数字或 [水平间隔, 垂直间隔]，列内容会自动扣除左右间隔。',
        html`
          <semi-row .gutter=${[24, 16]}>
            <semi-col span="8">${cell('span=8')}</semi-col>
            <semi-col span="8">${cell('span=8')}</semi-col>
            <semi-col span="8">${cell('span=8')}</semi-col>
            <semi-col span="8">${cell('span=8')}</semi-col>
            <semi-col span="8">${cell('span=8')}</semi-col>
            <semi-col span="8">${cell('span=8')}</semi-col>
          </semi-row>
        `,
        `<semi-row .gutter=\${[24, 16]}>
  <semi-col span="8">span=8</semi-col>
  <semi-col span="8">span=8</semi-col>
  <semi-col span="8">span=8</semi-col>
</semi-row>`
      )}

      ${section(
        '偏移与排序',
        'offset 设置左侧偏移列数，push 与 pull 用于在不改变文档顺序的情况下调整位置。',
        html`
          <semi-row gutter="16">
            <semi-col span="8">${cell('span=8')}</semi-col>
            <semi-col span="8" offset="8">${cell('offset=8')}</semi-col>
          </semi-row>
          <div style="height: 16px"></div>
          <semi-row gutter="16">
            <semi-col span="8" push="8">${cell('push=8')}</semi-col>
            <semi-col span="8" pull="8">${cell('pull=8')}</semi-col>
          </semi-row>
        `,
        `<semi-row gutter="16">
  <semi-col span="8">span=8</semi-col>
  <semi-col span="8" offset="8">offset=8</semi-col>
</semi-row>
<semi-row gutter="16">
  <semi-col span="8" push="8">push=8</semi-col>
  <semi-col span="8" pull="8">pull=8</semi-col>
</semi-row>`
      )}

      ${section(
        '响应式',
        '通过 xs、sm、md、lg、xl、xxl 为不同屏幕设置 span，断点依次为 576 / 768 / 992 / 1200 / 1600px。',
        html`
          <semi-row gutter="16">
            <semi-col xs="24" sm="12" md="8" lg="6" xxl="4">${cell('响应式列')}</semi-col>
            <semi-col xs="24" sm="12" md="8" lg="6" xxl="4">${cell('响应式列')}</semi-col>
            <semi-col xs="24" sm="12" md="8" lg="6" xxl="4">${cell('响应式列')}</semi-col>
            <semi-col xs="24" sm="12" md="8" lg="6" xxl="4">${cell('响应式列')}</semi-col>
          </semi-row>
        `,
        `<semi-col xs="24" sm="12" md="8" lg="6" xxl="4">
  响应式列
</semi-col>`
      )}

      ${section(
        '对齐方式',
        'align 控制交叉轴对齐，justify 控制主轴排列，可配合不同高度的列使用。',
        html`
          <semi-row gutter="16" align="center" justify="space-between" style="height: 100px">
            <semi-col span="6"><div style="height: 36px; background: var(--semi-color-primary-light-default); border-radius: 4px"></div></semi-col>
            <semi-col span="6"><div style="height: 64px; background: var(--semi-color-primary-light-active); border-radius: 4px"></div></semi-col>
            <semi-col span="6"><div style="height: 48px; background: var(--semi-color-primary-light-default); border-radius: 4px"></div></semi-col>
          </semi-row>
        `,
        `<semi-row align="center" justify="space-between">
  <semi-col span="6">…</semi-col>
  <semi-col span="6">…</semi-col>
  <semi-col span="6">…</semi-col>
</semi-row>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'grid-docs': GridDocs;
  }
}
