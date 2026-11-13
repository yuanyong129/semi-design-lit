import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ColorPickerChangeDetail, ColorPickerFormat, ColorValue } from './interface';
import { DEFAULT_COLOR, colorStringToValue } from './color-utils';
import '../trigger/trigger';
import './color-picker-panel';

export class SemiColorPicker extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      color: var(--semi-color-text-0);
      font-family: var(--semi-font-family-regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
      vertical-align: middle;
    }

    .semi-colorPicker-popover-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      outline: none;
    }

    .semi-colorPicker-popover-trigger:focus-visible {
      box-shadow: 0 0 0 2px var(--semi-color-primary-light-active, rgba(0, 100, 250, 0.25));
    }

    .semi-colorPicker-popover-defaultChildren {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
      pointer-events: none;
    }
  `;

  @property({ attribute: false }) value?: ColorValue;
  @property({ attribute: false }) defaultValue: ColorValue = DEFAULT_COLOR;
  @property({ type: Boolean }) alpha = false;
  @property({ type: Boolean, attribute: 'eye-dropper' }) eyeDropper = true;
  @property({ type: String, attribute: 'default-format' }) defaultFormat: ColorPickerFormat = 'hex';
  @property({ type: Number }) width = 280;
  @property({ type: Number }) height = 280;
  @property({ type: Boolean, attribute: 'use-popover' }) usePopover = false;
  @property({ attribute: false }) popoverProps: Record<string, unknown> | undefined;
  @property({ attribute: false }) topSlot: TemplateResult | string | typeof nothing = nothing;
  @property({ attribute: false }) bottomSlot: TemplateResult | string | typeof nothing = nothing;

  @state() private _color: ColorValue = DEFAULT_COLOR;
  @state() private _open = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._color = this.value ?? this.defaultValue ?? DEFAULT_COLOR;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('value') && this.value) {
      this._color = this.value;
    }
    if (changed.has('defaultValue') && !this.value && this.defaultValue) {
      this._color = this.defaultValue;
    }
  }

  private get _currentColor(): ColorValue {
    return this.value ?? this._color;
  }

  private _handleColorChange = (event: CustomEvent<{ value: ColorValue }>): void => {
    event.stopPropagation();
    const value = event.detail.value;
    if (!this.value) this._color = value;
    this.dispatchEvent(
      new CustomEvent<ColorPickerChangeDetail>('change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private _toggleOpen = (): void => {
    this._open = !this._open;
  };

  private _handleOpenChange = (event: CustomEvent<{ open: boolean }>): void => {
    const open = event.detail?.open ?? false;
    if (open !== this._open) this._open = open;
  };

  private _handleTriggerKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._toggleOpen();
    }
  };

  private get _popoverPlacement(): { position: string; align: string } {
    const raw = typeof this.popoverProps?.position === 'string' ? this.popoverProps.position : 'bottomLeft';
    const align = raw.endsWith('Right') ? 'end' : raw.endsWith('Left') ? 'start' : 'center';
    const position = raw.startsWith('top')
      ? 'top'
      : raw.startsWith('right')
        ? 'right'
        : raw.startsWith('left')
          ? 'left'
          : 'bottom';
    return { position, align };
  }

  private _renderPanel(popover: boolean) {
    const color = this._currentColor;
    return html`
      <semi-color-picker-panel
        class=${popover ? 'semi-colorPicker-popover' : ''}
        .color=${color}
        .alpha=${this.alpha}
        .eyeDropper=${this.eyeDropper}
        .defaultFormat=${this.defaultFormat}
        .width=${this.width}
        .height=${this.height}
        .topSlot=${this.topSlot}
        .bottomSlot=${this.bottomSlot}
        @color-change=${this._handleColorChange}
      ></semi-color-picker-panel>
    `;
  }

  render() {
    if (!this.usePopover) {
      return html`<div class="semi-colorPicker" part="color-picker">${this._renderPanel(false)}</div>`;
    }

    const color = this._currentColor;
    const placement = this._popoverPlacement;
    return html`
      <semi-trigger
        trigger="custom"
        .open=${this._open}
        .content=${this._renderPanel(true)}
        position=${placement.position}
        align=${placement.align}
        .popupPlain=${true}
        .showArrow=${false}
        @openChange=${this._handleOpenChange}
      >
        <div
          class="semi-colorPicker-popover-trigger"
          role="button"
          tabindex="0"
          aria-haspopup="dialog"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-label="选择颜色"
          @click=${this._toggleOpen}
          @keydown=${this._handleTriggerKeyDown}
        >
          ${this.children.length
            ? html`<slot></slot>`
            : html`<div
                class="semi-colorPicker-popover-defaultChildren"
                style="background-color:${color.hex}"
              ></div>`}
        </div>
      </semi-trigger>
    `;
  }

  static colorStringToValue = colorStringToValue;
}

if (!customElements.get('semi-color-picker')) {
  customElements.define('semi-color-picker', SemiColorPicker);
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-color-picker': SemiColorPicker;
  }
}
