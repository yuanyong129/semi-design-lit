import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HighlightSearchWord } from '@semi-ui';
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

const source = 'Semi Design 是一个设计系统，Semi 组件帮助团队快速构建界面。';

@customElement('highlight-docs')
class HighlightDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _words: HighlightSearchWord[] = [
    { text: 'Semi' },
    { text: '设计', style: { textDecoration: 'underline' } },
    { text: '组件', style: { color: '#d83931' } },
  ];

  render() {
    return html`
      <h1>Highlight 高亮文本</h1>
      <p>在文本中高亮搜索词，支持多个关键词、大小写控制与自定义高亮样式。</p>
      <p><a href="https://semi.design/zh-CN/show/highlight" target="_blank" rel="noreferrer">查看 Semi Design 官方文档</a></p>

      ${section(
        '基本用法',
        '通过 source-string 提供文本，search-words 传入需要高亮的关键词。',
        html`<p style="line-height: 2;">
          <semi-highlight
            .sourceString=${source}
            .searchWords=${['Semi', '设计']}
          ></semi-highlight>
        </p>`,
        `<semi-highlight
  .sourceString=\${source}
  .searchWords=\${['Semi', '设计']}
></semi-highlight>`
      )}

      ${section(
        '多词与重叠',
        '多个搜索词会合并重叠区间；匹配到的文本按顺序拆分为高亮与非高亮片段。',
        html`<p style="line-height: 2;">
          <semi-highlight
            .sourceString=${'Semi Design Lit'}
            .searchWords=${['Semi', 'Design', 'Design Lit']}
          ></semi-highlight>
        </p>`,
        `<semi-highlight
  .sourceString="Semi Design Lit"
  .searchWords=\${['Semi', 'Design', 'Design Lit']}
></semi-highlight>`
      )}

      ${section(
        '大小写与转义',
        'case-sensitive 控制是否区分大小写；auto-escape 控制搜索词中的正则字符是否自动转义。',
        html`<p style="line-height: 2;">
          区分大小写：
          <semi-highlight
            case-sensitive
            .sourceString=${'semi Semi semi'}
            .searchWords=${['Semi']}
          ></semi-highlight>
        </p>
        <p style="line-height: 2;">
          转义点号：
          <semi-highlight
            .sourceString=${'a.b axb a.b'}
            .searchWords=${['a.b']}
          ></semi-highlight>
        </p>`,
        `<semi-highlight
  case-sensitive
  .sourceString="semi Semi semi"
  .searchWords=\${['Semi']}
></semi-highlight>`
      )}

      ${section(
        '自定义高亮样式',
        'highlight-class-name / highlight-style 作用于所有高亮片段；搜索词对象可单独设置行内样式。',
        html`<p style="line-height: 2;">
          <semi-highlight
            highlight-class-name="demo-highlight"
            .highlightStyle=${{ padding: '0 2px' }}
            .sourceString=${source}
            .searchWords=${this._words}
          ></semi-highlight>
        </p>
        <style>
          semi-highlight::part(highlight) { border-radius: 3px; }
        </style>`,
        `<semi-highlight
  highlight-class-name="demo-highlight"
  .highlightStyle=\${{ padding: '0 2px' }}
  .sourceString=\${source}
  .searchWords=\${[
    { text: 'Semi' },
    { text: '设计', style: { textDecoration: 'underline' } },
    { text: '组件', style: { color: '#d83931' } },
  ]}
></semi-highlight>`
      )}

      ${section(
        '自定义标签',
        'component 指定高亮节点的标签名，支持 mark、span、strong、em、b、i，默认 mark。',
        html`<p style="line-height: 2;">
          <semi-highlight
            component="strong"
            .sourceString=${source}
            .searchWords=${['Semi', '组件']}
          ></semi-highlight>
        </p>`,
        `<semi-highlight
  component="strong"
  .sourceString=\${source}
  .searchWords=\${['Semi', '组件']}
></semi-highlight>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'highlight-docs': HighlightDocs;
  }
}
