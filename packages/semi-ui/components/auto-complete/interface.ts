export type AutoCompleteSize = 'small' | 'default' | 'large';

export type AutoCompleteValidateStatus = 'default' | 'error' | 'warning' | 'success';

export type AutoCompleteTrigger = 'focus' | 'click';

export interface AutoCompleteOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export type AutoCompleteDataItem = string | AutoCompleteOption;

export interface AutoCompleteChangeDetail {
  value: string;
}

export interface AutoCompleteSearchDetail {
  inputValue: string;
}

export interface AutoCompleteSelectDetail {
  value: string;
  item: AutoCompleteOption;
  event: MouseEvent | KeyboardEvent;
}

export interface AutoCompleteClearDetail {
  value: string;
  event: MouseEvent;
}

export interface AutoCompleteOpenChangeDetail {
  open: boolean;
}
