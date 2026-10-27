import { TemplateResult } from 'lit';

export type TreeNodeKey = string | number;

export interface TreeNode {
  key: TreeNodeKey;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  icon?: TemplateResult;
}
