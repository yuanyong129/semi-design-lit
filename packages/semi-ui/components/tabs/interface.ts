import { TemplateResult } from 'lit';

export interface TabItem {
  key: string;
  label: string;
  content?: string | TemplateResult;
  disabled?: boolean;
}
