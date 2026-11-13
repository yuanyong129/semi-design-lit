import { html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { styles } from './style/spin.style';
import { SpinSize } from './interface';

const prefixCls = getPrefixCls('spin');

@customElement('semi-spin')
export class SemiSpin extends LitElement {
  /**
   * @zh 是否为加载中状态
   * @en Whether the component is spinning
   */
  @property({ type: Boolean })
  spinning: boolean = true;

  /**
   * @zh 尺寸
   * @en Size
   * @values 'small','middle','large'
   * @defaultValue 'middle'
   */
  @property()
  size: SpinSize = 'middle';

  /**
   * @zh 加载提示文案
   * @en Loading tip
   */
  @property()
  tip?: string;

  /**
   * @zh 延迟显示时间（毫秒）
   * @en Delay before showing the spinner
   */
  @property({ type: Number })
  delay: number = 0;

  /**
   * @zh 自定义加载指示器
   * @en Custom loading indicator
   */
  @property({ attribute: false })
  indicator?: TemplateResult;

  @state()
  private _loading: boolean = false;

  private _timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._loading = this.spinning && !this.delay;
    this._scheduleLoading();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('spinning') || changed.has('delay')) {
      this._scheduleLoading();
    }
  }

  protected updated() {
    this.classList.toggle('semi-spin-host-block', this._hasChildren());
  }

  private _clearTimer() {
    if (this._timer !== undefined) {
      window.clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  private _scheduleLoading() {
    this._clearTimer();
    if (!this.spinning) {
      this._loading = false;
      return;
    }
    if (this.delay > 0) {
      this._loading = false;
      this._timer = window.setTimeout(() => {
        this._loading = true;
        this._timer = undefined;
      }, this.delay);
      return;
    }
    this._loading = true;
  }

  private _hasChildren() {
    return Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      return Boolean(node.textContent?.trim());
    });
  }

  private _handleSlotChange() {
    this.requestUpdate();
  }

  private _renderIndicator() {
    return html`
      <slot name="indicator">
        ${this.indicator ??
        html`
          <svg class="semi-spin-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.2"></circle>
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
          </svg>
        `}
      </slot>
    `;
  }

  render() {
    const hasChildren = this._hasChildren();
    const className = handleClsList([
      prefixCls,
      `${prefixCls}-${this.size}`,
      hasChildren ? `${prefixCls}-block` : '',
      !this._loading ? `${prefixCls}-hidden` : '',
    ]);

    return html`
      <div class="${className}" part="spin" role="status" aria-live="polite" aria-busy=${String(this._loading)}>
        <div class="${prefixCls}-wrapper">
          <span class="${prefixCls}-spinner">${this._renderIndicator()}</span>
          ${this.tip ? html`<div class="${prefixCls}-tip">${this.tip}</div>` : nothing}
        </div>
        <div class="${prefixCls}-children">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-spin': SemiSpin;
  }
}
