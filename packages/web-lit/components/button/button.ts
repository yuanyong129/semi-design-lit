import { CSSResultGroup, LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './style/button.style';
import { isString } from '../_utils/is';
import { ButtonTypes } from './constants';
import { BorderShape, Size, Status } from '../_utils/constant';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from "../_utils/global-config";
import { RenderContent } from '../_utils/types';
import { getChildElements, handleCustomSlot } from '../_utils/dom';
import { consume } from '@lit/context';
import { ButtonGroupContext, buttonGroupContext } from './context';
import { useFormItem } from '../_hooks/use-form-item';
import { useSize } from '../_hooks/use-size';

export const prefixCls = getPrefixCls('btn');

@customElement('a-button')
export class ArcoButton extends LitElement {
  /**
   * @zh 按钮的类型，分为五种：次要按钮、主要按钮、虚框按钮、线性按钮、文字按钮。
   * @en Button types are divided into five types: secondary, primary, dashed, outline and text.
   * @defaultValue 'secondary'
   */
  @property()
  type?: ButtonTypes;
  /**
   * @zh 按钮的形状
   * @en Button shape
   */
  @property()
  shape?: BorderShape;
  /**
   * @zh 按钮的状态
   * @en Button state
   * @values 'normal','warning','success','danger'
   * @defaultValue 'normal'
   */
  @property()
  status?: Status;
  /**
   * @zh 按钮的尺寸
   * @en Button size
   * @values 'mini','small','medium','large'
   * @defaultValue 'medium'
   */
  @property()
  size?: Size;
  /**
   * @zh 按钮的宽度是否随容器自适应。
   * @en Whether the width of the button adapts to the container.
   */
  @property({ type: Boolean })
  long: boolean = false;
  /**
   * @zh 按钮是否为加载中状态
   * @en Whether the button is in the loading state
   */
  @property({ type: Boolean })
  loading: boolean = false;
  /**
   * @zh 按钮是否禁用
   * @en Whether the button is disabled
   * @defaultValue false
   */
  @property({ type: Boolean })
  disabled: boolean = false;
  /**
   * @zh 设置 `button` 的原生 `type` 属性，可选值参考 [HTML标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type "_blank")
   * @en Set the native `type` attribute of `button`, optional values refer to [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type "_blank")
   */
  @property()
  htmlType: HTMLButtonElement['type'] = 'button';
  /**
   * @zh 设置 `button` 的原生 `autofocus` 属性，可选值参考 [HTML标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type "_blank")
   * @en Set the native `autofocus` attribute of `button`, optional values refer to [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type "_blank")
   */
  @property({ type: Boolean })
  autofocus: boolean = false;
  /**
   * @zh 设置跳转链接。设置此属性时，按钮渲染为a标签。
   * @en Set up a jump link. When this property is set, the button is rendered as `<a>`
   */
  @property()
  href?: string;

  /**
   * 记录当前元素在group中的位置，解决样式无法穿透，无法通过group设置btn样式的问题
   */
  @property()
  place?: string;

  @state()
  slots?: { icon?: RenderContent };

  _size () {
    return this.size ?? this.groupContext?.size;
  }

  _disabled() {
    return Boolean(this.disabled || this.groupContext?.disabled);
  }

  @state()
  _isOnlyIcon = false;

  @consume({ context: buttonGroupContext, subscribe: true })
  groupContext?: ButtonGroupContext;

  connectedCallback () {
    super.connectedCallback();
  }

  cls(size: Size, disabled: boolean) {
    return handleClsList([
      prefixCls,
      `${prefixCls}-${this.type ?? this.groupContext?.type ?? 'secondary'}`,
      `${prefixCls}-shape-${this.shape ?? this.groupContext?.shape ?? 'square'}`,
      `${prefixCls}-size-${size}`,
      `${prefixCls}-status-${this.status ?? this.groupContext?.status ?? 'normal'}`,
      this.long ? `${prefixCls}-long` : '',
      this.loading ? `${prefixCls}-loading`: '',
      disabled ? `${prefixCls}-disabled` : '',
      isString(this.href) ? `${prefixCls}-link` : '',
      this._isOnlyIcon ? `${prefixCls}-only-icon` : '',
      Boolean(this.groupContext) ? `is-group`: '',
      this.place ? `is-${this.place}` : '',
    ]);
  }

  handleClick (ev: MouseEvent) {
    ev.stopPropagation();
    if (this.disabled || this.loading) {
      ev.preventDefault();
      return;
    }
    this.dispatchEvent(new CustomEvent('click', ev));
  }

  render() {

    const hasChild = getChildElements(this.childNodes).length > 0;
    this._isOnlyIcon = Boolean(this.slots?.icon && !hasChild);

    const { mergedSize: _mergedSize, mergedDisabled } = useFormItem(this, {
      size: this._size(),
      disabled: this._disabled(),
    });

    const { mergedSize } = useSize(this, _mergedSize);

    return this.href
      ? html`
          <a class="${this.cls(mergedSize, mergedDisabled)}"
             href="${mergedDisabled || this.loading ? undefined : this.href }"
             @click=${this.handleClick}
             part="a-button">
             ${ this.loading || this.slots?.icon
                ? html`
                <span class="${prefixCls}-icon">
                  ${ this.loading 
                    ? html`<icon-loading spin></icon-loading>`
                    : html`${handleCustomSlot(this.slots?.icon)}` } 
                </span>` : ''}
            <slot></slot>
          </a>`
      : html`
          <button class="${this.cls(mergedSize, mergedDisabled)}"
                  type="${this.htmlType}"
                  .disabled=${mergedDisabled}
                  .autofocus=${this.autofocus}
                  @click=${this.handleClick}
                  part="a-button">
            ${this.loading || this.slots?.icon
                ? html`
                <span class="${prefixCls}-icon">
                  ${ this.loading 
                      ? html`<icon-loading spin></icon-loading>`
                      : html`${handleCustomSlot(this.slots?.icon)}` } 
                </span>` : ''}
            <slot></slot>
          </button>`;
  }

  static styles?: CSSResultGroup | undefined = styles; 
}

declare global {
  interface HTMLElementTagNameMap {
    'a-button': ArcoButton
  }
}
