/**
 * Semi Design global design tokens.
 *
 * The values mirror the default Semi Design theme:
 * https://semi.design/zh-CN/basic/tokens
 */

export const semiThemeTag = 'body'; // selector used to define css variables
export const semiVarsPrefix = 'semi';
export const semiCssvarsPrefix = '--semi';

/******** border size ********/
export const BorderSize = {
  'border-none': 0,
  'border-1': '1px',
  'border-2': '2px',
  'border-3': '3px',
  'border-4': '4px',
  'border-5': '5px',
};

/******** border style ********/
export const BorderStyle = {
  'border-solid': 'solid',
  'border-dashed': 'dashed',
  'border-dotted': 'dotted',
};

/******** radius ********/
export const Radius = {
  radiusNone: '0',
  radiusExtraSmall: 'var(--semi-border-radius-extra-small)', // 3px
  radiusSmall: 'var(--semi-border-radius-small)', // 3px
  radiusMedium: 'var(--semi-border-radius-medium)', // 6px
  radiusLarge: 'var(--semi-border-radius-large)', // 12px
  radiusCircle: 'var(--semi-border-radius-circle)',
  radiusFull: 'var(--semi-border-radius-full)',
};

/******** size ********/
export const Size = {
  size3: '12px',
  size4: '16px',
  size5: '20px',
  size6: '24px',
  size7: '28px',
  size8: '32px',
  size9: '36px',
  size10: '40px',
  size12: '48px',
  size16: '64px',
  size20: '80px',
  size24: '96px',

  get ['size-mini']() { return this.size6 },
  get ['size-small']() { return this.size6 },
  get ['size-default']() { return this.size8 },
  get ['size-medium']() { return this.size8 },
  get ['size-large']() { return this.size10 },
};

/******** spacing ********/
export const Spaceing = {
  '@spacing-none': 0,
  '@spacing-1': '2px',
  '@spacing-2': '4px',
  '@spacing-3': '6px',
  '@spacing-4': '8px',
  '@spacing-5': '10px',
  '@spacing-6': '12px',
  '@spacing-7': '16px',
  '@spacing-8': '20px',
  '@spacing-9': '24px',
  '@spacing-10': '32px',
  '@spacing-11': '36px',
  '@spacing-12': '40px',
  '@spacing-13': '48px',
  '@spacing-14': '56px',
  '@spacing-15': '60px',
  '@spacing-16': '64px',
  '@spacing-17': '72px',
  '@spacing-18': '80px',
  '@spacing-19': '84px',
  '@spacing-20': '96px',
  '@spacing-21': '100px',
  '@spacing-22': '120px',
};

export const ColorTransparent = 'transparent';

/******** font size ********/
export const FontSize = {
  fontSizeCaption: '12px',
  fontSizeSmall: '12px',
  fontSizeRegular: '14px',
  fontSizeMedium: '16px',
  fontSizeLarge: '20px',
  fontSizeTitle: '20px',
  fontSizeDisplay: '32px',
  fontSizeBody3: '14px',
  ['font-size-body-1']: '12px',
};

/******** font weight ********/
export const FontWeight = {
  fontWeight100: 100,
  fontWeight200: 200,
  fontWeight300: 300,
  fontWeight400: 400,
  fontWeight500: 500,
  fontWeight600: 600,
  fontWeight700: 700,
  fontWeight800: 800,
  fontWeight900: 900,
};

/**
 * Semantic colors exposed as css variables. Prefer these over palette values
 * so that dark mode keeps working.
 */
export const globalCss = {
  'color-transparent': 'transparent',
  'color-white': 'var(--semi-color-white)',
  'color-black': 'var(--semi-color-black)',

  'color-primary': 'var(--semi-color-primary)',
  'color-primary-hover': 'var(--semi-color-primary-hover)',
  'color-primary-active': 'var(--semi-color-primary-active)',
  'color-primary-disabled': 'var(--semi-color-primary-disabled)',
  'color-primary-light-default': 'var(--semi-color-primary-light-default)',
  'color-primary-light-hover': 'var(--semi-color-primary-light-hover)',
  'color-primary-light-active': 'var(--semi-color-primary-light-active)',

  'color-success': 'var(--semi-color-success)',
  'color-success-hover': 'var(--semi-color-success-hover)',
  'color-success-active': 'var(--semi-color-success-active)',
  'color-success-light-default': 'var(--semi-color-success-light-default)',

  'color-warning': 'var(--semi-color-warning)',
  'color-warning-hover': 'var(--semi-color-warning-hover)',
  'color-warning-active': 'var(--semi-color-warning-active)',
  'color-warning-light-default': 'var(--semi-color-warning-light-default)',

  'color-danger': 'var(--semi-color-danger)',
  'color-danger-hover': 'var(--semi-color-danger-hover)',
  'color-danger-active': 'var(--semi-color-danger-active)',
  'color-danger-light-default': 'var(--semi-color-danger-light-default)',
  'color-danger-light-hover': 'var(--semi-color-danger-light-hover)',

  'color-text-0': 'var(--semi-color-text-0)',
  'color-text-1': 'var(--semi-color-text-1)',
  'color-text-2': 'var(--semi-color-text-2)',
  'color-text-3': 'var(--semi-color-text-3)',

  'color-border': 'var(--semi-color-border)',
  'color-disabled-text': 'var(--semi-color-disabled-text)',
  'color-disabled-border': 'var(--semi-color-disabled-border)',
  'color-disabled-bg': 'var(--semi-color-disabled-bg)',

  'color-fill-0': 'var(--semi-color-fill-0)',
  'color-fill-1': 'var(--semi-color-fill-1)',
  'color-fill-2': 'var(--semi-color-fill-2)',

  'color-bg-0': 'var(--semi-color-bg-0)',
  'color-bg-1': 'var(--semi-color-bg-1)',
  'color-bg-2': 'var(--semi-color-bg-2)',
  'color-bg-3': 'var(--semi-color-bg-3)',
  'color-bg-4': 'var(--semi-color-bg-4)',
};

export default globalCss;
