import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './style/index.less?inline';
import { Size } from '../_utils/constant';
import { getPrefixCls } from '../_utils/global-config';
import { useSize } from '../_hooks/use-size';
import { handleClsList } from '../_utils/web-utils';
import { classMap } from 'lit/directives/class-map.js';

const prefixCls = getPrefixCls('input');


@customElement('a-input')
export class ArcoInput extends LitElement {

  /**
   * @zh 绑定值
   * @en Value
   */
  @property()
  value?: string;
  /**
   * @zh 默认值（非受控状态）
   * @en Default value (uncontrolled state)
   */
  @property()
  defaultValue?: string = '';
  /**
   * @zh 输入框大小
   * @en Input size
   * @values 'mini','small','medium','large'
   * @defaultValue 'medium'
   */
  @property()
  size?: Size;
  /**
   * @zh 是否允许清空输入框
   * @en Whether to allow the input to be cleared
   */
  @property()
  allowClear?: boolean = false;
  /**
   * @zh 是否禁用
   * @en Whether to disable
   */
  @property()
  disabled?: boolean = false;
  /**
   * @zh 是否为只读状态
   * @en Whether it is read-only
   */
  @property()
  readonly?: boolean = false;
  /**
   * @zh 是否为错误状态
   * @en Whether it is an error state
   */
  @property()
  error?: boolean = false;
  /**
   * @zh 提示文字
   * @en Prompt text
   */
  @property()
  placeholder?: string;
  /**
   * @zh 输入值的最大长度，errorOnly 属性在 2.12.0 版本添加
   * @en Enter the maximum length of the value, the errorOnly attribute was added in version 2.12.0
   */
  @property()
  maxLength?: number | { length: number; errorOnly?: boolean } = 0;
  /**
   * @zh 是否显示字数统计
   * @en Whether to display word count
   */
  @property()
  showWordLimit?: boolean = false;
  /**
   * @zh 字符长度的计算方法
   * @en Calculation method of word length
   */
  @property()
  wordLength?: (value: string) => number;
  /**
   * @zh 字符截取方法，同 wordLength 一起使用
   * @en Character interception method, used together with wordLength
   */
  @property()
  wordSlice?: (value: string, maxLength: number) => string;
  /**
   * @zh 内部 input 元素的属性
   * @en Attributes of inner input elements
   */
  @property()
  inputAttrs?: object;
  // private
  @property()
  type: 'text' | 'password' = 'text';
  /**
   * @zh 前置标签
   * @en Prepend
   */
  @property()
  prependSlot?: string;
  /**
   * @zh 后置标签
   * @en Append
   */
  @property()
  appendSlot?: string;


  @state()
  _mergedSize?: Size;

  outerCls = () => handleClsList([
    `${prefixCls}-outer`,
    `${prefixCls}-outer-size-${this._mergedSize}`,
    classMap({
      [`${prefixCls}-outer-has-suffix`]: Boolean(this.appendSlot),
      // [`${prefixCls}-outer-disabled`]: mergedDisabled.value,
    }).toString(),
  ]);

  wrapperCls = () => handleClsList([
    `${prefixCls}-wrapper`,
    // {
    //   [`${prefixCls}-error`]: mergedError.value,
    //   [`${prefixCls}-disabled`]: mergedDisabled.value,
    //   [`${prefixCls}-focus`]: focused.value,
    // },
  ]);

  cls = () => handleClsList([
    prefixCls,
    `${prefixCls}-size-${this._mergedSize}`,
  ]);

  renderInput () {
    return html`
      <span class="${this.wrapperCls()}">
        <input class="${this.cls()}" placeholder="${this.placeholder}" />
      </span>
    `
  }

  protected render() {
    const { mergedSize } = useSize(this, this.size);
    this._mergedSize = mergedSize;

    if(this.prependSlot || this.appendSlot) {
      return html`
        <div class="${this.outerCls()}">
          ${this.prependSlot ? html`<span class="${prefixCls}-prepend">${this.prependSlot}</span>` : null}
          ${this.renderInput()}
          ${this.appendSlot ? html`<span class="${prefixCls}-append">${this.appendSlot}</span>` : null}
        </div>
      `;
    }

    return this.renderInput();
  }

  static styles = css`${unsafeCSS(styles)}`;
}

declare global {
  interface HTMLElementTagNameMap {
    'a-input': ArcoInput
  }
}
