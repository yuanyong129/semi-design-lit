import { html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from './style/avatar.style';
import { AvatarShape, AvatarSize } from './interface';

const SIZE_MAP: Record<AvatarSize, number> = {
  'extra-small': 24,
  small: 32,
  default: 40,
  medium: 48,
  large: 56,
  'extra-large': 64,
};

/**
 * Avatar for representing a user or entity.
 */
@customElement('semi-avatar')
export class SemiAvatar extends LitElement {
  /**
   * @zh 头像尺寸，支持内置尺寸或数字像素
   * @en Avatar size, accepts a preset or a pixel number
   * @values 'extra-small','small','default','medium','large','extra-large'
   * @defaultValue 'default'
   */
  @property()
  size: AvatarSize | number | string = 'default';

  /**
   * @zh 头像形状
   * @en Avatar shape
   * @values 'circle','square'
   * @defaultValue 'circle'
   */
  @property()
  shape: AvatarShape = 'circle';

  /**
   * @zh 背景颜色
   * @en Background color
   */
  @property()
  color?: string;

  /**
   * @zh 图片地址
   * @en Image source
   */
  @property()
  src?: string;

  /**
   * @zh 图片替代文本
   * @en Alternative text for the image
   */
  @property()
  alt = '';

  /**
   * @zh 无内容时的回退文字
   * @en Fallback text when there is no content
   */
  @property()
  fallback = '';

  @state()
  private _imageError = false;

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('src')) {
      this._imageError = false;
    }
  }

  private get _dimension(): number {
    if (typeof this.size === 'number') {
      return Math.max(16, this.size);
    }
    if (typeof this.size === 'string' && /^\d+(\.\d+)?$/.test(this.size)) {
      return Math.max(16, Number(this.size));
    }
    return SIZE_MAP[this.size as AvatarSize] ?? SIZE_MAP.default;
  }

  private get _sizeKey(): string | null {
    return typeof this.size === 'string' && !/^\d+(\.\d+)?$/.test(this.size)
      ? `semi-avatar-${this.size}`
      : null;
  }

  private _classes(): string {
    return [
      'semi-avatar',
      `semi-avatar-${this.shape}`,
      this._sizeKey ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private _style() {
    const dimension = this._dimension;
    return {
      width: `${dimension}px`,
      height: `${dimension}px`,
      'font-size': `${Math.max(11, Math.round(dimension * 0.4))}px`,
      ...(this.color ? { 'background-color': this.color } : {}),
    };
  }

  private _handleError = () => {
    this._imageError = true;
  };

  protected render() {
    const showImage = Boolean(this.src) && !this._imageError;
    return html`
      <span
        class="${this._classes()}"
        style=${styleMap(this._style())}
        part="avatar"
        role=${this.src ? 'img' : nothing}
        aria-label=${this.alt || nothing}
      >
        ${showImage
          ? html`<img
              class="semi-avatar-image"
              src=${this.src}
              alt=${this.alt}
              @error=${this._handleError}
            />`
          : html`<slot>${this.fallback}</slot>`}
      </span>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-avatar': SemiAvatar;
  }
}
