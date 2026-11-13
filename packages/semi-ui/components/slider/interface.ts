import { TemplateResult } from 'lit';

export type SliderValue = number | number[];

export type SliderMarkContent = string | number | TemplateResult;

export type SliderMarks = Record<string | number, SliderMarkContent>;

export interface SliderHandleDot {
  size?: string;
  color?: string;
}

export interface SliderChangeDetail {
  value: SliderValue;
}

export interface SliderChangeCompleteDetail {
  value: SliderValue;
}

export type SliderAriaValueText = (value: number, index: number) => string;
