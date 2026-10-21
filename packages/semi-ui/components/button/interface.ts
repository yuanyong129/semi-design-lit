import { Size } from '../_utils/constant';
import { ButtonTheme, ButtonTypes } from './constants';

export interface ButtonProps {
  type?: ButtonTypes;
  theme?: ButtonTheme;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  htmlType?: string;
  autofocus?: boolean;
  href?: string;
  target?: string;
  iconPosition?: 'left' | 'right';
}
