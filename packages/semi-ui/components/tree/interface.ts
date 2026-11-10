import { TemplateResult } from 'lit';

export type TreeNodeKey = string | number;
export type TreeDropPosition = 'before' | 'after' | 'inside';

export interface TreeNode {
  key: TreeNodeKey;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  icon?: TemplateResult;
  isLeaf?: boolean;
}

export interface TreeDragInfo {
  node: TreeNode;
  event: DragEvent;
}

export interface TreeDropInfo {
  dragNode: TreeNode;
  dropNode: TreeNode;
  dropPosition: TreeDropPosition;
  event: DragEvent;
}
