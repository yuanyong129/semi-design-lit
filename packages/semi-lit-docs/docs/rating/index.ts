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

@customElement('rating-docs')
class RatingDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _value = 3;

  @state()
  private _hoverValue = 0;

  @state()
  private _hoverText = '无';

  @state()
  private _halfValue = 3.5;

  @state()
  private _heartValue = 4;

  private _handleChange(event: CustomEvent<{ value: number }>) {
    this._value = event.detail.value;
  }

  private _handleHover(event: CustomEvent<{ value?: number }>) {
    this._hoverValue = event.detail.value ?? 0;
    this._hoverText = typeof event.detail.value === 'number' ? String(event.detail.value) : '无';
  }

  protected render() {
    return html`
      <h1>评分</h1>
      <p>评分用于收集用户对内容的评价，支持半星、自定义字符、提示文案与键盘操作。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/rating" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '通过 value 受控，默认允许再次点击当前分值取消评分。',
        html`
          <semi-space align="center" spacing={16}>
            <semi-rating .value=${this._value} @change=${this._handleChange}></semi-rating>
            <span>当前评分：${this._value}</span>
          </semi-space>
        `,
        `<semi-rating .value=\${value} @change=\${handleChange}></semi-rating>`
      )}

      ${section(
        '半星与提示',
        'allow-half 允许选择半星；tooltips 为每一颗星提供文字提示。',
        html`
          <semi-space align="center" spacing={16}>
            <semi-rating
              .allowHalf=${true}
              .defaultValue=${this._halfValue}
              .tooltips=${['很差', '较差', '一般', '不错', '很好']}
              @change=${(event: CustomEvent<{ value: number }>) => (this._halfValue = event.detail.value)}
            ></semi-rating>
            <span>当前评分：${this._halfValue}</span>
          </semi-space>
        `,
        `<semi-rating allow-half .defaultValue=\${3.5} .tooltips=\${['很差', '较差', '一般', '不错', '很好']}></semi-rating>`
      )}

      ${section(
        '自定义字符',
        'character 可替换默认的星形字符，支持字符串或模板。',
        html`
          <semi-space align="center" spacing={16}>
            <semi-rating
              .character=${'♥'}
              .count=${5}
              .defaultValue=${this._heartValue}
              @change=${(event: CustomEvent<{ value: number }>) => (this._heartValue = event.detail.value)}
            ></semi-rating>
            <span>喜欢程度：${this._heartValue}</span>
          </semi-space>
        `,
        `<semi-rating character="♥" .defaultValue=\${4}></semi-rating>`
      )}

      ${section(
        '尺寸',
        'size 支持 small、default，也可以传入数值控制字符大小。',
        html`
          <semi-space align="center" spacing={24}>
            <semi-rating size="small" .defaultValue=${3}></semi-rating>
            <semi-rating .defaultValue=${3}></semi-rating>
            <semi-rating .size=${28} .defaultValue=${3}></semi-rating>
          </semi-space>
        `,
        `<semi-rating size="small"></semi-rating>
<semi-rating></semi-rating>
<semi-rating .size=\${28}></semi-rating>`
      )}

      ${section(
        '悬浮与键盘',
        'hoverChange 在悬浮分值变化时触发；聚焦后可用方向键调整评分。',
        html`
          <semi-space align="center" spacing={16}>
            <semi-rating
              .allowHalf=${true}
              .defaultValue=${2.5}
              @hoverChange=${this._handleHover}
            ></semi-rating>
            <semi-tag color="blue">悬浮分值：${this._hoverText}</semi-tag>
          </semi-space>
        `,
        `<semi-rating allow-half @hoverChange=\${handleHover}></semi-rating>`
      )}

      ${section(
        '只读与禁用',
        'disabled 禁用交互，同时保持当前评分展示。',
        html`
          <semi-space align="center" spacing={24}>
            <semi-rating .defaultValue=${4} .disabled=${true}></semi-rating>
            <semi-rating .defaultValue=${2.5} .allowHalf=${true} .disabled=${true}></semi-rating>
          </semi-space>
        `,
        `<semi-rating .defaultValue=\${4} disabled></semi-rating>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rating-docs': RatingDocs;
  }
}
