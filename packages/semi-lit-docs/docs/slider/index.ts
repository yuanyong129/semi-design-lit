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

@customElement('slider-docs')
class SliderDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value = 30;

  @state()
  private _range: number[] = [20, 60];

  @state()
  private _stepValue = 40;

  @state()
  private _disabledValue = 50;

  @state()
  private _customValue = 60;

  protected render() {
    return html`
      <h1>滑动输入条</h1>
      <p>滑动输入条用于在连续或离散区间内选择数值，支持范围选择、刻度标记、垂直布局与键盘操作。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/slider" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 value 受控，拖动滑块或点击轨道调整数值；支持方向键微调。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-slider
              .value=${this._value}
              @change=${(event: CustomEvent<{ value: number }>) => (this._value = event.detail.value)}
            ></semi-slider>
            <span style="flex:0 0 72px;color:var(--semi-color-text-2)">${this._value}</span>
          </div>
        `,
        `<semi-slider .value=\${value} @change=\${handleChange}></semi-slider>`
      )}

      ${section(
        '范围选择',
        'range 开启双滑块，value 为两个数字组成的数组，结果会自动排序。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-slider
              range
              .value=${this._range}
              @change=${(event: CustomEvent<{ value: number[] }>) => (this._range = event.detail.value)}
            ></semi-slider>
            <span style="flex:0 0 72px;color:var(--semi-color-text-2)">${this._range[0]} - ${this._range[1]}</span>
          </div>
        `,
        `<semi-slider range .value=\${[20, 60]} @change=\${handleRangeChange}></semi-slider>`
      )}

      ${section(
        '分段与标记',
        'step 控制步长，marks 在指定位置展示刻度，show-boundary 展示最小与最大值。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-slider
              step="10"
              show-boundary
              .value=${this._stepValue}
              .marks=${{ 0: '0', 20: '20', 40: '40', 60: '60', 80: '80', 100: '100' }}
              @change=${(event: CustomEvent<{ value: number }>) => (this._stepValue = event.detail.value)}
            ></semi-slider>
            <span style="flex:0 0 72px;color:var(--semi-color-text-2)">${this._stepValue}</span>
          </div>
        `,
        `<semi-slider step="10" show-boundary .marks=\${{ 0: '0', 50: '50', 100: '100' }}></semi-slider>`
      )}

      ${section(
        '垂直与反向',
        'vertical 将滑动条旋转为纵向，vertical-reverse 反转纵向方向，reverse 反转横向方向。',
        html`
          <div style="display:flex;align-items:flex-end;gap:56px;height:200px">
            <semi-slider vertical .value=${30}></semi-slider>
            <semi-slider vertical vertical-reverse .value=${30}></semi-slider>
            <semi-slider reverse .value=${70}></semi-slider>
          </div>
        `,
        `<semi-slider vertical .value=\${30}></semi-slider>
<semi-slider vertical vertical-reverse .value=\${30}></semi-slider>
<semi-slider reverse .value=\${70}></semi-slider>`
      )}

      ${section(
        '禁用与自定义提示',
        'disabled 禁用交互，tooltip-visible 始终展示提示，tip-formatter 自定义提示内容。',
        html`
          <div style="display:flex;align-items:center;gap:24px">
            <semi-slider disabled .value=${this._disabledValue}></semi-slider>
            <span style="flex:0 0 72px;color:var(--semi-color-text-2)">${this._disabledValue}</span>
          </div>
          <div style="display:flex;align-items:center;gap:24px;margin-top:24px">
            <semi-slider
              tooltip-visible
              .value=${this._customValue}
              .tipFormatter=${(value: number) => `${value}%`}
              @change=${(event: CustomEvent<{ value: number }>) => (this._customValue = event.detail.value)}
            ></semi-slider>
            <span style="flex:0 0 72px;color:var(--semi-color-text-2)">${this._customValue}%</span>
          </div>
        `,
        `<semi-slider disabled .value=\${50}></semi-slider>
<semi-slider tooltip-visible .tipFormatter=\${(value) => \`\${value}%\`}></semi-slider>`
      )}
    `;
  }
}
