import { Size } from "../_utils/constant";
import { Slots } from '../_utils/dom';
import { createContext } from "@lit/context";

export const RADIO_TYPES = ['radio', 'button'] as const;
export type RadioType = typeof RADIO_TYPES[number];

export interface RadioGroupContext {
  name: 'ArcoRadioGroup';
  value: string | number | boolean;
  size: Size;
  type: RadioType;
  disabled: boolean;
  slots: Slots;
  handleChange: (value: string | number | boolean, e: Event) => void;
}

export const radioGroupContextKey = Symbol('ArcoRadioGroup');

export const radioGroupContext = createContext<RadioGroupContext>(radioGroupContextKey);
