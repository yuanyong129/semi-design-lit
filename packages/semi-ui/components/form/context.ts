import { createContext } from '@lit/context';
import { Data } from '../_utils/types';
import {
  FieldData,
  FieldRule,
  FormItemEventHandler,
  ValidatedError,
  ValidateStatus,
} from './interface';
import { Size } from '../_utils/constant';

export type FormLayout = 'horizontal' | 'vertical';
export type FormLabelAlign = 'left' | 'right';
export type FormLabelPosition = 'top' | 'left';

export interface FormContext {
  layout: FormLayout;
  disabled?: boolean;
  labelAlign: FormLabelAlign;
  labelPosition: FormLabelPosition;
  labelWidth?: number | string;
  model: Data;
  size: Size;
  rules?: Record<string, FieldRule | FieldRule[]>;
  fields: FormItemInfo[];
  touchedFields: FormItemInfo[];
  addField: (field: FormItemInfo) => void;
  removeField: (field: FormItemInfo) => void;
  getFieldValue: (field: string) => any;
  getInitialValue: (field: string) => any;
  setFieldValue: (field: string, value: any, event?: Event) => void;
  validateField: (
    field: string | string[],
    callback?: (errors: undefined | Record<string, ValidatedError>) => void
  ) => Promise<undefined | Record<string, ValidatedError>>;
  validate: () => Promise<undefined | Record<string, ValidatedError>>;
  reset: () => void;
  id?: string;
}

export interface FormItemContext {
  eventHandlers: FormItemEventHandler;
  size: Size | undefined;
  disabled: boolean;
  error: boolean;
  feedback: string | undefined;
  updateValidateState: (
    field: string,
    { status, message }: { status: ValidateStatus | ''; message: string }
  ) => void;
}

export interface FormItemInfo {
  uid: number;
  field: string;
  label?: string;
  disabled: boolean;
  error: boolean;
  labelWidth?: number | string;
  validate: () => Promise<any>;
  clearValidate: () => void;
  resetField: () => void;
  setField: (data: FieldData) => void;
}

export const formItemInjectionKey = Symbol('SemiFormItemContext');
export const formInjectionKey = Symbol('SemiFormContext');

export const formItemInjectionContext = createContext<FormItemContext>(formItemInjectionKey);
export const formInjectionContext = createContext<FormContext>(formInjectionKey);
