import { CSSResultGroup, LitElement, html, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './style/button.style';
import { isString } from '../_utils/is';
import { ButtonTheme, ButtonTypes } from './constants';
import { Size } from '../_utils/constant';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { consume } from '@lit/context';
import { ButtonGroupContext, buttonGroupContext } from './context';
import { useFormItem } from '../_hooks/use-form-item';
import { useSize } from '../_hooks/use-size';
import '../../../semi-icons/build/loading';

export const prefixCls = getPrefixCls('button');

@customElement('semi-button')
export class SemiButton extends LitElement {
  /**
   * @zh 按钮类型：主要、次要、第三、警告、危险
   * @en Button type: primary, secondary, tertiary, warning, danger
   * @defaultValue 'primary'
   */
  @property()
  type?: ButtonTypes;

  /**
   * @zh 按钮主题：实心、无边框、浅色、描边
   * @en Button theme: solid, borderless, light, outline
   * @defaultValue 'light'
   */
  @property()
  theme?: ButtonTheme;

  /**
   * @zh 按钮尺寸
   * @en Button size
   * @values 'small','default','large'
   * @defaultValue 'default'
   */
  @property()
  size?: Size;

  /**
   * @zh 按钮宽度是否撑满父容器
   * @en Whether the button fills the width of its container
   */
  @property({ type: Boolean })
  block: boolean = false;

  /**
   * @zh 是否为加载中状态
   * @en Whether the button is loading
   */
  @property({ type: Boolean })
  loading: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the button is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 原生 button 的 type 属性
   * @en Native `type` attribute of the button
   */
  @property({ attribute: 'html-type' })
  htmlType: HTMLButtonElement['type'] = 'button';

  /**
   * @zh 是否自动聚焦
   * @en Whether to focus the button automatically
   */
  @property({ type: Boolean })
  autofocus: boolean = false;

  /**
   * @zh 跳转链接。设置后按钮渲染为 `<a>`
   * @en Jump link. Renders an `<a>` when set
   */
  @property()
  href?: string;

  /**
   * @zh a 标签的 target 属性
   * @en Native `target` attribute of the anchor
   */
  @property()
  target?: string;

  /**
   * @zh 图标，也可以使用 `slot="icon"`
   * @en Icon, `slot="icon"` is also supported
   */
  @property({ attribute: false })
  icon?: TemplateResult;

  /**
   * @zh 图标位置
   * @en Icon position
   */
  @property({ attribute: 'icon-position' })
  iconPosition: 'left' | 'right' = 'left';

  /**
   * @zh 按钮在按钮组中的位置，由 semi-button-group 自动设置
   * @en Position inside a button group, set by semi-button-group
   */
  @property()
  place?: 'first' | 'middle' | 'last';

  @consume({ context: buttonGroupContext, subscribe: true })
  groupContext?: ButtonGroupContext;

  private get _size(): Size | undefined {
    return this.size ?? this.groupContext?.size;
  }

  private get _disabled(): boolean {
    return Boolean(this.disabled || this.groupContext?.disabled);
  }

  private get _type(): ButtonTypes {
    return this.type ?? this.groupContext?.type ?? 'primary';
  }

  private get _theme(): ButtonTheme {
    return this.theme ?? this.groupContext?.theme ?? 'light';
  }

  private get _hasIconSlot(): boolean {
    return Boolean(this.querySelector(':scope > [slot="icon"]'));
  }

  private get _hasText(): boolean {
    return Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return Boolean(node.textContent?.trim());
      }
      return node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') !== 'icon';
    });
  }

  cls(size: Size, disabled: boolean, hasIcon: boolean): string {
    const iconOnly = hasIcon && !this._hasText;
    return handleClsList([
      prefixCls,
      `${prefixCls}-${this._type}`,
      `${prefixCls}-${this._theme}`,
      `${prefixCls}-size-${size}`,
      this.block ? `${prefixCls}-block` : '',
      this.loading ? `${prefixCls}-loading` : '',
      disabled ? `${prefixCls}-disabled` : '',
      isString(this.href) ? `${prefixCls}-link` : '',
      hasIcon ? `${prefixCls}-with-icon` : '',
      iconOnly ? `${prefixCls}-icon-only` : '',
      Boolean(this.groupContext) ? `${prefixCls}-in-group` : '',
      this.place ? `${prefixCls}-group-${this.place}` : '',
    ]);
  }

  handleClick(ev: MouseEvent) {
    if (this._disabled || this.loading) {
      ev.preventDefault();
    }
  }

  private renderIcon(hasIcon: boolean) {
    if (!hasIcon) return nothing;
    return html`
      <span class="${prefixCls}-icon">
        ${this.loading
          ? html`<semi-icon-loading spin></semi-icon-loading>`
          : this.icon
            ? this.icon
            : html`<slot name="icon"></slot>`}
      </span>
    `;
  }

  render() {
    const { mergedSize: formSize, mergedDisabled } = useFormItem(this, {
      size: this._size,
      disabled: this._disabled,
    });
    const { mergedSize } = useSize(this, formSize);

    const hasIcon = Boolean(this.icon || this._hasIconSlot || this.loading);
    const className = this.cls(mergedSize, mergedDisabled, hasIcon);
    const content = html`<span class="${prefixCls}-content"><slot></slot></span>`;
    const children = this.iconPosition === 'right'
      ? html`${content}${this.renderIcon(hasIcon)}`
      : html`${this.renderIcon(hasIcon)}${content}`;

    if (isString(this.href)) {
      return html`
        <a
          class="${className}"
          href="${mergedDisabled || this.loading ? undefined : this.href}"
          target="${this.target ?? nothing}"
          part="button"
          @click=${this.handleClick}
        >${children}</a>
      `;
    }

    return html`
      <button
        class="${className}"
        type="${this.htmlType}"
        .disabled=${mergedDisabled}
        .autofocus=${this.autofocus}
        part="button"
        @click=${this.handleClick}
      >${children}</button>
    `;
  }

  static styles?: CSSResultGroup | undefined = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-button': SemiButton
  }
}
