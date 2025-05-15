import { createContext } from '@lit/context';
import { Size, Status } from '../_utils/constant';
import { ButtonTypes } from './constants';

export interface ButtonGroupContext {
  size: Size | undefined;
  status: Status | undefined;
  type: ButtonTypes | undefined;
  disabled: boolean;
  shape: 'square' | 'round' | 'circle' | undefined;
}

export const buttonGroupContextKey = Symbol('ArcoButtonGroup');

export const buttonGroupContext = createContext<ButtonGroupContext>(buttonGroupContextKey);
