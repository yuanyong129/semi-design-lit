import { createContext } from "@lit/context";

export type RadioType = 'default' | 'button' | 'card';
export type RadioButtonStyle = 'solid' | 'outline';

export interface RadioGroupContext {
  name: 'SemiRadioGroup';
  inputName?: string;
  value: string | number | boolean;
  type: RadioType;
  buttonStyle: RadioButtonStyle;
  disabled: boolean;
  handleChange: (value: string | number | boolean, e: Event) => void;
}

export const radioGroupContextKey = Symbol('SemiRadioGroup');

export const radioGroupContext = createContext<RadioGroupContext>(radioGroupContextKey);
