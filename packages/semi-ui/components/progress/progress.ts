import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';

const prefixCls = getPrefixCls('progress');
const p = unsafeCSS(prefixCls);

export type ProgressType = 'line' | 'circle';
export type ProgressStatus = 'normal' | 'active' | 'success' | 'warning' | 'error';
export type ProgressSize = 'small' | 'default' | 'large';

@customElement('semi-progress')
export class SemiProgress extends LitElement {
  /**
   * @zh 百分比
   * @en Percentage
   */
  @property({ type: Number })
  percent: number = 0;

  /**
   * @zh 进度条类型
   * @en Progress type
   * @values 'line','circle'
   */
  @property({ reflect: true })
  type: ProgressType = 'line';

  /**
   * @zh 状态
   * @en Status
   * @values 'normal','active','success','warning','error'
   */
  @property()
  status: ProgressStatus = 'normal';

  /**
   * @zh 尺寸
   * @en Size
   * @values 'small','default','large'
   */
  @property()
  size: ProgressSize = 'default';

  /**
   * @zh 线宽
   * @en Stroke width
   */
  @property({ attribute: 'stroke-width', type: Number })
  strokeWidth?: number;

  /**
   * @zh 是否显示百分比
   * @en Whether to show the percentage
   */
  @property({ attribute: 'show-info', type: Boolean })
  showInfo: boolean = true;

  /**
   * @zh 自定义百分比文本
   * @en Custom percentage formatter
   */
  @property({ attribute: false })
  format?: (percent: number) => string;

  /**
   * @zh 进度条颜色
   * @en Progress color
   */
  @property({ attribute: 'stroke-color' })
  strokeColor?: string;

  /**
   * @zh 轨道颜色
   * @en Trail color
   */
  @property({ attribute: 'trail-color' })
  trailColor?: string;

  private get _percent(): number {
    return Math.max(0, Math.min(100, Number(this.percent) || 0));
  }

  private get _text(): string {
    return this.format ? this.format(this._percent) : `${this._percent}%`;
  }

  private get _color(): string | undefined {
    if (this.strokeColor) return this.strokeColor;
    if (this.status === 'success') return 'var(--semi-color-success)';
    if (this.status === 'warning') return 'var(--semi-color-warning)';
    if (this.status === 'error') return 'var(--semi-color-danger)';
    return undefined;
  }

  private get _circleSize(): number {
    if (this.size === 'small') return 64;
    if (this.size === 'large') return 120;
    return 80;
  }

  private _renderInfo() {
    if (!this.showInfo) return nothing;
    return html`<span class="${prefixCls}-info">${this._text}</span>`;
  }

  private _renderLine() {
    const color = this._color;
    const height = this.strokeWidth ?? (this.size === 'small' ? 4 : this.size === 'large' ? 12 : 8);
    return html`
      <div class="${prefixCls}-line" part="progress">
        <div
          class="${prefixCls}-track"
          style="height: ${height}px; ${this.trailColor ? `background-color: ${this.trailColor};` : ''}"
        >
          <div
            class="${prefixCls}-fill ${this.status === 'active' ? `${prefixCls}-active` : ''}"
            style="width: ${this._percent}%; ${color ? `background-color: ${color};` : ''}"
          ></div>
        </div>
        ${this._renderInfo()}
      </div>
    `;
  }

  private _renderCircle() {
    const size = this._circleSize;
    const stroke = this.strokeWidth ?? 6;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - this._percent / 100);
    const color = this._color;

    return html`
      <div class="${prefixCls}-circle" style="width: ${size}px; height: ${size}px;" part="progress">
        <svg viewBox="0 0 100 100" role="presentation">
          <circle
            class="${prefixCls}-circle-trail"
            cx="50"
            cy="50"
            r=${radius}
            fill="none"
            stroke-width=${stroke}
            stroke=${this.trailColor ?? 'var(--semi-color-fill-0)'}
          ></circle>
          <circle
            class="${prefixCls}-circle-fill ${this.status === 'active' ? `${prefixCls}-active` : ''}"
            cx="50"
            cy="50"
            r=${radius}
            fill="none"
            stroke-width=${stroke}
            stroke=${color ?? 'var(--semi-color-primary)'}
            stroke-dasharray=${circumference}
            stroke-dashoffset=${offset}
            stroke-linecap="round"
          ></circle>
        </svg>
        ${this._renderInfo()}
      </div>
    `;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.type}`,
      `${prefixCls}-${this.size}`,
      `${prefixCls}-status-${this.status}`,
    ]);

    return html`
      <div
        class="${cls}"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this._percent}
      >
        ${this.type === 'circle' ? this._renderCircle() : this._renderLine()}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    :host([type='circle']) {
      display: inline-block;
      width: auto;
    }

    .${p} {
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--semi-color-text-2);
      font-size: 14px;
    }

    .${p}-line {
      display: flex;
      flex: 1;
      align-items: center;
      min-width: 0;
    }

    .${p}-track {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      background-color: var(--semi-color-fill-0);
      border-radius: var(--semi-border-radius-full, 999px);
    }

    .${p}-fill {
      height: 100%;
      background-color: var(--semi-color-primary);
      border-radius: inherit;
      transition: width 0.3s ease;
    }

    .${p}-active {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.24) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.24) 50%,
        rgba(255, 255, 255, 0.24) 75%,
        transparent 75%,
        transparent
      );
      background-size: 20px 20px;
      animation: ${p}-active 1s linear infinite;
    }

    @keyframes ${p}-active {
      from {
        background-position: 0 0;
      }

      to {
        background-position: 20px 0;
      }
    }

    .${p}-info {
      flex-shrink: 0;
      min-width: 44px;
      margin-left: 8px;
      color: var(--semi-color-text-2);
      text-align: right;
    }

    .${p}-circle {
      position: relative;
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
    }

    .${p}-circle svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .${p}-circle-fill {
      transition: stroke-dashoffset 0.3s ease;
    }

    .${p}-circle .${p}-info {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      color: var(--semi-color-text-0);
      font-size: 14px;
    }

    .${p}-status-success .${p}-info,
    .${p}-status-warning .${p}-info,
    .${p}-status-error .${p}-info {
      color: var(--semi-color-text-0);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-progress': SemiProgress
  }
}
