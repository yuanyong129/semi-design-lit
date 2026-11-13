export type TimePickerType = 'time' | 'timeRange';

export type TimePickerSize = 'small' | 'default' | 'large';

export type TimePickerValidateStatus = 'default' | 'warning' | 'error' | 'success';

export type TimePickerValue = string | number | Date;

export type TimePickerDisabledHours = () => number[];

export type TimePickerDisabledMinutes = (hour: number) => number[];

export type TimePickerDisabledSeconds = (hour: number, minute: number) => number[];

export interface TimePickerChangeDetail {
  value: string | string[];
  date: Date | Date[];
}

export interface TimePickerOpenChangeDetail {
  open: boolean;
}

export interface TimePickerClearDetail {
  value: string;
  event: MouseEvent;
}

export interface TimePickerPanelSelectDetail {
  date: Date;
  index: number;
}
