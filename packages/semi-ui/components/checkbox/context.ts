import { createContext } from '@lit/context';

export interface CheckboxGroupContext {
  name: string;
  value: Array<string | number | boolean>;
  disabled?: boolean;
  handleChange: (value: string | number | boolean, checked: boolean, event: Event) => void;
}

export const checkboxGroupContext = createContext<CheckboxGroupContext>(
  Symbol('SemiCheckboxGroup')
);
