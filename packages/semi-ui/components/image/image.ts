import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { StyleInfo } from 'lit/directives/style-map.js';
import { lockBodyScroll, unlockBodyScroll } from '../_utils/overlay';
import { imageStyles } from './style/image.style';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/plus';
import '../../../semi-icons/build/minus';
import '../../../semi-icons/build/close-circle';

function toSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

@customElement('semi-image')
export class SemiImage extends LitElement {
  /**
   * @zh 图片地址
   * @en Image source
   */
  @property()
  src = '';

  /**
   * @zh 图片描述
   * @en Alternative text
   */
  @property()
  alt = '';

  /**
   * @zh 宽度
   * @en Width
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === '') return value;
        const numeric = Number(value);
        return Number.isNaN(numeric) ? value : numeric;
      },
      toAttribute: (value: number | string) => String(value),
    },
  })
  width?: number | string;

  /**
   * @zh 高度
   * @en Height
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === '') return value;
        const numeric = Number(value);
        return Number.isNaN(numeric) ? value : numeric;
      },
      toAttribute: (value: number | string) => String(value),
    },
  })
  height?: number | string;

  /**
   * @zh 图片填充方式
   * @en Object fit
   * @defaultValue 'cover'
   */
  @property()
  fit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';

  /**
   * @zh 是否开启点击预览
   * @en Whether clicking opens a preview
   */
  @property({ type: Boolean })
  preview = true;

  /**
   * @zh 加载失败时的替代图片
   * @en Image shown when loading fails
   */
  @property()
  fallback?: string;

  /**
   * @zh 预览遮罩文案
   * @en Preview mask text
   */
  @property({ attribute: 'preview-mask' })
  previewMask = '预览';

  /**
   * @zh 图片圆角
   * @en Border radius
   */
  @property({
    attribute: 'border-radius',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === '') return value;
        const numeric = Number(value);
        return Number.isNaN(numeric) ? value : numeric;
      },
      toAttribute: (value: number | string) => String(value),
    },
  })
  borderRadius?: number | string;

  @state()
  private _loaded = false;

  @state()
  private _error = false;

  @state()
  private _fallbackActive = false;

  @state()
  private _previewVisible = false;

  @state()
  private _scale = 1;

  @state()
  private _rotate = 0;

  @query('.semi-image-preview-close')
  private _closeButton?: HTMLButtonElement;

  private _lastFocused: HTMLElement | null = null;
  private _locked = false;

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('src')) {
      this._loaded = false;
      this._error = false;
      this._fallbackActive = false;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._releaseLock();
  }

  private _releaseLock(): void {
    if (this._locked) {
      unlockBodyScroll();
      this._locked = false;
    }
  }

  private _openPreview = (): void => {
    if (!this.preview || this._error) return;
    this._lastFocused = (this.getRootNode() as ShadowRoot).activeElement as HTMLElement | null;
    lockBodyScroll();
    this._locked = true;
    this._scale = 1;
    this._rotate = 0;
    this._previewVisible = true;
    this.updateComplete.then(() => this._closeButton?.focus());
  };

  private _closePreview = (): void => {
    if (!this._previewVisible) return;
    this._previewVisible = false;
    this._releaseLock();
    this._lastFocused?.focus?.();
    this._lastFocused = null;
  };

  private _handlePreviewClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) this._closePreview();
  };

  private _handlePreviewKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._closePreview();
    }
  };

  private _zoom(delta: number): void {
    this._scale = Math.min(3, Math.max(0.5, Number((this._scale + delta).toFixed(2))));
  }

  private _rotateImage = (): void => {
    this._rotate = (this._rotate + 90) % 360;
  };

  private _containerStyle(): StyleInfo {
    const radius = toSize(this.borderRadius);
    return {
      width: toSize(this.width),
      height: toSize(this.height),
      borderRadius: radius,
    };
  }

  private _handleImageLoad = (): void => {
    this._loaded = true;
    if (!this._fallbackActive) this._error = false;
  };

  private _handleImageError = (): void => {
    if (this.fallback && !this._fallbackActive) {
      this._fallbackActive = true;
      this._error = true;
      this._loaded = false;
      return;
    }
    this._error = true;
    this._loaded = false;
  };

  protected render() {
    const image = this._fallbackActive && this.fallback ? this.fallback : this.src;
    return html`
      <div class="semi-image-wrapper" part="wrapper">
        <div
          class="semi-image ${this._loaded ? 'semi-image-loaded' : ''} ${this._error ? 'semi-image-error' : ''}"
          style=${styleMap(this._containerStyle())}
          part="image"
          @click=${this._openPreview}
        >
          ${image && !(this._error && !this.fallback)
            ? html`<img
                class="semi-image-img"
                src=${image}
                alt=${this.alt}
                style=${styleMap({ objectFit: this.fit })}
                @load=${this._handleImageLoad}
                @error=${this._handleImageError}
              />`
            : nothing}
          ${(this.src || this.fallback) && !this._loaded && (!this._error || this._fallbackActive)
            ? html`<div class="semi-image-placeholder" aria-hidden="true"></div>`
            : nothing}
          ${this._error && !this.fallback
            ? html`
                <div class="semi-image-fallback">
                  <semi-icon-close-circle></semi-icon-close-circle>
                  <span>图片加载失败</span>
                </div>
              `
            : nothing}
          ${this.preview && !this._error
            ? html`<div class="semi-image-mask"><span>${this.previewMask}</span></div>`
            : nothing}
        </div>
      </div>
      ${this._previewVisible
        ? html`
            <div
              class="semi-image-preview"
              role="dialog"
              aria-modal="true"
              aria-label="图片预览"
              tabindex="-1"
              @click=${this._handlePreviewClick}
              @keydown=${this._handlePreviewKeydown}
            >
              <div class="semi-image-preview-content">
                <img
                  class="semi-image-preview-img"
                  src=${this.src}
                  alt=${this.alt}
                  style=${styleMap({
                    transform: `scale(${this._scale}) rotate(${this._rotate}deg)`,
                  })}
                />
              </div>
              <div class="semi-image-preview-toolbar" @click=${(event: Event) => event.stopPropagation()}>
                <button type="button" class="semi-image-preview-btn" aria-label="缩小" @click=${() => this._zoom(-0.25)}>
                  <semi-icon-minus></semi-icon-minus>
                </button>
                <span class="semi-image-preview-scale">${Math.round(this._scale * 100)}%</span>
                <button type="button" class="semi-image-preview-btn" aria-label="放大" @click=${() => this._zoom(0.25)}>
                  <semi-icon-plus></semi-icon-plus>
                </button>
                <button type="button" class="semi-image-preview-btn" aria-label="旋转" @click=${this._rotateImage}>
                  <span aria-hidden="true">↻</span>
                </button>
                <button
                  type="button"
                  class="semi-image-preview-btn semi-image-preview-close"
                  aria-label="关闭预览"
                  @click=${this._closePreview}
                >
                  <semi-icon-close></semi-icon-close>
                </button>
              </div>
            </div>
          `
        : nothing}
    `;
  }

  static styles = imageStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-image': SemiImage;
  }
}
