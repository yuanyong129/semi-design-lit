import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { GridBreakpoint, GridResponsiveValue } from './interface';
import { colStyles } from './style/col.style';

const BREAKPOINTS: GridBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/**
 * A column inside a `semi-row`. Uses a 24-column grid.
 */
@customElement('semi-col')
export class SemiCol extends LitElement {
  /**
   * @zh 占位格数，0 表示隐藏
   * @en Number of columns to span; 0 hides the column
   * @defaultValue 24
   */
  @property({ type: Number })
  span = 24;

  /**
   * @zh 偏移格数
   * @en Number of columns to offset
   */
  @property({ type: Number })
  offset = 0;

  /**
   * @zh 向右移动格数
   * @en Number of columns to push right
   */
  @property({ type: Number })
  push = 0;

  /**
   * @zh 向左移动格数
   * @en Number of columns to pull left
   */
  @property({ type: Number })
  pull = 0;

  /** @zh 屏幕小于 576px 时的配置 @en Responsive config below 576px */
  @property({ type: Number })
  xs?: number;

  /** @zh 屏幕大于等于 576px 时的配置 @en Responsive config at 576px and above */
  @property({ type: Number })
  sm?: number;

  /** @zh 屏幕大于等于 768px 时的配置 @en Responsive config at 768px and above */
  @property({ type: Number })
  md?: number;

  /** @zh 屏幕大于等于 992px 时的配置 @en Responsive config at 992px and above */
  @property({ type: Number })
  lg?: number;

  /** @zh 屏幕大于等于 1200px 时的配置 @en Responsive config at 1200px and above */
  @property({ type: Number })
  xl?: number;

  /** @zh 屏幕大于等于 1600px 时的配置 @en Responsive config at 1600px and above */
  @property({ type: Number })
  xxl?: number;

  private _responsive(): GridResponsiveValue[] {
    return BREAKPOINTS.map((breakpoint) => {
      const span = this[breakpoint];
      return span === undefined ? {} : { span };
    });
  }

  private _classes(): string[] {
    const classes = ['semi-col', `semi-col-${this.span}`];
    if (this.offset) classes.push(`semi-col-offset-${this.offset}`);
    if (this.push) classes.push(`semi-col-push-${this.push}`);
    if (this.pull) classes.push(`semi-col-pull-${this.pull}`);

    this._responsive().forEach((value, index) => {
      if (value.span === undefined) return;
      classes.push(`semi-col-${BREAKPOINTS[index]}-${value.span}`);
    });
    return classes;
  }

  private _syncHostClasses(): void {
    const next = this._classes();
    Array.from(this.classList).forEach((name) => {
      if (name.startsWith('semi-col')) this.classList.remove(name);
    });
    next.forEach((name) => this.classList.add(name));
  }

  protected willUpdate(): void {
    this._syncHostClasses();
  }

  protected render() {
    return html`
      <div class="semi-col" part="col">
        <slot></slot>
      </div>
    `;
  }

  static styles = colStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-col': SemiCol;
  }
}
