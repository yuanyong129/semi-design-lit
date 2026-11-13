import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import {
  SliderAriaValueText,
  SliderHandleDot,
  SliderMarkContent,
  SliderMarks,
  SliderValue,
} from './interface';

const prefixCls = getPrefixCls('slider');
const p = unsafeCSS(prefixCls);

@customElement('semi-slider')
export class SemiSlider extends LitElement {
  @property({ attribute: false })
  value?: SliderValue;

  @property({ attribute: false })
  defaultValue: SliderValue = 0;

  @property({ type: Number })
  min: number = 0;

  @property({ type: Number })
  max: number = 100;

  @property({ type: Number })
  step: number = 1;

  @property({ type: Boolean, reflect: true })
  range: boolean = false;

  @property({ type: Boolean, reflect: true })
  vertical: boolean = false;

  @property({ attribute: 'vertical-reverse', type: Boolean })
  verticalReverse: boolean = false;

  @property({ type: Boolean })
  reverse: boolean = false;

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ attribute: 'show-boundary', type: Boolean })
  showBoundary: boolean = false;

  @property({ type: Boolean })
  included: boolean = true;

  @property({ attribute: false })
  marks?: SliderMarks;

  @property({ attribute: 'tooltip-visible', type: Boolean })
  tooltipVisible: boolean = false;

  @property({ attribute: 'tooltip-on-mark', type: Boolean })
  tooltipOnMark: boolean = false;

  @property({ attribute: 'show-mark-label', type: Boolean })
  showMarkLabel: boolean = true;

  @property({ attribute: 'show-arrow', type: Boolean })
  showArrow: boolean = true;

  @property({ attribute: false })
  tipFormatter?: (value: number) => SliderMarkContent;

  @property({ attribute: false })
  getAriaValueText?: SliderAriaValueText;

  @property({ attribute: false })
  handleDot?: SliderHandleDot | SliderHandleDot[];

  @property({ attribute: false })
  railStyle?: Record<string, string>;

  @property({ attribute: false })
  trackStyle?: Record<string, string>;

  @property({ attribute: false })
  handleStyle?: Record<string, string>;

  @property({ attribute: 'aria-label' })
  sliderLabel?: string;

  @property({ attribute: false })
  ariaLabelForHandle?: string | string[];

  @state()
  private _values: number[] = [0];

  @state()
  private _draggingIndex: number = -1;

  @state()
  private _hoverIndex: number = -1;

  @state()
  private _focusedIndex: number = -1;

  @query('.semi-slider-rail')
  private _rail?: HTMLElement;

  private _lastPointerMove?: (event: PointerEvent) => void;
  private _lastPointerUp?: (event: PointerEvent) => void;

  connectedCallback() {
    super.connectedCallback();
    this._values = this._normalize(this.value ?? this.defaultValue);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removePointerListeners();
  }

  /** Focus a slider handle. */
  focus(options?: FocusOptions): void;
  focus(index?: number): void;
  focus(arg?: FocusOptions | number) {
    if (typeof arg === 'number') {
      this._handleElements()[arg]?.focus();
      return;
    }
    super.focus(arg);
  }

  /** Blur a slider handle. */
  blur(index: number = 0) {
    this._handleElements()[index]?.blur();
  }

  private _handleElements(): HTMLElement[] {
    return Array.from(this.renderRoot.querySelectorAll<HTMLElement>(`.${prefixCls}-handle`));
  }

  private _stepDecimals(): number {
    const text = String(this.step);
    return text.includes('.') ? text.split('.')[1].length : 0;
  }

  private _round(value: number): number {
    const min = Math.min(this.min, this.max);
    const max = Math.max(this.min, this.max);
    const step = this.step > 0 ? this.step : 1;
    const clamped = Math.min(max, Math.max(min, value));
    const next = min + Math.round((clamped - min) / step) * step;
    return Number(next.toFixed(this._stepDecimals()));
  }

  private _normalize(value: SliderValue | undefined): number[] {
    const min = Math.min(this.min, this.max);
    if (Array.isArray(value)) {
      if (this.range) {
        const first = this._round(value[0] ?? min);
        const second = this._round(value[1] ?? first);
        return [Math.min(first, second), Math.max(first, second)];
      }
      return [this._round(value[0] ?? min)];
    }
    if (!this.range) {
      return [this._round(typeof value === 'number' && Number.isFinite(value) ? value : min)];
    }
    return [min, min];
  }

  private _isControlled(): boolean {
    return this.value !== undefined;
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('value') && this.value !== undefined) {
      this._values = this._normalize(this.value);
    }
    if (
      changed.has('range') ||
      changed.has('min') ||
      changed.has('max') ||
      changed.has('step')
    ) {
      this._values = this._normalize(this._values);
    }
  }

  private _percent(value: number): number {
    const span = this.max - this.min;
    if (span === 0) return 0;
    return Math.min(1, Math.max(0, (value - this.min) / span));
  }

  private _visualPercent(value: number): number {
    const percent = this._percent(value);
    if (this.vertical) return this.verticalReverse ? percent : 1 - percent;
    return this.reverse ? 1 - percent : percent;
  }

  private _valueFromPointer(event: PointerEvent): number | null {
    if (!this._rail) return null;
    const rect = this._rail.getBoundingClientRect();
    let percent: number;
    if (this.vertical) {
      percent = 1 - (event.clientY - rect.top) / (rect.height || 1);
      if (this.verticalReverse) percent = 1 - percent;
    } else {
      percent = (event.clientX - rect.left) / (rect.width || 1);
      if (this.reverse) percent = 1 - percent;
    }
    percent = Math.min(1, Math.max(0, percent));
    return this._round(this.min + percent * (this.max - this.min));
  }

  private _nearestIndex(value: number): number {
    if (!this.range) return 0;
    return Math.abs(this._values[0] - value) <= Math.abs(this._values[1] - value) ? 0 : 1;
  }

  private _clampForIndex(index: number, value: number): number {
    if (!this.range) return value;
    if (index === 0) return Math.min(value, this._values[1]);
    return Math.max(value, this._values[0]);
  }

  private _applyValue(index: number, value: number, complete: boolean) {
    const nextValue = this._clampForIndex(index, this._round(value));
    if (nextValue === this._values[index]) return;
    const next = [...this._values];
    next[index] = nextValue;
    this._values = next;
    this._emitChange(complete);
  }

  private _emitChange(complete: boolean) {
    const value: SliderValue = this.range ? [...this._values] : this._values[0];
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
    if (complete) {
      this.dispatchEvent(new CustomEvent('change-complete', {
        detail: { value },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _handlePointerDown(event: PointerEvent, index: number) {
    if (this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    this._draggingIndex = index;
    this._removePointerListeners();

    this._lastPointerMove = (moveEvent: PointerEvent) => {
      const value = this._valueFromPointer(moveEvent);
      if (value === null) return;
      this._applyValue(this._draggingIndex, value, false);
    };
    this._lastPointerUp = () => {
      const active = this._draggingIndex;
      this._draggingIndex = -1;
      this._removePointerListeners();
      if (active >= 0) this._emitChange(true);
    };

    window.addEventListener('pointermove', this._lastPointerMove);
    window.addEventListener('pointerup', this._lastPointerUp);
    window.addEventListener('pointercancel', this._lastPointerUp);
  }

  private _handleRailPointerDown(event: PointerEvent) {
    if (this.disabled) return;
    const value = this._valueFromPointer(event);
    if (value === null) return;
    const index = this._nearestIndex(value);
    this._draggingIndex = index;
    this._applyValue(index, value, false);
    this._handlePointerDown(event, index);
  }

  private _removePointerListeners() {
    if (this._lastPointerMove) window.removeEventListener('pointermove', this._lastPointerMove);
    if (this._lastPointerUp) {
      window.removeEventListener('pointerup', this._lastPointerUp);
      window.removeEventListener('pointercancel', this._lastPointerUp);
    }
    this._lastPointerMove = undefined;
    this._lastPointerUp = undefined;
  }

  private _handleKeyDown(event: KeyboardEvent, index: number) {
    if (this.disabled) return;
    const step = this.step > 0 ? this.step : 1;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = this._values[index] + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = this._values[index] - step;
        break;
      case 'PageUp':
        next = this._values[index] + step * 10;
        break;
      case 'PageDown':
        next = this._values[index] - step * 10;
        break;
      case 'Home':
        next = Math.min(this.min, this.max);
        break;
      case 'End':
        next = Math.max(this.min, this.max);
        break;
      default:
        return;
    }
    event.preventDefault();
    this._applyValue(index, next, true);
  }

  private _tooltipText(value: number): SliderMarkContent {
    return this.tipFormatter ? this.tipFormatter(value) : value;
  }

  private _dotStyle(index: number): Record<string, string> {
    const dot = Array.isArray(this.handleDot) ? this.handleDot[index] : this.handleDot;
    return {
      ...(dot?.size ? { width: dot.size, height: dot.size } : {}),
      ...(dot?.color ? { backgroundColor: dot.color, borderColor: dot.color } : {}),
      ...(this.handleStyle ?? {}),
    };
  }

  private _renderMarks() {
    if (!this.marks) return nothing;
    return html`
      <div class="${prefixCls}-marks" aria-hidden="true">
        ${Object.entries(this.marks).map(([key, label]) => {
          const value = Number(key);
          if (!Number.isFinite(value)) return nothing;
          const percent = this._visualPercent(value);
          const minValue = Math.min(...this._values);
          const maxValue = Math.max(...this._values);
          const active = value >= minValue && value <= maxValue;
          const showLabel = this.showMarkLabel &&
            !(this.showBoundary && (value === this.min || value === this.max));
          const style = this.vertical
            ? { top: `${percent * 100}%` }
            : { left: `${percent * 100}%` };
          return html`
            <span
              class="${prefixCls}-mark ${active ? `${prefixCls}-mark-active` : ''}"
              style=${styleMap(style)}
            >${showLabel ? label : ''}</span>
          `;
        })}
      </div>
    `;
  }

  private _renderDots() {
    if (!this.marks) return nothing;
    return html`
      <div class="${prefixCls}-dots" aria-hidden="true">
        ${Object.keys(this.marks).map((key) => {
          const value = Number(key);
          if (!Number.isFinite(value)) return nothing;
          const percent = this._visualPercent(value);
          const active = value >= Math.min(...this._values) && value <= Math.max(...this._values);
          const style = this.vertical
            ? { top: `${percent * 100}%` }
            : { left: `${percent * 100}%` };
          return html`
            <span
              class="${prefixCls}-dot ${active ? `${prefixCls}-dot-active` : ''}"
              style=${styleMap(style)}
            ></span>
          `;
        })}
      </div>
    `;
  }

  private _renderHandles() {
    return this._values.map((value, index) => {
      const percent = this._visualPercent(value);
      const style = this.vertical
        ? { top: `${percent * 100}%` }
        : { left: `${percent * 100}%` };
      const label = Array.isArray(this.ariaLabelForHandle)
        ? this.ariaLabelForHandle[index]
        : this.ariaLabelForHandle;
      const ariaValueText = this.getAriaValueText
        ? this.getAriaValueText(value, index)
        : String(this._tooltipText(value));
      return html`
        <span
          class="${prefixCls}-handle ${this._draggingIndex === index ? `${prefixCls}-handle-clicked` : ''}"
          style=${styleMap({ ...style, ...this._dotStyle(index) })}
          role="slider"
          tabindex=${this.disabled ? -1 : 0}
          aria-label=${label ?? this.sliderLabel ?? (this.disabled ? 'Disabled Slider' : 'Slider')}
          aria-orientation=${this.vertical ? 'vertical' : 'horizontal'}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-valuenow=${value}
          aria-valuetext=${ariaValueText}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @pointerdown=${(event: PointerEvent) => this._handlePointerDown(event, index)}
          @keydown=${(event: KeyboardEvent) => this._handleKeyDown(event, index)}
          @mouseenter=${() => { this._hoverIndex = index; }}
          @mouseleave=${() => { if (this._hoverIndex === index) this._hoverIndex = -1; }}
          @focus=${() => { this._focusedIndex = index; }}
          @blur=${() => { if (this._focusedIndex === index) this._focusedIndex = -1; }}
        >
          ${this._isTooltipVisible(index)
            ? html`<span class="${prefixCls}-tooltip ${this.showArrow ? `${prefixCls}-tooltip-arrow` : ''}" role="tooltip">
                ${this._tooltipText(value)}
              </span>`
            : nothing}
        </span>
      `;
    });
  }

  private _isTooltipVisible(index: number): boolean {
    return this.tooltipVisible ||
      this._draggingIndex === index ||
      this._hoverIndex === index ||
      this._focusedIndex === index;
  }

  private _renderTrack() {
    if (!this.included) return nothing;
    if (!this.range) {
      const percent = this._percent(this._values[0]);
      const style = this.vertical
        ? this.verticalReverse
          ? { top: 0, height: `${percent * 100}%` }
          : { bottom: 0, height: `${percent * 100}%` }
        : this.reverse
          ? { right: 0, width: `${percent * 100}%` }
          : { left: 0, width: `${percent * 100}%` };
      return html`<div class="${prefixCls}-track" style=${styleMap({ ...style, ...this.trackStyle })}></div>`;
    }

    const first = Math.min(this._percent(this._values[0]), this._percent(this._values[1]));
    const second = Math.max(this._percent(this._values[0]), this._percent(this._values[1]));
    const style = this.vertical
      ? this.verticalReverse
        ? { top: `${first * 100}%`, height: `${(second - first) * 100}%` }
        : { bottom: `${first * 100}%`, height: `${(second - first) * 100}%` }
      : this.reverse
        ? { right: `${first * 100}%`, width: `${(second - first) * 100}%` }
        : { left: `${first * 100}%`, width: `${(second - first) * 100}%` };
    return html`<div class="${prefixCls}-track" style=${styleMap({ ...style, ...this.trackStyle })}></div>`;
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      this.vertical ? `${prefixCls}-vertical` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this.reverse ? `${prefixCls}-reverse` : '',
    ]);

    return html`
      <div class="${cls}" part="slider">
        <div class="${prefixCls}-wrapper">
          <div
            class="${prefixCls}-rail"
            part="rail"
            style=${styleMap(this.railStyle ?? {})}
            @pointerdown=${this._handleRailPointerDown}
          >
            ${this._renderTrack()}
            ${this._renderDots()}
            ${this._renderHandles()}
          </div>
          ${this._renderMarks()}
          ${this.showBoundary
            ? html`<div class="${prefixCls}-boundary">
                <span>${Math.min(this.min, this.max)}</span>
                <span>${Math.max(this.min, this.max)}</span>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 120px;
      padding: 8px 0;
      box-sizing: border-box;
    }

    :host([vertical]) {
      display: inline-block;
      width: auto;
      min-width: 0;
      height: 200px;
      padding: 0 8px;
    }

    .${p} {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .${p}-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 0 7px;
      box-sizing: border-box;
    }

    .${p}-vertical .${p}-wrapper {
      width: 100%;
      height: 100%;
      padding: 7px 0;
    }

    .${p}-rail {
      position: relative;
      width: 100%;
      height: 4px;
      background-color: var(--semi-color-fill-1);
      border-radius: 2px;
      cursor: pointer;
      touch-action: none;
    }

    .${p}-vertical .${p}-rail {
      width: 4px;
      height: 100%;
      margin: 0 auto;
    }

    .${p}-track {
      position: absolute;
      top: 0;
      height: 4px;
      background-color: var(--semi-color-primary);
      border-radius: inherit;
      pointer-events: none;
    }

    .${p}-vertical .${p}-track {
      top: auto;
      left: calc(50% - 2px);
      width: 4px;
      height: auto;
    }

    .${p}-dots {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .${p}-dot {
      position: absolute;
      width: 4px;
      height: 4px;
      background-color: var(--semi-color-text-3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      top: 50%;
    }

    .${p}-vertical .${p}-dot {
      left: 50%;
      top: auto;
      transform: translate(-50%, -50%);
    }

    .${p}-dot-active {
      background-color: var(--semi-color-primary);
    }

    .${p}-handle {
      position: absolute;
      width: 14px;
      height: 14px;
      background-color: var(--semi-color-bg-2);
      border: 2px solid var(--semi-color-primary);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      cursor: grab;
      outline: none;
      z-index: 1;
      box-sizing: border-box;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .${p}-vertical .${p}-handle {
      left: 50%;
    }

    .${p}-handle:hover,
    .${p}-handle-clicked {
      box-shadow: 0 0 0 6px var(--semi-color-primary-light-default);
    }

    .${p}-handle:focus-visible {
      box-shadow: 0 0 0 4px var(--semi-color-primary-light-default);
    }

    .${p}-disabled .${p}-rail {
      cursor: not-allowed;
    }

    .${p}-disabled .${p}-handle {
      border-color: var(--semi-color-disabled-text);
      background-color: var(--semi-color-disabled-fill);
      cursor: not-allowed;
      box-shadow: none;
    }

    .${p}-disabled .${p}-track {
      background-color: var(--semi-color-disabled-text);
    }

    .${p}-marks {
      position: absolute;
      top: 14px;
      left: 7px;
      right: 7px;
      height: 20px;
      pointer-events: none;
    }

    .${p}-vertical .${p}-marks {
      top: 7px;
      bottom: 7px;
      left: 16px;
      right: auto;
      width: 80px;
      height: auto;
    }

    .${p}-mark {
      position: absolute;
      color: var(--semi-color-text-2);
      font-size: 12px;
      line-height: 20px;
      white-space: nowrap;
      transform: translateX(-50%);
    }

    .${p}-vertical .${p}-mark {
      transform: translateY(-50%);
      left: 0;
    }

    .${p}-mark-active {
      color: var(--semi-color-text-0);
    }

    .${p}-boundary {
      display: flex;
      justify-content: space-between;
      margin-top: 18px;
      color: var(--semi-color-text-3);
      font-size: 12px;
    }

    .${p}-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      padding: 4px 8px;
      color: var(--semi-color-white);
      font-size: 12px;
      line-height: 18px;
      white-space: nowrap;
      background-color: var(--semi-color-tertiary);
      border-radius: 3px;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 2;
    }

    .${p}-tooltip-arrow::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      border: 4px solid transparent;
      border-top-color: var(--semi-color-tertiary);
      transform: translateX(-50%);
    }

    .${p}-vertical .${p}-tooltip {
      bottom: auto;
      top: 50%;
      left: calc(100% + 10px);
      transform: translateY(-50%);
    }

    .${p}-vertical .${p}-tooltip-arrow::after {
      top: 50%;
      left: auto;
      right: 100%;
      border-top-color: transparent;
      border-right-color: var(--semi-color-tertiary);
      transform: translateY(-50%);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-slider': SemiSlider
  }
}
