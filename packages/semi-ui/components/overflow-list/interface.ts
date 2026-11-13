export type OverflowListRenderMode = 'collapse' | 'scroll';
export type OverflowListCollapseFrom = 'start' | 'end';

export interface OverflowItem {
  [key: string]: unknown;
}

export type OverflowListKey = string | number;

export interface OverflowListOverflowDetail {
  items: OverflowItem[];
}

export type OverflowListVisibleRenderer = (
  item: OverflowItem,
  index: number,
) => unknown;

export type OverflowListOverflowRenderer = (items: OverflowItem[]) => unknown;
