import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ColorPickerChangeDetail, ColorValue } from '@semi-ui';
import { colorStringToValue } from '@semi-ui';
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

const defaultColor = colorStringToValue('#39c5bb');

const stageStyle =
  'display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap; padding:20px; border:1px solid var(--semi-color-border); border-radius:8px; background:var(--semi-color-bg-2);';
@customElement('color-picker-docs')
class ColorPickerDocs extends LitElement {
  @state()
  private _controlled: ColorValue = colorStringToValue('#39c5bb');

  @state()
  private _basicText = '#39c5bb';

  @state()
  private _alphaText = '#39c5bb · 100%';

  protected createRenderRoot() {
    return this;
  }

  private _onBasicChange(event: CustomEvent<ColorPickerChangeDetail>) {
    this._basicText = event.detail.value.hex;
  }

  private _onAlphaChange(event: CustomEvent<ColorPickerChangeDetail>) {
    const { hex, rgba } = event.detail.value;
    this._alphaText = `${hex} · ${Math.round(rgba.a * 100)}%`;
  }

  private _onControlledChange(event: CustomEvent<ColorPickerChangeDetail>) {
    this._controlled = event.detail.value;
  }

  protected render() {
    return html`
      <style>
        .color-picker-demo-value {
          margin: 12px 0 0;
          font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
          color: var(--semi-color-text-2);
        }
        .color-picker-trigger-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .color-picker-slot-note {
          margin-top: 8px;
          font-size: 12px;
          color: var(--semi-color-text-2);
        }
      </style>
      <h1>颜色选择器</h1>
      <p>颜色选择器提供色板、色相与透明度调节，并支持 hex、rgba、hsva 三种输入格式。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/colorPicker" target="_blank">
          查看 Semi Design 官方文档
        </semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        'default-value 设置初始颜色；面板中的色板、色相条与输入框会同步更新。',
        html`
          <div style=${stageStyle}>
            <div>
              <semi-color-picker
                .defaultValue=${defaultColor}
                @change=${this._onBasicChange}
              ></semi-color-picker>
              <p class="color-picker-demo-value">当前颜色：${this._basicText}</p>
            </div>
          </div>
        `,
        `<semi-color-picker .defaultValue=\${color}></semi-color-picker>`
      )}

      ${section(
        '透明度',
        '开启 alpha 后显示透明度滑条与百分比输入；颜色值会保留两位小数透明度。',
        html`
          <div style=${stageStyle}>
            <div>
              <semi-color-picker
                alpha
                .defaultValue=${defaultColor}
                @change=${this._onAlphaChange}
              ></semi-color-picker>
              <p class="color-picker-demo-value">当前颜色：${this._alphaText}</p>
            </div>
          </div>
        `,
        `<semi-color-picker alpha .defaultValue=\${color}></semi-color-picker>`
      )}

      ${section(
        '弹层模式',
        'use-popover 将面板收进弹层；默认触发器显示当前颜色，也可以传入自定义子元素。',
        html`
          <div style=${stageStyle}>
            <div class="color-picker-trigger-row">
              <div>
                <semi-color-picker
                  use-popover
                  .defaultValue=${defaultColor}
                ></semi-color-picker>
                <p class="color-picker-demo-value">默认触发器</p>
              </div>
              <div>
                <semi-color-picker use-popover .defaultValue=${defaultColor}>
                  <semi-button>选择颜色</semi-button>
                </semi-color-picker>
                <p class="color-picker-demo-value">自定义触发器</p>
              </div>
            </div>
          </div>
        `,
        `<semi-color-picker use-popover .defaultValue=\${color}>
  <semi-button>选择颜色</semi-button>
</semi-color-picker>`
      )}

      ${section(
        '受控与格式',
        'value 为受控颜色对象；输入框支持 hex、rgba、hsva 切换，输入合法值后立即触发 change。',
        html`
          <div style=${stageStyle}>
            <div>
              <semi-color-picker
                alpha
                .value=${this._controlled}
                @change=${this._onControlledChange}
              ></semi-color-picker>
              <p class="color-picker-demo-value">
                hex=${this._controlled.hex}，rgba=${this._controlled.rgba.r},${this._controlled.rgba.g},${this._controlled.rgba.b},${this._controlled.rgba.a}
              </p>
            </div>
          </div>
        `,
        `<semi-color-picker
  alpha
  .value=\${color}
  @change=\${handleChange}
></semi-color-picker>`
      )}

      ${section(
        '尺寸与插槽',
        'width/height 调整色板尺寸；topSlot/bottomSlot 在面板上下插入自定义内容。',
        html`
          <div style=${stageStyle}>
            <div>
              <semi-color-picker
                alpha
                width="280"
                height="160"
                .defaultValue=${defaultColor}
                .topSlot=${html`<div class="color-picker-slot-note">品牌主色</div>`}
                .bottomSlot=${html`<div class="color-picker-slot-note">可拖拽色板与滑条调整</div>`}
              ></semi-color-picker>
              <p class="color-picker-demo-value">280 × 160，带顶部/底部插槽</p>
            </div>
          </div>
        `,
        `<semi-color-picker width="280" height="160">
</semi-color-picker>`
      )}
    `;
  }
}
