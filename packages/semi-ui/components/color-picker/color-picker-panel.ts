import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ColorPickerFormat, ColorValue, HsvaColor, RgbaColor } from './interface';
import {
  DEFAULT_COLOR,
  colorStringToValue,
  formatColorInput,
  hexToHsva,
  hexToRgba,
  hsvaToHex,
  hsvaToHslString,
  hsvaToHslaString,
  hsvaToRgba,
  hsvaToRgbaString,
  parseColorInput,
  rgbaToHex,
  rgbaToHsva,
} from './color-utils';

type DragKind = 'area' | 'hue' | 'alpha';

export class SemiColorPickerPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: max-content;
      color: var(--semi-color-text-0);
      font-family: var(--semi-font-family-regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    }

    :host(.semi-colorPicker-popover) {
      padding: 8px;
      background: var(--semi-color-bg-3, #fff);
      border: 1px solid var(--semi-color-border);
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
    }

    .semi-colorPicker-colorChooseArea {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 8px 8px 0 0;
      background-image:
        linear-gradient(to top, #000, rgba(0, 0, 0, 0)),
        linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
      cursor: crosshair;
      touch-action: none;
      user-select: none;
    }

    .semi-colorPicker-handle {
      position: absolute;
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18), 0 1px 3px rgba(0, 0, 0, 0.2);
      cursor: grab;
      pointer-events: none;
    }

    .semi-colorPicker-colorSlider,
    .semi-colorPicker-alphaSlider {
      position: relative;
      margin-top: 6px;
      border-radius: 5px;
      cursor: pointer;
      touch-action: none;
      user-select: none;
    }

    .semi-colorPicker-colorSlider {
      background: linear-gradient(
        to right,
        #f00 0%,
        #ff0 17%,
        #0f0 33%,
        #0ff 50%,
        #00f 67%,
        #f0f 83%,
        #f00 100%
      );
    }

    .semi-colorPicker-alphaSlider {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".08"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>');
    }

    .semi-colorPicker-alphaSliderInner {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }

    .semi-colorPicker-handle-color,
    .semi-colorPicker-alphaHandle {
      position: absolute;
      top: 50%;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18), 0 1px 3px rgba(0, 0, 0, 0.2);
      transform: translateY(-50%);
      cursor: grab;
      pointer-events: none;
    }

    .semi-colorPicker-alphaHandle {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".08"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>');
    }

    .semi-colorPicker-dataPart {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
    }

    .semi-colorPicker-colorDemoBlock {
      flex: none;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
    }

    .semi-colorPicker-inputGroup {
      display: flex;
      align-items: center;
      min-width: 0;
      flex: 1;
      gap: 4px;
    }

    .semi-colorPicker-colorPickerInput,
    .semi-colorPicker-colorPickerInputNumber,
    .semi-colorPicker-formatSelect {
      box-sizing: border-box;
      height: 24px;
      border: 1px solid var(--semi-color-border);
      border-radius: 4px;
      background: var(--semi-color-fill-0);
      color: var(--semi-color-text-0);
      font-size: 12px;
      outline: none;
    }

    .semi-colorPicker-colorPickerInput {
      flex: 1;
      min-width: 0;
      padding: 0 7px;
      font-family: var(--semi-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    }

    .semi-colorPicker-colorPickerInput:focus,
    .semi-colorPicker-colorPickerInputNumber:focus,
    .semi-colorPicker-formatSelect:focus {
      border-color: var(--semi-color-primary);
      box-shadow: 0 0 0 1px var(--semi-color-primary-light-active);
    }

    .semi-colorPicker-colorPickerInputNumber {
      width: 58px;
      padding: 0 16px 0 6px;
    }

    .semi-colorPicker-inputNumberSuffix {
      position: absolute;
      right: 6px;
      margin-top: -1px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      pointer-events: none;
    }

    .semi-colorPicker-alphaInputWrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      flex: none;
    }

    .semi-colorPicker-formatSelect {
      width: 72px;
      padding: 0 4px;
      appearance: auto;
    }

    .semi-colorPicker-eyeDropper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      background: var(--semi-color-fill-0);
      color: var(--semi-color-text-1);
      cursor: pointer;
    }

    .semi-colorPicker-eyeDropper:hover {
      background: var(--semi-color-fill-1);
      color: var(--semi-color-text-0);
    }

    .semi-colorPicker-eyeDropper svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }

    .semi-colorPicker-slot {
      margin-top: 8px;
    }
  `;

  @property({ attribute: false }) color: ColorValue = DEFAULT_COLOR;
  @property({ type: Boolean }) alpha = false;
  @property({ type: Boolean, attribute: 'eye-dropper' }) eyeDropper = true;
  @property({ type: String, attribute: 'default-format' }) defaultFormat: ColorPickerFormat = 'hex';
  @property({ type: Number }) width = 280;
  @property({ type: Number }) height = 280;
  @property({ attribute: false }) topSlot: TemplateResult | string | typeof nothing = nothing;
  @property({ attribute: false }) bottomSlot: TemplateResult | string | typeof nothing = nothing;

  @state() private _format: ColorPickerFormat = 'hex';
  @state() private _inputValue = '';
  @state() private _inputFocused = false;

  private _dragKind: DragKind | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._format = this.defaultFormat || 'hex';
    this._inputValue = formatColorInput(this.color ?? DEFAULT_COLOR, this._format);
  }

  disconnectedCallback(): void {
    this._stopDrag();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultFormat') && this.defaultFormat) {
      this._format = this.defaultFormat;
      this._inputValue = formatColorInput(this.color ?? DEFAULT_COLOR, this._format);
    }
    if (changed.has('color') && this.color && !this._inputFocused) {
      this._inputValue = formatColorInput(this.color, this._format);
    }
  }

  private _emit(value: ColorValue): void {
    this.dispatchEvent(
      new CustomEvent('color-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _fromHsva(hsva: HsvaColor): ColorValue {
    return { hsva, rgba: hsvaToRgba(hsva), hex: hsvaToHex(hsva) };
  }

  private _fromRgba(rgba: RgbaColor): ColorValue {
    return { hsva: rgbaToHsva(rgba), rgba, hex: rgbaToHex(rgba) };
  }

  private _applyHsva(partial: Partial<HsvaColor>): void {
    const current = this.color ?? DEFAULT_COLOR;
    const hsva = { ...current.hsva, ...partial };
    this._emit(this._fromHsva(hsva));
  }

  private _applyRgba(partial: Partial<RgbaColor>): void {
    const current = this.color ?? DEFAULT_COLOR;
    this._emit(this._fromRgba({ ...current.rgba, ...partial }));
  }

  private _applyInputValue(value: string | HsvaColor | RgbaColor): void {
    const current = this.color ?? DEFAULT_COLOR;
    if (typeof value === 'string') {
      this._emit({
        hsva: hexToHsva(value),
        rgba: hexToRgba(value),
        hex: value,
      });
    } else if ('r' in value && value.r !== undefined) {
      this._emit(this._fromRgba({ ...current.rgba, ...(value as RgbaColor) }));
    } else {
      this._emit(this._fromHsva({ ...current.hsva, ...(value as HsvaColor) }));
    }
  }

  private _handleInput = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    this._inputValue = value;
    const parsed = parseColorInput(value, this._format);
    if (parsed) this._applyInputValue(parsed as string | HsvaColor | RgbaColor);
  };

  private _handleInputFocus = (): void => {
    this._inputFocused = true;
  };

  private _handleInputBlur = (): void => {
    this._inputFocused = false;
    this._inputValue = formatColorInput(this.color ?? DEFAULT_COLOR, this._format);
  };

  private _handleAlphaInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    const percent = Math.min(100, Math.max(0, Number(input.value) || 0));
    this._applyHsva({ a: Number((percent / 100).toFixed(2)) });
  };

  private _handleFormatChange = (event: Event): void => {
    this._format = (event.target as HTMLSelectElement).value as ColorPickerFormat;
    this._inputValue = formatColorInput(this.color ?? DEFAULT_COLOR, this._format);
  };

  private _handleEyeDropper = async (): Promise<void> => {
    const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const result = await new EyeDropperCtor().open();
      const hex = result.sRGBHex;
      if (hex) {
        this._emit(colorStringToValue(hex));
      }
    } catch {
      // User cancelled the native picker.
    }
  };

  private _pointIn(event: MouseEvent | Touch): { x: number; y: number } | null {
    const area = this.renderRoot.querySelector('.semi-colorPicker-colorChooseArea') as HTMLElement | null;
    if (!area) return null;
    const rect = area.getBoundingClientRect();
    return {
      x: Math.min(this.width, Math.max(0, event.clientX - rect.left)),
      y: Math.min(this.height, Math.max(0, event.clientY - rect.top)),
    };
  }

  private _updateArea = (event: MouseEvent | Touch): void => {
    const point = this._pointIn(event);
    if (!point) return;
    const s = Math.round((point.x / this.width) * 100);
    const v = Math.round(100 - (point.y / this.height) * 100);
    this._applyHsva({ s, v });
  };

  private _updateHue = (event: MouseEvent | Touch): void => {
    const slider = this.renderRoot.querySelector('.semi-colorPicker-colorSlider') as HTMLElement | null;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const x = Math.min(this.width, Math.max(0, event.clientX - rect.left));
    this._applyHsva({ h: Math.round((x / this.width) * 360) });
  };

  private _updateAlpha = (event: MouseEvent | Touch): void => {
    const slider = this.renderRoot.querySelector('.semi-colorPicker-alphaSlider') as HTMLElement | null;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const x = Math.min(this.width, Math.max(0, event.clientX - rect.left));
    this._applyHsva({ a: Number((x / this.width).toFixed(2)) });
  };

  private _onMouseMove = (event: MouseEvent): void => {
    if (this._dragKind === 'area') this._updateArea(event);
    else if (this._dragKind === 'hue') this._updateHue(event);
    else if (this._dragKind === 'alpha') this._updateAlpha(event);
  };

  private _onTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;
    event.preventDefault();
    if (this._dragKind === 'area') this._updateArea(touch);
    else if (this._dragKind === 'hue') this._updateHue(touch);
    else if (this._dragKind === 'alpha') this._updateAlpha(touch);
  };

  private _stopDrag = (): void => {
    if (!this._dragKind) return;
    this._dragKind = null;
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._stopDrag);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._stopDrag);
    document.removeEventListener('touchcancel', this._stopDrag);
  };

  private _startDrag = (kind: DragKind, event: MouseEvent, touch = false): void => {
    (event as MouseEvent).preventDefault?.();
    this._stopDrag();
    this._dragKind = kind;
    if (touch) {
      document.addEventListener('touchmove', this._onTouchMove, { passive: false });
      document.addEventListener('touchend', this._stopDrag);
      document.addEventListener('touchcancel', this._stopDrag);
    } else {
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._stopDrag);
    }
    if (kind === 'area') this._updateArea(event);
    else if (kind === 'hue') this._updateHue(event);
    else this._updateAlpha(event);
  };

  private _startAreaMouse = (event: MouseEvent): void => this._startDrag('area', event);
  private _startAreaTouch = (event: TouchEvent): void => {
    event.preventDefault();
    this._startDrag('area', event.touches[0] as unknown as MouseEvent, true);
  };
  private _startHueMouse = (event: MouseEvent): void => this._startDrag('hue', event);
  private _startHueTouch = (event: TouchEvent): void => {
    event.preventDefault();
    this._startDrag('hue', event.touches[0] as unknown as MouseEvent, true);
  };
  private _startAlphaMouse = (event: MouseEvent): void => this._startDrag('alpha', event);
  private _startAlphaTouch = (event: TouchEvent): void => {
    event.preventDefault();
    this._startDrag('alpha', event.touches[0] as unknown as MouseEvent, true);
  };

  render() {
    const color = this.color ?? DEFAULT_COLOR;
    const { hsva, rgba } = color;
    const hueColor = hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 });
    const areaBackground = hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 });
    const alphaFrom = hsvaToHslaString({ ...hsva, a: 0 });
    const alphaTo = hsvaToHslaString({ ...hsva, a: 1 });
    const handleX = (hsva.s / 100) * this.width - 10;
    const handleY = (1 - hsva.v / 100) * this.height - 10;

    return html`
      ${this.topSlot !== nothing && this.topSlot !== undefined
        ? html`<div class="semi-colorPicker-slot">${this.topSlot}</div>`
        : nothing}
      <div
        class="semi-colorPicker-colorChooseArea"
        aria-label="Color"
        aria-valuetext="Saturation ${hsva.s}%, Brightness ${hsva.v}%"
        style="width:${this.width}px;height:${this.height}px;background-color:${areaBackground}"
        @mousedown=${this._startAreaMouse}
        @touchstart=${this._startAreaTouch}
      >
        <div
          class="semi-colorPicker-handle"
          style="left:${handleX}px;top:${handleY}px;background-color:${hsvaToRgbaString(hsva)}"
        ></div>
      </div>

      <div
        class="semi-colorPicker-colorSlider"
        style="width:${this.width}px;height:10px"
        @mousedown=${this._startHueMouse}
        @touchstart=${this._startHueTouch}
      >
        <div
          class="semi-colorPicker-handle-color"
          style="left:${(hsva.h / 360) * this.width - 9}px;background-color:${hueColor}"
        ></div>
      </div>

      ${this.alpha
        ? html`
            <div
              class="semi-colorPicker-alphaSlider"
              style="width:${this.width}px;height:10px"
              aria-label="Alpha"
              aria-valuetext="${Math.round(hsva.a * 100)}%"
              @mousedown=${this._startAlphaMouse}
              @touchstart=${this._startAlphaTouch}
            >
              <div
                class="semi-colorPicker-alphaSliderInner"
                style="background:linear-gradient(90deg, ${alphaFrom}, ${alphaTo})"
              >
                <div
                  class="semi-colorPicker-alphaHandle"
                  style="left:${hsva.a * this.width - 9}px;background-color:${hsvaToRgbaString(hsva)}"
                ></div>
              </div>
            </div>
          `
        : nothing}

      <div class="semi-colorPicker-dataPart" style="width:${this.width}px">
        <div
          class="semi-colorPicker-colorDemoBlock"
          style="background-color:rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})"
        ></div>
        <div class="semi-colorPicker-inputGroup">
          <input
            class="semi-colorPicker-colorPickerInput"
            aria-label="Color value"
            .value=${this._inputValue}
            @input=${this._handleInput}
            @focus=${this._handleInputFocus}
            @blur=${this._handleInputBlur}
          />
          ${this.alpha
            ? html`
                <span class="semi-colorPicker-alphaInputWrap">
                  <input
                    class="semi-colorPicker-colorPickerInputNumber"
                    type="number"
                    min="0"
                    max="100"
                    aria-label="Alpha"
                    .value=${String(Math.round(hsva.a * 100))}
                    @input=${this._handleAlphaInput}
                  />
                  <span class="semi-colorPicker-inputNumberSuffix">%</span>
                </span>
              `
            : nothing}
          <select
            class="semi-colorPicker-formatSelect"
            aria-label="Color format"
            .value=${this._format}
            @change=${this._handleFormatChange}
          >
            <option value="hex">hex</option>
            <option value="rgba">rgba</option>
            <option value="hsva">hsva</option>
          </select>
        </div>
        ${this.eyeDropper
          ? html`
              <button
                class="semi-colorPicker-eyeDropper"
                type="button"
                title="取色"
                aria-label="Pick color from screen"
                @click=${this._handleEyeDropper}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M19.35 3.65a3.48 3.48 0 0 0-4.92 0l-2.1 2.1-1.06-1.06a1 1 0 0 0-1.42 1.42l1.06 1.06-7.3 7.3a2 2 0 0 0-.55 1.05l-.6 3.1a1 1 0 0 0 1.18 1.18l3.1-.6a2 2 0 0 0 1.05-.55l7.3-7.3 1.06 1.06a1 1 0 0 0 1.42-1.42l-1.06-1.06 2.1-2.1a3.48 3.48 0 0 0 0-4.92Zm-1.42 3.5-2.1 2.1-1.06-1.06 2.1-2.1a1.48 1.48 0 1 1 2.1 2.1l-.04.04Z"
                  />
                </svg>
              </button>
            `
          : nothing}
      </div>
      ${this.bottomSlot !== nothing && this.bottomSlot !== undefined
        ? html`<div class="semi-colorPicker-slot">${this.bottomSlot}</div>`
        : nothing}
    `;
  }
}

if (!customElements.get('semi-color-picker-panel')) {
  customElements.define('semi-color-picker-panel', SemiColorPickerPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-color-picker-panel': SemiColorPickerPanel;
  }
}
