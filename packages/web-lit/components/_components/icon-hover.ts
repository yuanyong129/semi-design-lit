import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getPrefixCls } from "../_utils/global-config";
import { handleClsList } from "../_utils/web-utils";
import { Size } from "../_utils/constant";

const prefixCls = getPrefixCls('icon-hover');

@customElement('icon-hover')
export class IconHover extends LitElement {

  @property()
  _prefix?: string;

  @property()
  size: Size = 'medium';

  @property({ type: Boolean })
  disabled?: boolean = false;

  cls() {
    return handleClsList([
      prefixCls,
      this._prefix ? `${this._prefix}-icon-hover` : '',
      this.size !== 'medium' ? `${prefixCls}-size-${this.size}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
    ])
  }

  protected render() {
    this.cls().split(' ').forEach(item => { this.classList.add(item) });
    return html``;  
  }

  protected createRenderRoot() {
    return this;
  } 

}
