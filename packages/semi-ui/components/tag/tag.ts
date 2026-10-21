import { html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { tagPrefixCls, styles } from './style/tag.style';
import { TAG_COLORS, TagColor, TagShape, TagSize, TagType } from "./interface";
import { handleClsList } from "../_utils/web-utils";
import "../../../semi-icons/build/close";

@customElement('semi-tag')
export class SemiTag extends LitElement {
  /**
   * @zh 标签颜色，支持内置色板与自定义颜色
   * @en Tag color, supports built-in palette and custom colors
   * @values 'amber','blue','cyan','green','grey','indigo','light-blue','light-green','lime','orange','pink','purple','red','teal','violet','yellow','white'
   */
  @property()
  color: TagColor | string = 'grey';

  /**
   * @zh 标签尺寸
   * @en Tag size
   * @values 'small','default','large'
   * @defaultValue 'default'
   */
  @property()
  size: TagSize = 'default';

  /**
   * @zh 标签类型
   * @en Tag type
   * @values 'ghost','solid','light'
   * @defaultValue 'light'
   */
  @property()
  type: TagType = 'light';

  /**
   * @zh 标签形状
   * @en Tag shape
   * @values 'square','circle'
   * @defaultValue 'square'
   */
  @property()
  shape: TagShape = 'square';

  /**
   * @zh 是否可关闭
   * @en Whether the tag is closable
   */
  @property({ type: Boolean })
  closable: boolean = false;

  /**
   * @zh 是否可见（受控）
   * @en Whether the tag is visible (controlled)
   */
  @property({ type: Boolean })
  visible?: boolean;

  /**
   * @zh 前缀图标
   * @en Prefix icon
   */
  @property({ attribute: false })
  prefixIcon?: TemplateResult;

  /**
   * @zh 后缀图标
   * @en Suffix icon
   */
  @property({ attribute: false })
  suffixIcon?: TemplateResult;

  @state()
  private _visible: boolean = true;

  connectedCallback() {
    super.connectedCallback();
    this._visible = this.visible ?? true;
  }

  private get _isBuiltInColor(): boolean {
    return Boolean(this.color && (TAG_COLORS as readonly string[]).includes(this.color));
  }

  private get _isCustomColor(): boolean {
    return Boolean(this.color && !this._isBuiltInColor);
  }

  private _cls(): string {
    return handleClsList([
      tagPrefixCls,
      `${tagPrefixCls}-${this.size}`,
      `${tagPrefixCls}-${this.type}`,
      `${tagPrefixCls}-${this.shape}`,
      this._isBuiltInColor ? `${tagPrefixCls}-${this.color}` : '',
      this._isBuiltInColor ? `${tagPrefixCls}-${this.color}-${this.type}` : '',
      this._isCustomColor ? `${tagPrefixCls}-custom` : '',
      this.closable ? `${tagPrefixCls}-closable` : '',
      !this._isVisible ? `${tagPrefixCls}-hidden` : '',
    ]);
  }

  private get _isVisible(): boolean {
    return this.visible ?? this._visible;
  }

  private _style() {
    if (this._isCustomColor) {
      return styleMap({
        'background-color': this.color,
        'border-color': this.color,
        color: 'var(--semi-color-white)',
      });
    }
    return undefined;
  }

  private handleClose(ev: MouseEvent) {
    ev.stopPropagation();
    if (this.visible === undefined) {
      this._visible = false;
    }
    this.dispatchEvent(new CustomEvent('close', {
      detail: { value: false },
      bubbles: true,
      composed: true,
    }));
  }

  private _hasPrefix(): boolean {
    return Boolean(this.prefixIcon || this.querySelector(':scope > [slot="prefix-icon"]'));
  }

  private _hasSuffix(): boolean {
    return Boolean(this.suffixIcon || this.querySelector(':scope > [slot="suffix-icon"]'));
  }

  render() {
    if (!this._isVisible) return nothing;

    return html`
      <span class="${this._cls()}" style="${this._style()}" part="tag">
        ${this._hasPrefix()
          ? html`<span class="${tagPrefixCls}-prefix-icon">
              <slot name="prefix-icon">${this.prefixIcon}</slot>
            </span>`
          : nothing}
        <span class="${tagPrefixCls}-content"><slot></slot></span>
        ${this._hasSuffix()
          ? html`<span class="${tagPrefixCls}-suffix-icon">
              <slot name="suffix-icon">${this.suffixIcon}</slot>
            </span>`
          : nothing}
        ${this.closable
          ? html`<span class="${tagPrefixCls}-close" role="button" aria-label="Close" @click=${this.handleClose}>
              <semi-icon-close></semi-icon-close>
            </span>`
          : nothing}
      </span>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tag': SemiTag
  }
}
