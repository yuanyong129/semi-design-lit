export type AnchorSize = 'small' | 'default';
export type AnchorRailTheme = 'primary' | 'tertiary' | 'muted';
export type AnchorPosition =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTopOver'
  | 'rightTopOver';

export interface AnchorItem {
  href: string;
  title: string;
  disabled?: boolean;
  children?: AnchorItem[];
}

export interface AnchorChangeDetail {
  currentLink: string;
  previousLink: string;
  event?: Event;
}
