export type StepStatus = 'wait' | 'process' | 'finish' | 'error' | 'warning';

export type StepsType = 'basic' | 'nav' | 'dot';

export type StepsDirection = 'horizontal' | 'vertical';

export type StepsSize = 'small' | 'default';

export interface StepChangeDetail {
  current: number;
  step: HTMLElement;
}
