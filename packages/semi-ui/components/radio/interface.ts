import { RenderContent } from '../_utils/types';
import { RadioType, RadioButtonStyle } from './context';

export interface RadioOption {
  label: RenderContent;
  value: string | number | boolean;
  disabled?: boolean;
}

export type { RadioType, RadioButtonStyle };
