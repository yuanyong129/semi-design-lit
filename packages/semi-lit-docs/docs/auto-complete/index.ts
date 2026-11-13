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

@customElement('auto-complete-docs')
class AutoCompleteDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value = '';

  @state()
  private _selected = '';

  @state()
  private _search = '';

  @state()
  private _basicInput = '';

  @state()
  private _loading = false;

  private _options = ['Semi Design', 'Semi UI', 'Semi Design Lit', 'Lit', 'Web Components'];

  private get _filteredOptions() {
    const query = this._basicInput.trim().toLowerCase();
    if (!query) return this._options;
    return this._options.filter((option) => option.toLowerCase().includes(query));
  }

  private _handleBasicSearch(event: CustomEvent<{ inputValue: string }>) {
    this._basicInput = event.detail.inputValue;
  }

  protected render() {
    return html`
      <h1>自动补全</h1>
      <p>自动补全在输入框中提供候选列表，支持自由输入、过滤、键盘选择与自定义选项。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/autocomplete" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '在 search 事件中过滤 data 并回传，使用方向键切换、Enter 选中，也可以直接输入自由文本。',
        html`
          <div style="width:320px">
            <semi-auto-complete
              .data=${this._filteredOptions}
              .value=${this._value}
              placeholder="请输入或选择"
              show-clear
              @search=${this._handleBasicSearch}
              @change=${(event: CustomEvent<{ value: string }>) => (this._value = event.detail.value)}
              @select=${(event: CustomEvent<{ value: string }>) => (this._selected = event.detail.value)}
            ></semi-auto-complete>
            <p style="margin-top:12px;color:var(--semi-color-text-2)">
              当前输入：${this._value || '空'}；最近选择：${this._selected || '无'}
            </p>
          </div>
        `,
        `<semi-auto-complete
  .data=\${filteredOptions}
  .value=\${value}
  @search=\${handleSearch}
  @change=\${handleChange}
  @select=\${handleSelect}
></semi-auto-complete>`
      )}

      ${section(
        '自定义选项',
        '数据项可以使用对象描述显示文案与禁用状态。',
        html`
          <div style="width:320px">
            <semi-auto-complete
              .data=${[
                { value: 'design', label: '设计系统' },
                { value: 'component', label: '组件开发' },
                { value: 'quality', label: '质量保障' },
                { value: 'legacy', label: '旧版入口（禁用）', disabled: true },
              ]}
              placeholder="选择工作方向"
            ></semi-auto-complete>
          </div>
        `,
        `<semi-auto-complete
  .data=\${[
    { value: 'design', label: '设计系统' },
    { value: 'component', label: '组件开发' },
    { value: 'legacy', label: '旧版入口', disabled: true },
  ]}
></semi-auto-complete>`
      )}

      ${section(
        '搜索与空状态',
        'search 事件返回当前输入值，loading 与 empty-content 控制候选区域的反馈。',
        html`
          <div style="display:flex;align-items:flex-start;gap:16px">
            <div style="width:320px">
              <semi-auto-complete
                .data=${[]}
                empty-content="没有匹配的选项"
                placeholder="输入以搜索"
                ?loading=${this._loading}
                @search=${(event: CustomEvent<{ inputValue: string }>) => (this._search = event.detail.inputValue)}
              ></semi-auto-complete>
            </div>
            <div style="padding-top:6px;color:var(--semi-color-text-2)">
              <p style="margin:0 0 8px">搜索值：${this._search || '空'}</p>
              <semi-button size="small" @click=${() => (this._loading = !this._loading)}>
                ${this._loading ? '结束加载' : '模拟加载'}
              </semi-button>
            </div>
          </div>
        `,
        `<semi-auto-complete
  .data=\${[]}
  empty-content="没有匹配的选项"
  loading=\${loading}
  @search=\${handleSearch}
></semi-auto-complete>`
      )}

      ${section(
        '状态与尺寸',
        'size 支持 small、default、large；validate-status 展示校验状态，disabled 禁用交互。',
        html`
          <div style="display:flex;flex-direction:column;gap:16px;width:360px">
            <semi-auto-complete .data=${this._options} size="small" placeholder="small"></semi-auto-complete>
            <semi-auto-complete .data=${this._options} placeholder="default"></semi-auto-complete>
            <semi-auto-complete .data=${this._options} size="large" placeholder="large"></semi-auto-complete>
            <semi-auto-complete .data=${this._options} validate-status="error" placeholder="error"></semi-auto-complete>
            <semi-auto-complete .data=${this._options} validate-status="warning" placeholder="warning"></semi-auto-complete>
            <semi-auto-complete .data=${this._options} disabled placeholder="disabled"></semi-auto-complete>
          </div>
        `,
        `<semi-auto-complete .data=\${options} size="small"></semi-auto-complete>
<semi-auto-complete .data=\${options} size="large"></semi-auto-complete>
<semi-auto-complete .data=\${options} validate-status="error"></semi-auto-complete>
<semi-auto-complete .data=\${options} disabled></semi-auto-complete>`
      )}

      ${section(
        '前后缀与内嵌标签',
        '通过 prefix、suffix 插槽和 inset-label 扩展输入区域。',
        html`
          <div style="display:flex;flex-direction:column;gap:16px;width:360px">
            <semi-auto-complete .data=${this._options} inset-label="项目" placeholder="输入后回车">
              <semi-icon-search slot="prefix"></semi-icon-search>
              <span slot="suffix" style="color:var(--semi-color-text-3)">Enter</span>
            </semi-auto-complete>
            <semi-auto-complete .data=${this._options} placeholder="带前缀与后缀">
              <span slot="prefix" style="padding-right:6px">#</span>
              <span slot="suffix" style="color:var(--semi-color-text-3)">⌘K</span>
            </semi-auto-complete>
          </div>
        `,
        `<semi-auto-complete .data=\${options} inset-label="项目" placeholder="输入后回车">
  <semi-icon-search slot="prefix"></semi-icon-search>
  <span slot="suffix">Enter</span>
</semi-auto-complete>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auto-complete-docs': AutoCompleteDocs
  }
}
