import { createContext } from '@lit/context';
import { Size } from '../_utils/constant';
import { ButtonTheme, ButtonTypes } from './constants';

export interface ButtonGroupContext {
  size?: Size;
  theme?: ButtonTheme;
  type?: ButtonTypes;
  disabled: boolean;
}

export const buttonGroupContextKey = Symbol('SemiButtonGroup');

export const buttonGroupContext = createContext<ButtonGroupContext>(buttonGroupContextKey);
