import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ResizableEnable, ResizableSize } from '@semi-ui';
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

const basicSize: ResizableSize = { width: 320, height: 180 };
const directionSize: ResizableSize = { width: 280, height: 160 };
const constraintSize: ResizableSize = { width: 280, height: 170 };
const ratioSize: ResizableSize = { width: 240, height: 150 };
const controlledSize: ResizableSize = { width: 300, height: 170 };

const directions: ResizableEnable = {
  top: false,
  left: false,
  topLeft: false,
  bottomLeft: false,
};

@customElement('resizable-docs')
class ResizableDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _size: ResizableSize = controlledSize;

  private _formatSize(size: ResizableSize): string {
    const format = (value: string | number | undefined) =>
      typeof value === 'number' ? `${Math.round(value)}px` : value ?? 'auto';
    return `${format(size.width)} × ${format(size.height)}`;
  }

  private _handleControlledChange = (size: ResizableSize): void => {
    this._size = { width: size.width, height: size.height };
  };

  private _reset = (): void => {
    this._size = { ...controlledSize };
  };

  render() {
    return html`
      <style>
        .resizable-demo-box {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          min-height: 80px;
          padding: 14px 16px;
          overflow: hidden;
          color: var(--semi-color-text-0);
          background: var(--semi-color-fill-0);
          border: 1px dashed var(--semi-color-border);
          border-radius: 8px;
        }
        .resizable-demo-box strong {
          font-size: 14px;
        }
        .resizable-demo-box span {
          color: var(--semi-color-text-2);
          font-size: 12px;
        }
        .resizable-demo-grip {
          position: absolute;
          right: 8px;
          bottom: 8px;
          width: 10px;
          height: 10px;
          border-right: 2px solid var(--semi-color-text-3);
          border-bottom: 2px solid var(--semi-color-text-3);
        }
        .resizable-demo-result {
          margin-top: 12px;
          color: var(--semi-color-text-1);
          font-size: 13px;
        }
      </style>

      <h1>Resizable 可调整尺寸</h1>
      <p>通过拖拽容器边缘或角落调整宽高，支持约束、吸附、宽高比与受控尺寸。</p>
      <p><a href="https://semi.design/zh-CN/basic/resizable" target="_blank" rel="noreferrer">查看 Semi Design 官方文档</a></p>

      ${section(
        '基本用法',
        'default-size 设置初始尺寸，拖动边框或右下角即可调整大小。',
        html`<semi-resizable .defaultSize=${basicSize}>
          <div class="resizable-demo-box">
            <strong>可调整尺寸的容器</strong>
            <span>拖动边缘或右下角调整宽高</span>
            <i class="resizable-demo-grip"></i>
          </div>
        </semi-resizable>`,
        `<semi-resizable .defaultSize=\${{ width: 320, height: 180 }}>
  <div class="resizable-demo-box">拖动边缘或右下角</div>
</semi-resizable>`
      )}

      ${section(
        '方向控制',
        'enable 控制可用的拖拽方向；传入 false 可隐藏全部手柄。',
        html`<semi-resizable .defaultSize=${directionSize} .enable=${directions}>
          <div class="resizable-demo-box">
            <strong>仅右侧、底部与右下角</strong>
            <span>上、左及左侧两个角落已禁用</span>
            <i class="resizable-demo-grip"></i>
          </div>
        </semi-resizable>`,
        `<semi-resizable
  .defaultSize=\${{ width: 280, height: 160 }}
  .enable=\${{ top: false, left: false, topLeft: false, bottomLeft: false }}
>
  <div class="resizable-demo-box">仅右侧、底部可拖动</div>
</semi-resizable>`
      )}

      ${section(
        '约束、吸附与网格',
        'min/max 限制尺寸范围，grid 按网格步长取整，snap 可在指定尺寸附近吸附。',
        html`<semi-resizable
          .defaultSize=${constraintSize}
          min-width="180"
          min-height="120"
          max-width="380"
          max-height="260"
          .grid=${[20, 20]}
          .snap=${{ x: [220, 300], y: [140, 220] }}
        >
          <div class="resizable-demo-box">
            <strong>最小 180 × 120</strong>
            <span>最大 380 × 260，网格 20px</span>
            <i class="resizable-demo-grip"></i>
          </div>
        </semi-resizable>`,
        `<semi-resizable
  min-width="180"
  min-height="120"
  max-width="380"
  max-height="260"
  .grid=\${[20, 20]}
  .snap=\${{ x: [220, 300], y: [140, 220] }}
></semi-resizable>`
      )}

      ${section(
        '锁定宽高比',
        'lock-aspect-ratio 为 true 时保持初始宽高比；传入数字则使用指定比例。',
        html`<semi-resizable lock-aspect-ratio .defaultSize=${ratioSize}>
          <div class="resizable-demo-box">
            <strong>锁定宽高比</strong>
            <span>拖动任意角落保持 8:5</span>
            <i class="resizable-demo-grip"></i>
          </div>
        </semi-resizable>`,
        `<semi-resizable lock-aspect-ratio .defaultSize=\${{ width: 240, height: 150 }}>
  <div class="resizable-demo-box">锁定宽高比</div>
</semi-resizable>`
      )}

      ${section(
        '受控尺寸与回调',
        'size 为受控尺寸；onChange 返回 width、height、direction 与原始事件。',
        html`<semi-resizable .size=${this._size} .onChange=${this._handleControlledChange}>
          <div class="resizable-demo-box">
            <strong>受控尺寸</strong>
            <span>当前：${this._formatSize(this._size)}</span>
            <i class="resizable-demo-grip"></i>
          </div>
        </semi-resizable>
        <div class="resizable-demo-result">
          当前尺寸：${this._formatSize(this._size)}
          <button style="margin-left: 12px;" @click=${this._reset}>重置</button>
        </div>`,
        `<semi-resizable
  .size=\${this._size}
  .onChange=\${this._handleControlledChange}
>
  <div class="resizable-demo-box">受控尺寸</div>
</semi-resizable>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'resizable-docs': ResizableDocs;
  }
}
