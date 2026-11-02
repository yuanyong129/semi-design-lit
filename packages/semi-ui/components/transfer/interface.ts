export type TransferKey = string | number;
export type TransferDirection = 'left' | 'right';

export interface TransferItem {
  key: TransferKey;
  label: string;
  disabled?: boolean;
}

export interface TransferChangeDetail {
  targetKeys: TransferKey[];
  direction: TransferDirection;
  moveKeys: TransferKey[];
}
