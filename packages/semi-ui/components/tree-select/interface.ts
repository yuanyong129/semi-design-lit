import { TemplateResult } from 'lit';

export type TreeSelectValue = string | number;
export type TreeSelectSize = 'small' | 'default' | 'large';
export type TreeSelectValidateStatus = 'default' | 'error' | 'warning' | 'success';
export type TreeSelectCheckRelation = 'related' | 'unRelated';

export interface TreeSelectData {
  value: TreeSelectValue;
  label: string;
  children?: TreeSelectData[];
  disabled?: boolean;
  isLeaf?: boolean;
  [key: string]: unknown;
}

export interface TreeSelectKeyMaps {
  value?: string;
  label?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
}

export type TreeSelectFilterTreeNode =
  | boolean
  | ((inputValue: string, treeNodeString: string, data?: TreeSelectData) => boolean);

export type TreeSelectDisplayRender = (
  selected: string[],
  index?: number
) => string | TemplateResult;

export interface TreeSelectChangeDetail {
  value: TreeSelectValue | TreeSelectValue[] | TreeSelectData | TreeSelectData[] | undefined;
  selectedOptions: TreeSelectData[];
}

export interface TreeSelectSelectDetail {
  value: TreeSelectValue;
  option: TreeSelectData;
  selectedOptions: TreeSelectData[];
}

export interface TreeSelectSearchDetail {
  value: string;
}

export interface TreeSelectOpenChangeDetail {
  open: boolean;
}

export interface TreeSelectClearDetail {
  event: MouseEvent;
}

export interface TreeSelectExceedDetail {
  checkedItems: TreeSelectData[];
}

export interface TreeSelectLoadDetail {
  loadedKeys: TreeSelectValue[];
  data: TreeSelectData;
}
