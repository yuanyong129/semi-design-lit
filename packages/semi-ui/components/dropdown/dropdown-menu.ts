import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DropdownOption } from './interface';

@customElement('semi-dropdown-menu')
export class SemiDropdownMenu extends LitElement {
  @property({ attribute: false })
  options: DropdownOption[] = [];

  private _handleClick(option: DropdownOption, event: MouseEvent) {
    if (option.disabled) return;
    this.dispatchEvent(new CustomEvent('select', {
      detail: { value: option.value, option, event },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="semi-dropdown-menu" role="menu" part="menu">
        ${this.options.map((option) => option.divider
          ? html`<div class="semi-dropdown-divider" role="separator"></div>`
          : html`
              <div
                class="semi-dropdown-item ${option.disabled ? 'semi-dropdown-item-disabled' : ''}"
                role="menuitem"
                aria-disabled=${option.disabled ? 'true' : nothing}
                @click=${(event: MouseEvent) => this._handleClick(option, event)}
              >
                ${option.icon ? html`<span class="semi-dropdown-icon">${option.icon}</span>` : nothing}
                <span class="semi-dropdown-label">${option.label}</span>
              </div>
            `)}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-width: 160px;
    }

    .semi-dropdown-menu {
      padding: 4px;
      background-color: var(--semi-color-bg-2);
      border-radius: var(--semi-border-radius-medium, 6px);
    }

    .semi-dropdown-item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 20px;
      border-radius: var(--semi-border-radius-small, 3px);
      cursor: pointer;
      user-select: none;
    }

    .semi-dropdown-item:hover {
      background-color: var(--semi-color-fill-0);
    }

    .semi-dropdown-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .semi-dropdown-icon {
      display: inline-flex;
      margin-right: 8px;
      color: var(--semi-color-text-2);
    }

    .semi-dropdown-divider {
      height: 1px;
      margin: 4px 0;
      background-color: var(--semi-color-border);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-dropdown-menu': SemiDropdownMenu
  }
}
