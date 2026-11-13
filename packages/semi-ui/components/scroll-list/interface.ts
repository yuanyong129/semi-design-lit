export type ScrollListMode = 'normal' | 'wheel';

export interface ScrollListItemData {
  value: string | number;
  text?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface ScrollListSelectDetail {
  item: ScrollListItemData;
  index: number;
}
