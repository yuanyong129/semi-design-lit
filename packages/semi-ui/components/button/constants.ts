export const BUTTON_TYPES = [
  'primary',
  'secondary',
  'tertiary',
  'warning',
  'danger',
] as const;
export type ButtonTypes = typeof BUTTON_TYPES[number];

export const BUTTON_THEMES = [
  'solid',
  'borderless',
  'light',
  'outline',
] as const;
export type ButtonTheme = typeof BUTTON_THEMES[number];
