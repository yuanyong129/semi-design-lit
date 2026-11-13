export type NavItemKey = string | number;
export type NavMode = 'vertical' | 'horizontal';
export type NavIcon = unknown;
export type NavText = string | unknown;

export interface NavItem {
  itemKey?: NavItemKey;
  text?: NavText;
  icon?: NavIcon;
  items?: NavItem[];
  disabled?: boolean;
  link?: string;
  linkOptions?: Record<string, string>;
  className?: string;
  style?: Record<string, string | number>;
  toggleIcon?: NavIcon;
}

export interface NavHeader {
  logo?: NavIcon;
  text?: string;
  link?: string;
}

export interface NavFooter {
  collapseButton?: boolean;
  collapseText?: (collapsed: boolean) => string;
}

export interface NavSelectDetail {
  itemKey: NavItemKey;
  selectedKeys: NavItemKey[];
  selectedItems: NavItem[];
  domEvent: Event;
  isOpen: boolean;
}

export interface NavOpenChangeDetail {
  itemKey: NavItemKey;
  openKeys: NavItemKey[];
  domEvent: Event;
  isOpen: boolean;
}

export interface NavClickDetail {
  itemKey: NavItemKey;
  domEvent: Event;
  isOpen: boolean;
}

export interface NavCollapseChangeDetail {
  isCollapsed: boolean;
  domEvent?: Event;
}
