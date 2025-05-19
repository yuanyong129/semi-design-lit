import { CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ButtonTypes } from "./constants";
import { BorderShape, Size, Status } from "../_utils/constant";
import { getPrefixCls } from '../_utils/global-config';
import { buttonGroupContext, ButtonGroupContext } from "./context";
import { provide } from "@lit/context";
import { groupStyles } from "./style/button.style";

const prefixCls = getPrefixCls('btn-group');

@customElement('a-button-group')
export class ArcoButtonGroup extends LitElement {

  /**
   * @zh 按钮的类型，分为五种：次要按钮、主要按钮、虚框按钮、线性按钮、文字按钮。
   * @en Children button types are divided into five types: secondary, primary, dashed, outline and text.
   */
  @property()
  type?: ButtonTypes;
  /**
   * @zh 按钮的状态
   * @en Children button state
   * @values 'normal','warning','success','danger'
   */
  @property()
  status?: Status;
  /**
   * @zh 按钮的形状
   * @en Button shape
   */
  @property()
  shape?: BorderShape;
  /**
   * @zh 按钮的尺寸
   * @en Children button size
   * @values 'mini','small','medium','large'
   */
  @property()
  size?: Size;
  /**
   * @zh 全部子按钮是否禁用
   * @en All children whether the button is disabled
   */
  @property({ type: Boolean })
  disabled?: boolean;

  @provide({ context: buttonGroupContext })
  @state()
  _context = {} as ButtonGroupContext;

  render() {

    this._context = {
      type: this.type,
      size: this.size,
      shape: this.shape,
      status: this.status,
      disabled: this.disabled ?? false,
    }

    return html`
      <div class="${prefixCls}" part="a-btn-group">
        ${ Array.from(this.children).filter(child => child.tagName === 'A-BUTTON').map((child, index) => {
          if(index === 0) child.setAttribute("place", "first")
          if(index + 1 === this.children.length) child.setAttribute("place", "last")
          return html`${child}`
        }) }
      </div>`;
  }

  static styles = groupStyles;

}

declare global {
  interface HTMLElementTagNameMap {
    'a-button-group': ArcoButtonGroup
  }
}
