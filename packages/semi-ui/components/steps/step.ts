import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type {
  StepStatus,
  StepsDirection,
  StepsSize,
  StepsType,
} from './interface';
import { stepStyles } from './style/step.style';
import '../../../semi-icons/build/check';
import '../../../semi-icons/build/close';

export interface StepSyncOptions {
  index: number;
  status: StepStatus;
  last: boolean;
  direction: StepsDirection;
  type: StepsType;
  size: StepsSize;
  clickable: boolean;
}

/**
 * A single step in a Steps component.
 */
@customElement('semi-step')
export class SemiStep extends LitElement {
  /**
   * @zh 标题
   * @en Title
   */
  @property({ attribute: 'title' })
  stepTitle = '';

  /**
   * @zh 描述
   * @en Description
   */
  @property()
  description = '';

  /**
   * @zh 自定义图标
   * @en Custom icon
   */
  @property({ attribute: false })
  icon?: unknown;

  /**
   * @zh 指定状态，未指定时由父级 Steps 计算
   * @en Explicit status; otherwise calculated by Steps
   */
  @property()
  status?: StepStatus;

  /**
   * @zh 禁用
   * @en Disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private _index = 0;

  @state()
  private _status: StepStatus = 'wait';

  @state()
  private _last = false;

  @state()
  private _direction: StepsDirection = 'horizontal';

  @state()
  private _type: StepsType = 'basic';

  @state()
  private _size: StepsSize = 'default';

  @state()
  private _clickable = false;

  /**
   * Called by the parent Steps to synchronize derived state.
   */
  sync(options: StepSyncOptions): void {
    this._index = options.index;
    this._status = options.status;
    this._last = options.last;
    this._direction = options.direction;
    this._type = options.type;
    this._size = options.size;
    this._clickable = options.clickable;
  }

  private get _resolvedStatus(): StepStatus {
    return this.status ?? this._status;
  }

  private get _isClickable(): boolean {
    return this._clickable && !this.disabled;
  }

  private get _statusIcon() {
    switch (this._resolvedStatus) {
      case 'finish':
        return html`<semi-icon-check></semi-icon-check>`;
      case 'error':
        return html`<semi-icon-close></semi-icon-close>`;
      case 'warning':
        return html`<span class="semi-step-exclamation">!</span>`;
      default:
        return this._index + 1;
    }
  }

  private _handleClick = () => {
    if (!this._isClickable) {
      return;
    }
    const parent = this.closest('semi-steps') as
      | (HTMLElement & { selectStep?: (step: SemiStep) => void })
      | null;
    parent?.selectStep?.(this);
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this._handleClick();
  };

  protected render() {
    const status = this._resolvedStatus;
    const isDot = this._type === 'dot';
    const classes = {
      'semi-step': true,
      [`semi-step-${this._direction}`]: true,
      [`semi-step-${this._type}`]: true,
      [`semi-step-${status}`]: true,
      'semi-step-small': this._size === 'small',
      'semi-step-last': this._last,
      'semi-step-clickable': this._isClickable,
      'semi-step-disabled': this.disabled,
    };

    return html`
      <div
        class=${classMap(classes)}
        role=${this._isClickable ? 'button' : nothing}
        tabindex=${this._isClickable ? '0' : nothing}
        aria-current=${status === 'process' ? 'step' : nothing}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        ${this._last
          ? nothing
          : html`<div class="semi-step-tail" aria-hidden="true"></div>`}
        <div class="semi-step-head">
          <div class="semi-step-icon" part="icon">
            ${isDot
              ? html`<span class="semi-step-dot"></span>`
              : html`<slot name="icon">${this.icon ?? this._statusIcon}</slot>`}
          </div>
          <div class="semi-step-main">
            <div class="semi-step-title" part="title">
              <slot name="title">${this.stepTitle}</slot>
            </div>
            <div class="semi-step-description" part="description">
              <slot name="description">${this.description}</slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static styles = stepStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-step': SemiStep;
  }
}
