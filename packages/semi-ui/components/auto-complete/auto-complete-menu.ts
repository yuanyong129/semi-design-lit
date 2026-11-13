import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import type { AutoCompleteOption } from './interface';

const prefixCls = getPrefixCls('autoComplete');
const p = unsafeCSS(prefixCls);

@customElement('semi-auto-complete-menu')
export class SemiAutoCompleteMenu extends LitElement {
  @property({ attribute: false })
  options: AutoCompleteOption[] = [];

  @property({ attribute: 'active-index', type: Number })
  activeIndex: number = -1;

  @property({ type: Boolean })
  loading: boolean = false;

  @property({ attribute: 'empty-content' })
  emptyContent: string = '';

  @property({ attribute: 'list-id' })
  listId: string = `${prefixCls}-listbox`;

  private _select(option: AutoCompleteOption, index: number, event: MouseEvent) {
    if (option.disabled) return;
    this.dispatchEvent(new CustomEvent('option-select', {
      detail: { option, index, event },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (this.loading) {
      return html`
        <div class="${p}-dropdown" part="dropdown" id=${this.listId} role="listbox">
          <div class="${p}-loading">
            <span class="${p}-loading-dot"></span>
            加载中...
          </div>
        </div>
      `;
    }

    return html`
      <div
        class="${p}-dropdown"
        part="dropdown"
        id=${this.listId}
        role="listbox"
        aria-label="AutoComplete options"
      >
        ${this.options.length
          ? this.options.map((option, index) => html`
              <div
                id="${this.listId}-option-${index}"
                class="${p}-option ${index === this.activeIndex ? `${p}-option-active` : ''} ${option.disabled ? `${p}-option-disabled` : ''}"
                role="option"
                aria-selected=${index === this.activeIndex ? 'true' : 'false'}
                aria-disabled=${option.disabled ? 'true' : 'false'}
                @pointerdown=${(event: PointerEvent) => event.preventDefault()}
                @click=${(event: MouseEvent) => this._select(option, index, event)}
              >
                <span class="${p}-option-label">${option.label ?? option.value}</span>
              </div>
            `)
          : this.emptyContent
            ? html`<div class="${p}-empty">${this.emptyContent}</div>`
            : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-width: 200px;
    }

    .${p}-dropdown {
      min-width: 200px;
      max-height: 300px;
      overflow: auto;
      padding: 4px;
      background-color: var(--semi-color-bg-2);
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-medium, 6px);
      box-shadow: var(--semi-shadow-elevated);
      box-sizing: border-box;
    }

    .${p}-option {
      display: flex;
      align-items: center;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      line-height: 20px;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-option:hover,
    .${p}-option-active {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-option-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-option-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-empty,
    .${p}-loading {
      padding: 16px;
      color: var(--semi-color-text-3);
      font-size: 13px;
      text-align: center;
    }

    .${p}-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .${p}-loading-dot {
      width: 12px;
      height: 12px;
      border: 2px solid var(--semi-color-primary);
      border-right-color: transparent;
      border-radius: 50%;
      animation: semi-auto-complete-spin 0.8s linear infinite;
    }

    @keyframes semi-auto-complete-spin {
      to { transform: rotate(360deg); }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-auto-complete-menu': SemiAutoCompleteMenu
  }
}
