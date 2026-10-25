import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';

const prefixCls = getPrefixCls('skeleton');
const p = unsafeCSS(prefixCls);

@customElement('semi-skeleton')
export class SemiSkeleton extends LitElement {
  /**
   * @zh 是否显示骨架屏
   * @en Whether to show the skeleton
   */
  @property({ type: Boolean })
  loading: boolean = true;

  /**
   * @zh 是否显示动画
   * @en Whether to show the shimmer animation
   */
  @property({ type: Boolean })
  active: boolean = false;

  /**
   * @zh 是否显示头像占位
   * @en Whether to show an avatar placeholder
   */
  @property({ type: Boolean })
  avatar: boolean = false;

  /**
   * @zh 是否显示标题占位
   * @en Whether to show a title placeholder
   */
  @property({ attribute: 'show-title', type: Boolean })
  showTitle: boolean = true;

  /**
   * @zh 段落行数
   * @en Number of paragraph rows
   */
  @property({ type: Number })
  rows: number = 3;

  /**
   * @zh 自定义占位内容
   * @en Custom placeholder
   */
  @property({ attribute: false })
  placeholder?: TemplateResult;

  private _rowWidth(index: number): string {
    if (index === this.rows - 1 && this.rows > 1) return '60%';
    return `${100 - (index % 4) * 8}%`;
  }

  private _renderSkeleton() {
    return html`
      <div
        class="${handleClsList([prefixCls, this.active ? `${prefixCls}-active` : ''])}"
        part="skeleton"
        aria-busy="true"
      >
        ${this.avatar ? html`<div class="${prefixCls}-avatar"></div>` : nothing}
        <div class="${prefixCls}-content">
          ${this.showTitle ? html`<div class="${prefixCls}-title"></div>` : nothing}
          ${Array.from({ length: this.rows }).map((_, index) => html`
            <div class="${prefixCls}-row" style="width: ${this._rowWidth(index)};"></div>
          `)}
        </div>
      </div>
    `;
  }

  render() {
    if (!this.loading) {
      return html`<slot></slot>`;
    }
    if (this.placeholder) {
      return html`<slot name="placeholder">${this.placeholder}</slot>`;
    }
    return this._renderSkeleton();
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      display: flex;
      width: 100%;
      align-items: flex-start;
    }

    .${p}-avatar {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-right: 16px;
      background-color: var(--semi-color-fill-1);
      border-radius: 50%;
    }

    .${p}-content {
      flex: 1;
      min-width: 0;
      padding-top: 4px;
    }

    .${p}-title {
      width: 40%;
      height: 16px;
      margin-bottom: 16px;
      background-color: var(--semi-color-fill-1);
      border-radius: 3px;
    }

    .${p}-row {
      height: 12px;
      margin-bottom: 12px;
      background-color: var(--semi-color-fill-1);
      border-radius: 3px;
    }

    .${p}-row:last-child {
      margin-bottom: 0;
    }

    .${p}-active .${p}-avatar,
    .${p}-active .${p}-title,
    .${p}-active .${p}-row {
      background-image: linear-gradient(
        90deg,
        var(--semi-color-fill-1) 25%,
        var(--semi-color-fill-2) 37%,
        var(--semi-color-fill-1) 63%
      );
      background-size: 400% 100%;
      animation: ${p}-shimmer 1.4s ease infinite;
    }

    @keyframes ${p}-shimmer {
      0% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0 50%;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-skeleton': SemiSkeleton
  }
}
