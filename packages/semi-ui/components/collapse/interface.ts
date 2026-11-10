export type CollapseActiveKey = string | string[];

export type CollapseExpandIconPosition = 'left' | 'right';

export interface CollapseChangeDetail {
  activeKey: CollapseActiveKey;
  keys: string[];
}
