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

@customElement('pagination-docs')
class PaginationDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>分页器</h1>
      <p>Pagination 用于分页展示数据，支持总条数、页码省略与尺寸。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/navigation/pagination" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '设置 total 与 pageSize，点击页码或上一页/下一页切换。',
        html`
          <semi-pagination total=${100} pageSize=${10}></semi-pagination>
        `,
        `<semi-pagination total="100" page-size="10"></semi-pagination>`
      )}

      ${section(
        '总条数与尺寸',
        'show-total 展示总条数，size 控制尺寸。',
        html`
          <semi-space direction="vertical">
            <semi-pagination total=${240} pageSize=${20} show-total></semi-pagination>
            <semi-pagination total=${50} pageSize=${10} size="small"></semi-pagination>
          </semi-space>
        `,
        `<semi-pagination total="240" page-size="20" show-total></semi-pagination>
<semi-pagination total="50" page-size="10" size="small"></semi-pagination>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pagination-docs': PaginationDocs
  }
}
