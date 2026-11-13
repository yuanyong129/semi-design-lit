export type TagInputSize = 'large' | 'default' | 'small';

export type TagInputValidateStatus = 'success' | 'default' | 'error' | 'warning';

export type TagInputSeparator = string | string[] | null;

export type TagInputSplit = (originString: string, separators: TagInputSeparator) => string[];

export interface TagInputChangeDetail {
  value: string[];
}

export interface TagInputAddDetail {
  value: string[];
}

export interface TagInputRemoveDetail {
  value: string;
  index: number;
}

export interface TagInputInputChangeDetail {
  value: string;
  event?: Event;
}

export interface TagInputExceedDetail {
  value: string[];
}
