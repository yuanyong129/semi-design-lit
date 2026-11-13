import { html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { styles } from './style/rating.style';
import { RatingSize } from './interface';
import '../../../semi-icons/build/star-fill';

const prefixCls = getPrefixCls('rating');

@customElement('semi-rating')
export class SemiRating extends LitElement {
  /**
   * @zh 当前评分（受控）
   * @en Current rating (controlled)
   */
  @property({ type: Number })
  value?: number;

  /**
   * @zh 默认评分（非受控）
   * @en Default rating (uncontrolled)
   * @defaultValue 0
   */
  @property({ attribute: 'default-value', type: Number })
  defaultValue: number = 0;

  /**
   * @zh 评分总数
   * @en Total number of stars
   * @defaultValue 5
   */
  @property({ type: Number })
  count: number = 5;

  /**
   * @zh 是否允许半星
   * @en Whether half stars are allowed
   */
  @property({ attribute: 'allow-half', type: Boolean })
  allowHalf: boolean = false;

  /**
   * @zh 点击当前评分是否清除
   * @en Whether clicking the current value clears the rating
   */
  @property({ attribute: 'allow-clear', type: Boolean })
  allowClear: boolean = true;

  /**
   * @zh 是否禁用
   * @en Whether the rating is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 尺寸，支持 small、default 或自定义数值
   * @en Size, supports small, default or a custom number
   */
  @property({ attribute: false })
  size: RatingSize = 'default';

  /**
   * @zh 自定义字符
   * @en Custom character
   */
  @property({ attribute: false })
  character?: string | TemplateResult;

  /**
   * @zh 每一项的提示文案
   * @en Tooltip text for each star
   */
  @property({ attribute: false })
  tooltips?: string[];

  /**
   * @zh 无障碍标签
   * @en Accessible label
   */
  @property({ attribute: 'aria-label' })
  ratingLabel?: string;

  @state()
  private _value: number = 0;

  @state()
  private _hoverValue?: number;

  @state()
  private _focused: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue;
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('value') && this.value !== undefined) {
      this._value = this.value;
    }
  }

  private get _currentValue(): number {
    return this.value ?? this._value;
  }

  private get _displayValue(): number {
    return this._hoverValue ?? this._currentValue;
  }

  private get _step(): number {
    return this.allowHalf ? 0.5 : 1;
  }

  private get _starSize(): number {
    if (typeof this.size === 'number') return this.size;
    return this.size === 'small' ? 16 : 20;
  }

  private _clamp(value: number): number {
    return Math.max(0, Math.min(this.count, value));
  }

  private _componentCls(): string {
    return handleClsList([
      prefixCls,
      typeof this.size === 'string' ? `${prefixCls}-${this.size}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this._focused ? `${prefixCls}-focus` : '',
    ]);
  }

  private _hoverAt(event: MouseEvent, index: number) {
    if (this.disabled) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isHalf = this.allowHalf && event.clientX - rect.left < rect.width / 2;
    const next = index + (isHalf ? 0.5 : 1);
    if (next !== this._hoverValue) {
      this._hoverValue = next;
      this.dispatchEvent(new CustomEvent('hoverChange', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _handleMouseLeave() {
    if (this.disabled) return;
    if (this._hoverValue !== undefined) {
      this._hoverValue = undefined;
      this.dispatchEvent(new CustomEvent('hoverChange', {
        detail: { value: undefined },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _commit(value: number) {
    if (this.disabled) return;
    const next = this.allowClear && value === this._currentValue ? 0 : this._clamp(value);
    if (this.value === undefined) {
      this._value = next;
    }
    this._hoverValue = undefined;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: next },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleClick(event: MouseEvent, index: number) {
    event.stopPropagation();
    this._hoverAt(event, index);
    this._commit(this._hoverValue ?? index + 1);
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;
    const current = this._currentValue;
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = current === 0 ? this._step : current + this._step;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = current - this._step;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = this.count;
    } else if (event.key === 'Enter' || event.key === ' ') {
      next = current;
    }
    if (next === undefined) return;
    event.preventDefault();
    this._commit(next);
  }

  private _handleFocus() {
    this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _renderCharacter() {
    return this.character ?? html`<semi-icon-star-fill></semi-icon-star-fill>`;
  }

  private _renderStar(index: number) {
    const fill = Math.max(0, Math.min(1, this._displayValue - index)) * 100;
    const checked = this._displayValue >= index + 1;
    return html`
      <li
        class="${prefixCls}-star"
        role="radio"
        aria-checked=${checked ? 'true' : 'false'}
        aria-label=${`${index + 1} 星`}
        title=${this.tooltips?.[index] ?? nothing}
        @mousemove=${(event: MouseEvent) => this._hoverAt(event, index)}
        @click=${(event: MouseEvent) => this._handleClick(event, index)}
      >
        <span class="${prefixCls}-star-bg" aria-hidden="true">${this._renderCharacter()}</span>
        <span class="${prefixCls}-star-fill" style=${styleMap({ width: `${fill}%` })} aria-hidden="true">
          ${this._renderCharacter()}
        </span>
      </li>
    `;
  }

  focus() {
    this.renderRoot.querySelector<HTMLElement>('ul')?.focus();
  }

  blur() {
    this.renderRoot.querySelector<HTMLElement>('ul')?.blur();
  }

  render() {
    const style = styleMap({ fontSize: `${this._starSize}px` });
    return html`
      <ul
        class="${this._componentCls()}"
        style=${style}
        role="radiogroup"
        aria-label=${this.ratingLabel ?? `评分：${this._currentValue} / ${this.count}`}
        tabindex=${this.disabled ? -1 : 0}
        @mouseleave=${this._handleMouseLeave}
        @keydown=${this._handleKeyDown}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
      >
        ${Array.from({ length: this.count }, (_, index) => this._renderStar(index))}
      </ul>
    `;
  }

  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-rating': SemiRating;
  }
}
