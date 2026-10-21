import { CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContextProvider } from "@lit/context";
import { ButtonTheme, ButtonTypes } from "./constants";
import { Size } from "../_utils/constant";
import { buttonGroupContext, ButtonGroupContext } from "./context";
import { groupStyles } from "./style/button.style";

@customElement('semi-button-group')
export class SemiButtonGroup extends LitElement {
  /**
   * @zh 按钮组内按钮的类型
   * @en Type of the buttons in the group
   */
  @property()
  type?: ButtonTypes;

  /**
   * @zh 按钮组内按钮的主题
   * @en Theme of the buttons in the group
   */
  @property()
  theme?: ButtonTheme;

  /**
   * @zh 按钮组内按钮的尺寸
   * @en Size of the buttons in the group
   */
  @property()
  size?: Size;

  /**
   * @zh 是否禁用组内所有按钮
   * @en Whether all buttons in the group are disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 按钮组宽度是否撑满父容器
   * @en Whether the group fills the width of its container
   */
  @property({ type: Boolean })
  block: boolean = false;

  private _provider = new ContextProvider(this, {
    context: buttonGroupContext,
    initialValue: { disabled: false } as ButtonGroupContext,
  });

  private _syncContext() {
    this._provider.setValue({
      type: this.type,
      theme: this.theme,
      size: this.size,
      disabled: this.disabled,
    });
  }

  private _syncPlaces() {
    const buttons = Array.from(this.querySelectorAll(':scope > semi-button'));
    buttons.forEach((button, index) => {
      const element = button as HTMLElement & { place?: string; block?: boolean };
      element.block = this.block;
      if (buttons.length === 1) {
        element.place = undefined;
      } else if (index === 0) {
        element.place = 'first';
      } else if (index === buttons.length - 1) {
        element.place = 'last';
      } else {
        element.place = 'middle';
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncContext();
    this.addEventListener('slotchange', this._syncPlaces);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('slotchange', this._syncPlaces);
  }

  protected updated() {
    this._syncContext();
    this._syncPlaces();
  }

  render() {
    return html`
      <div class="semi-button-group ${this.block ? 'semi-button-group-block' : ''}" part="button-group">
        <slot></slot>
      </div>
    `;
  }

  static styles?: CSSResultGroup | undefined = groupStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-button-group': SemiButtonGroup
  }
}
