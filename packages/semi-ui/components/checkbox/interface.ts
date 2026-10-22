export type CheckboxValue = string | number | boolean;

export interface CheckboxOption {
  label: string;
  value: CheckboxValue;
  disabled?: boolean;
  indeterminate?: boolean;
}
