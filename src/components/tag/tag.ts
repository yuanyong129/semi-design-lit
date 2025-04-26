import { html, LitElement, nothing } from "lit";
import { tagPrefixCls, styles } from './style/tag.style';
import { iconStyles } from "../../style/theme/icon";
import { customElement, property, state } from "lit/decorators.js";
import { TAG_COLORS, TagColor } from "./interface";
import { handleClsList } from "../_utils/web-utils";
import { when } from "lit/directives/when.js";
import { styleMap } from "lit/directives/style-map.js";
import { querySlots } from "../_utils/dom";
import "../../icon/build/loading";
import "../_components/icon-hover";
import { consume } from "@lit/context";
import { ConfigProvider, configProviderContext } from "../config-provider/context";
import { useSize } from "../_hooks/use-size";

@customElement('a-tag')
export class ArcoTag extends LitElement {
   /**
     * @zh 标签的颜色
     * @en Label color
     * @values 'red','orangered','orange','gold','lime','green','cyan','blue','arcoblue','purple','pinkpurple','magenta','gray'
     */
  @property()
  color?: TagColor | string;
  /**
   * @zh 标签的大小
   * @en Label size
   * @values 'small','medium','large'
   * @defaultValue 'medium'
   */
  @property()
  size?: 'small' | 'medium' | 'large';
  /**
   * @zh 是否显示边框
   * @en Whether the tag is bordered
   */
  @property({ type: Boolean })
  bordered?: boolean = false;
  /**
   * @zh 标签默认是否可见
   * @en Whether the tag is visible by default
   */
  @property({ type: Boolean })
  defaultVisible?: boolean = true;
  /**
   * @zh 标签是否为加载中状态
   * @en Whether the tag is loading state
   */
  @property({ type: Boolean })
  loading?: boolean = false;
  /**
   * @zh 标签是否可关闭
   * @en Whether the tag can be closed
   */
  @property({ type: Boolean })
  closable?: boolean = false;
  /**
   * @zh 标签是否可选中
   * @en Whether the tag can be checked
   */
  @property({ type: Boolean })
  checkable?: boolean = false;
  /**
   * @zh 标签默认选中状态（标签可选中时可用）
   * @en Whether the tag is checked by default (available when the tag is checkable)
   */
  @property({ type: Boolean })
  defaultChecked?: boolean = true;
  /**
   * @zh 标签内容不换行
   * @en Tag content does not wrap
   */
  @property({ type: Boolean })
  nowrap?: boolean = false;

  @state()
  _isCustomColor?: boolean = false;
  /**
   * @zh 标签是否可见
   * @en Whether the tag is visible
   */
  @state()
  _visible?: boolean;
  /**
   * @zh 标签是否选中（标签可选中时可用）
   * @en Whether the tag is checked (available when the tag is checkable)
   */
  @state()
  _checked?: boolean;
  @state()
  _isBuiltInColor?: boolean;
  _rtl?: boolean; 
  _mergedSize?: string = 'medium';


  @querySlots()
  slots!: Record<string, Element> 

  @consume({ context: configProviderContext })
  _configContext?: ConfigProvider;

  cls() {
    return handleClsList(
      [
        tagPrefixCls,
        `${tagPrefixCls}-size-${this._mergedSize}`,
        this.loading ? `${tagPrefixCls}-loading` : '',
        !this._visible ? `${tagPrefixCls}-hide` : '',
        this._isBuiltInColor ? `${tagPrefixCls}-${this.color}` : '',
        this.bordered ? `${tagPrefixCls}-bordered` : '',
        this.checkable ? `${tagPrefixCls}-checkable` : '',
        this._checked ? `${tagPrefixCls}-checked` : '',
        this._isCustomColor ? `${tagPrefixCls}-custom-color` : '',
        this._rtl ? `${tagPrefixCls}-rtl` : '',
      ]
    );
  }

  tagStyle () {
    if (this._isCustomColor) {
      return styleMap({
        backgroundColor: this.color,
      });
    }
    return undefined;
  }

  handleClose(ev: MouseEvent) {
    this._visible = false;
    this.dispatchEvent(new CustomEvent('close', { ...ev, detail: { value: false }}));
  }

  handleClick(ev: MouseEvent) {
    if (this.checkable) {
      const newChecked = !this._checked;
      this._checked = newChecked;
      this.dispatchEvent(new CustomEvent('check', { ...ev, detail: { value: newChecked }}));
    }
    // ev.stopPropagation();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._visible = this.defaultVisible;
    this._checked = this.defaultChecked;
    const { mergedSize } = useSize(this, this.size);
    this._mergedSize = mergedSize === 'mini' ? 'small' : mergedSize;
    this._rtl = false;
  }

  protected render() {

    this._isCustomColor = Boolean(this.color && !TAG_COLORS.includes(this.color as any));
    this._isBuiltInColor = Boolean(this.color && TAG_COLORS.includes(this.color as any));

    return this._visible ? html`
      <span class="${this.cls()}" style="${this.tagStyle()}" @click="${this.handleClick}">
        ${when(this.slots.icon, () => html`
            <span class="${tagPrefixCls}-icon">
              <slot name="icon"></slot>
            </span>
          `, () => nothing)}
        ${when(this.nowrap, () => html`<span class="${tagPrefixCls}-text"><slot></slot></span>`, () => html`<slot></slot>`)}
        ${this.closable ? html`
            <icon-hover
              role="button"
              aria-label="Close"
              _prefix="${tagPrefixCls}"
              class="${tagPrefixCls}-close-btn"
              @click="${this.handleClose}"
            >
              <slot name="close-icon">
                <icon-close></icon-close>
              </slot>
            </icon-hover>` : nothing}
        ${this.loading
            ? html`<span class="${tagPrefixCls}-loading-icon"><icon-loading></icon-loading></span>`
            : nothing}
      </span>
    ` : nothing;
  }

  static styles = [iconStyles, styles];
}
 
declare global {
  interface HTMLElementTagNameMap {
    'a-tag': ArcoTag
  }
}
