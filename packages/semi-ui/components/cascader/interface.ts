import type { TemplateResult } from 'lit';

export type CascaderValue = string | number;
export type CascaderPath = CascaderValue[];
export type CascaderValueType = CascaderValue | CascaderPath | CascaderPath[];
export type CascaderSize = 'small' | 'default' | 'large';
export type CascaderValidateStatus = 'default' | 'error' | 'warning' | 'success';
export type CascaderCheckRelation = 'related' | 'unRelated';
export type CascaderSearchPosition = 'trigger' | 'custom';

export interface CascaderData {
  value: CascaderValue;
  label?: string | TemplateResult;
  children?: CascaderData[];
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  [key: string]: unknown;
}

export interface CascaderKeyMaps {
  value?: string;
  label?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
}

export type CascaderFilterTreeNode =
  | boolean
  | ((inputValue: string, treeNodeString: string, data?: CascaderData) => boolean);

export type CascaderDisplayRender = (
  selected: string[] | CascaderData[],
  index?: number
) => string | TemplateResult;

export interface CascaderChangeDetail {
  value: CascaderValueType | [];
}

export interface CascaderSelectDetail {
  value: CascaderPath;
  option: CascaderData;
  selectedOptions: CascaderData[];
}

export interface CascaderSearchDetail {
  value: string;
}

export interface CascaderOpenChangeDetail {
  open: boolean;
}

export interface CascaderExceedDetail {
  checkedItems: CascaderData[];
}

export interface CascaderLoadDetail {
  loadedKeys: Set<string>;
  data: CascaderData;
}
