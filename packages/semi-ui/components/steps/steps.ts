import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type {
  StepChangeDetail,
  StepStatus,
  StepsDirection,
  StepsSize,
  StepsType,
} from './interface';
import type { SemiStep } from './step';
import { stepsStyles } from './style/steps.style';
import './step';

/**
 * Steps display the progress of a task.
 */
@customElement('semi-steps')
export class SemiSteps extends LitElement {
  /**
   * @zh 当前步骤
   * @en Current step
   * @defaultValue 0
   */
  @property({ type: Number })
  current = 0;

  /**
   * @zh 当前步骤状态
   * @en Status of current step
   * @defaultValue 'process'
   */
  @property()
  status: StepStatus = 'process';

  /**
   * @zh 步骤类型
   * @en Steps type
   * @defaultValue 'basic'
   */
  @property()
  type: StepsType = 'basic';

  /**
   * @zh 排列方向
   * @en Direction
   * @defaultValue 'horizontal'
   */
  @property()
  direction: StepsDirection = 'horizontal';

  /**
   * @zh 尺寸
   * @en Size
   * @defaultValue 'default'
   */
  @property()
  size: StepsSize = 'default';

  /**
   * @zh 是否可点击切换
   * @en Whether steps can be clicked to switch
   */
  @property({ type: Boolean })
  clickable = false;

  private get _steps(): SemiStep[] {
    return Array.from(this.querySelectorAll(':scope > semi-step')) as SemiStep[];
  }

  private _syncSteps(): void {
    const steps = this._steps;
    const last = steps.length - 1;

    steps.forEach((step, index) => {
      let status: StepStatus;
      if (step.status) {
        status = step.status;
      } else if (index < this.current) {
        status = 'finish';
      } else if (index === this.current) {
        status = this.status;
      } else {
        status = 'wait';
      }

      step.sync({
        index,
        status,
        last: index === last,
        direction: this.direction,
        type: this.type,
        size: this.size,
        clickable: this.clickable || this.type === 'nav',
      });
    });
  }

  /**
   * Called by a step when it is activated.
   */
  selectStep(step: SemiStep): void {
    const index = this._steps.indexOf(step);
    if (index < 0 || step.disabled) {
      return;
    }
    if (!this.clickable && this.type !== 'nav') {
      return;
    }

    this.current = index;
    this.dispatchEvent(
      new CustomEvent<StepChangeDetail>('change', {
        detail: { current: index, step },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSlotChange = () => {
    this._syncSteps();
  };

  protected firstUpdated(): void {
    this._syncSteps();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (
      changed.has('current') ||
      changed.has('status') ||
      changed.has('type') ||
      changed.has('direction') ||
      changed.has('size') ||
      changed.has('clickable')
    ) {
      this._syncSteps();
    }
  }

  protected render() {
    return html`
      <div
        class="semi-steps semi-steps-${this.direction} semi-steps-${this.type}"
        part="steps"
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  static styles = stepsStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-steps': SemiSteps;
  }
}
