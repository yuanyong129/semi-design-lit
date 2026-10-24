import { TemplateResult } from 'lit';

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  divider?: boolean;
  icon?: TemplateResult;
}
