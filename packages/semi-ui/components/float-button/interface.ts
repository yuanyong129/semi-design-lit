export type FloatButtonShape = 'round' | 'square';

export type FloatButtonSize = 'small' | 'default' | 'large';

export type FloatButtonBadgeType = 'primary' | 'success' | 'warning' | 'danger';

export interface FloatButtonBadge {
  count?: number;
  dot?: boolean;
  overflowCount?: number;
  showZero?: boolean;
  type?: FloatButtonBadgeType;
}
