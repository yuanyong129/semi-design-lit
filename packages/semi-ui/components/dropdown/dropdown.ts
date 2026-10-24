import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TriggerAlign, TriggerPosition, TriggerType } from '../trigger/trigger';
import { DropdownOption } from './interface';
import '../trigger/trigger';
import './dropdown-menu';

@customElement('semi-dropdown')
export class SemiDropdown extends LitElement {
  /**
   * @zh 菜单项
   * @en Menu options
   */
  @property({ attribute: false })
  options: DropdownOption[] = [];

  /**
   * @zh 触发方式
   * @en Trigger mode
   */
  @property()
  trigger: TriggerType = 'click';

  /**
   * @zh 出现位置
   * @en Position
   */
  @property()
  position: TriggerPosition = 'bottom';

  /**
   * @zh 对齐方式
   * @en Alignment
   */
  @property()
  align: TriggerAlign = 'start';

  /**
   * @zh 默认是否显示
   * @en Whether the dropdown is open by default
   */
  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  /**
   * @zh 是否禁用
   * @en Whether the dropdown is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 选择后是否关闭
   * @en Whether to close after selection
   */
  @property({ attribute: 'close-on-select', type: Boolean })
  closeOnSelect: boolean = true;

  private _handleSelect(event: CustomEvent<{ value: string | number; option: DropdownOption }>) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: event.detail,
      bubbles: true,
      composed: true,
    }));
    if (this.closeOnSelect) {
      (this.shadowRoot?.querySelector('semi-trigger') as any)?.hide();
    }
  }

  private _renderMenu() {
    return html`
      <semi-dropdown-menu .options=${this.options} @select=${(event: CustomEvent) => this._handleSelect(event)}></semi-dropdown-menu>
    `;
  }

  render() {
    return html`
      <semi-trigger
        .trigger=${this.trigger}
        .position=${this.position}
        .align=${this.align}
        .content=${this._renderMenu()}
        .defaultOpen=${this.defaultOpen}
        .disabled=${this.disabled}
        popup-role="menu"
      >
        <slot></slot>
      </semi-trigger>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-dropdown': SemiDropdown
  }
}
