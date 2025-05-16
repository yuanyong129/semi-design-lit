export const arcoThemeTag = 'body'; // css 变量定义的选择器

export const arcoVarsPrefix = ''; // css 变量的前缀

export const arcoCssvarsPrefix = arcoVarsPrefix === '' ? '-' : `--${arcoVarsPrefix}`;

/******** borderSize *******/
export const BorderSize = {
  'border-none': 0,
  'border-1': '1px',
  'border-2': '2px',
  'border-3': '3px',
  'border-4': '4px',
  'border-5': '5px',
}


/******** borderStyle *******/
export const BorderStyle = {
  'border-solid': 'solid',
  'border-dashed': 'dashed',
  'border-dotted': 'dotted',
}

/******** size *******/
export const Size = {
  size3: '12px',
  size4: '16px',
  size5: '20px',
  size6: '24px',
  size7: '28px',
  size8: '32px',
  size9: '36px',
  size10: '40px',
  'size-12': '48px',
  'size-20': '80px',

  get ['size-mini']() { return this.size6 },
  get ['size-small']() { return this.size7 },
  get ['size-default']() { return this.size8 },
  get ['size-medium']() { return this.size8 },
  get ['size-large']() { return this.size9 }
}

/******** spacing *******/
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
}

export const ColorTransparent = 'transparent';

/******** fontSize *******/
export const FontSize = {
  fontSizeBody3: "14px",
  ['font-size-body-1']: '12px',
  fontSizeCaption: '12px',
}

/******** fontWeight ********/
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
}

export default {
  'color-transparent': 'transparent',

  /******** primary *******/
  'color-primary-1': `rgb(var(${arcoCssvarsPrefix}-primary-1))`,
  'color-primary-2': `rgb(var(${arcoCssvarsPrefix}-primary-2))`,
  'color-primary-3': `rgb(var(${arcoCssvarsPrefix}-primary-3))`,
  'color-primary-4': `rgb(var(${arcoCssvarsPrefix}-primary-4))`,
  'color-primary-5': `rgb(var(${arcoCssvarsPrefix}-primary-5))`,
  'color-primary-6': `rgb(var(${arcoCssvarsPrefix}-primary-6))`,
  'color-primary-7': `rgb(var(${arcoCssvarsPrefix}-primary-7))`,
  'color-primary-8': `rgb(var(${arcoCssvarsPrefix}-primary-8))`,
  'color-primary-9': `rgb(var(${arcoCssvarsPrefix}-primary-9))`,
  'color-primary-10': `rgb(var(${arcoCssvarsPrefix}-primary-10))`,

  /******** success *******/

  'color-success-1': `rgb(var(${arcoCssvarsPrefix}-success-1))`,
  'color-success-2': `rgb(var(${arcoCssvarsPrefix}-success-2))`,
  'color-success-3': `rgb(var(${arcoCssvarsPrefix}-success-3))`,
  'color-success-4': `rgb(var(${arcoCssvarsPrefix}-success-4))`,
  'color-success-5': `rgb(var(${arcoCssvarsPrefix}-success-5))`,
  'color-success-6': `rgb(var(${arcoCssvarsPrefix}-success-6))`,
  'color-success-7': `rgb(var(${arcoCssvarsPrefix}-success-7))`,
  'color-success-8': `rgb(var(${arcoCssvarsPrefix}-success-8))`,
  'color-success-9': `rgb(var(${arcoCssvarsPrefix}-success-9))`,
  'color-success-10': `rgb(var(${arcoCssvarsPrefix}-success-10))`,

  /******** warning *******/

  'color-warning-1': `rgb(var(${arcoCssvarsPrefix}-warning-1))`,
  'color-warning-2': `rgb(var(${arcoCssvarsPrefix}-warning-2))`,
  'color-warning-3': `rgb(var(${arcoCssvarsPrefix}-warning-3))`,
  'color-warning-4': `rgb(var(${arcoCssvarsPrefix}-warning-4))`,
  'color-warning-5': `rgb(var(${arcoCssvarsPrefix}-warning-5))`,
  'color-warning-6': `rgb(var(${arcoCssvarsPrefix}-warning-6))`,
  'color-warning-7': `rgb(var(${arcoCssvarsPrefix}-warning-7))`,
  'color-warning-8': `rgb(var(${arcoCssvarsPrefix}-warning-8))`,
  'color-warning-9': `rgb(var(${arcoCssvarsPrefix}-warning-9))`,
  'color-warning-10': `rgb(var(${arcoCssvarsPrefix}-warning-10))`,

  /******** danger *******/

  'color-danger-1': `rgb(var(${arcoCssvarsPrefix}-danger-1))`,
  'color-danger-2': `rgb(var(${arcoCssvarsPrefix}-danger-2))`,
  'color-danger-3': `rgb(var(${arcoCssvarsPrefix}-danger-3))`,
  'color-danger-4': `rgb(var(${arcoCssvarsPrefix}-danger-4))`,
  'color-danger-5': `rgb(var(${arcoCssvarsPrefix}-danger-5))`,
  'color-danger-6': `rgb(var(${arcoCssvarsPrefix}-danger-6))`,
  'color-danger-7': `rgb(var(${arcoCssvarsPrefix}-danger-7))`,
  'color-danger-8': `rgb(var(${arcoCssvarsPrefix}-danger-8))`,
  'color-danger-9': `rgb(var(${arcoCssvarsPrefix}-danger-9))`,
  'color-danger-10': `rgb(var(${arcoCssvarsPrefix}-danger-10))`,

  /******** link *******/

  'color-link-1': `rgb(var(${arcoCssvarsPrefix}-link-1))`,
  'color-link-2': `rgb(var(${arcoCssvarsPrefix}-link-2))`,
  'color-link-3': `rgb(var(${arcoCssvarsPrefix}-link-3))`,
  'color-link-4': `rgb(var(${arcoCssvarsPrefix}-link-4))`,
  'color-link-5': `rgb(var(${arcoCssvarsPrefix}-link-5))`,
  'color-link-6': `rgb(var(${arcoCssvarsPrefix}-link-6))`,
  'color-link-7': `rgb(var(${arcoCssvarsPrefix}-link-7))`,
  'color-link-8': `rgb(var(${arcoCssvarsPrefix}-link-8))`,
  'color-link-9': `rgb(var(${arcoCssvarsPrefix}-link-9))`,
  'color-link-10': `rgb(var(${arcoCssvarsPrefix}-link-10))`,


  'color-secondary': `var(${arcoCssvarsPrefix}-color-neutral-2)`,
  'color-secondary-hover': `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  'color-secondary-active': `var(${arcoCssvarsPrefix}-color-neutral-4)`,
  'color-secondary-disabled': `var(${arcoCssvarsPrefix}-color-neutral-1)`,
}


/******** radius *******/
export const Radius = {
  radiusNone: 'var(--border-radius-none)',
  radiusSmall: 'var(--border-radius-small)',
  radiusMedium: 'var(--border-radius-medium)',
  radiusLarge: 'var(--border-radius-large)',
  radiusCircle: 'var(--border-radius-circle)',
}

