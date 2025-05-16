import componentStyle from '../../style/theme/component';
import { arcoCssvarsPrefix, BorderSize, globalCss, Radius, FontSize, Spaceing, Size, FontWeight } from '../../style/theme';
import { ColorTransparent } from '../../style/theme/global';

export default {
  ['radio-color-border']: `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  ['radio-border-width']: BorderSize['border-2'],
  ['radio-layout-height']: '14px',
  ['radio-color-border_hover'] : `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  ['radio-color-border_disabled'] : `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  ['radio-color-bg'] : `var(${arcoCssvarsPrefix}-color-bg-2)`,
  ['radio-color-bg_checked'] : globalCss['color-primary-6'],
  ['radio-border-radius'] : Radius.radiusCircle,
  ['radio-color-bg_disabled'] : `var(${arcoCssvarsPrefix}-color-fill-2)`,
  ['radio-color-bg_checked_disabled'] : `var(${arcoCssvarsPrefix}-color-primary-light-3)`,
  get ['radio-color-dot-bg_checked_disabled'] () { return this['radio-color-bg_disabled'] },

  ['radio-color-text'] : `var(${arcoCssvarsPrefix}-color-text-1)`,
  ['radio-color-text_disabled'] : `var(${arcoCssvarsPrefix}-color-text-4)`,
  ['radio-color-text_checked_disabled'] : `var(${arcoCssvarsPrefix}-color-text-4)`,
  ['radio-font-text-size'] : FontSize.fontSizeBody3,
  ['radio-font-text-size_large'] : FontSize.fontSizeBody3,
  ['radio-font-text-size_mini'] : FontSize['font-size-body-1'],
  ['radio-font-text-size_small'] : FontSize.fontSizeBody3,
  ['radio-margin-text-left'] : Spaceing['@spacing-4'],

  ['radio-size-mask-height'] : Size.size6,
  ['radio-mask-bg-color-bg'] : componentStyle['icon-hover-color-bg'],
  ['radio-group-margin-right'] : Spaceing['@spacing-8'],
  ['radio-group-button-color-bg']: `var(${arcoCssvarsPrefix}-color-fill-2)`,
  ['radio-button-padding-horizontal']: Spaceing['@spacing-6'],
  ['radio-button-spacing']: '3px',
  ['radio-button-color-bg_active']: `var(${arcoCssvarsPrefix}-color-bg-5)`,
  get ['radio-button-color-bg_hover'] () { return this['radio-button-color-bg_active'] },
  ['radio-button-color-text_active']: globalCss['color-primary-6'],
  ['radio-button-font-text-weight_active']: FontWeight.fontWeight500,
  get ['radio-button-color-text_hover'] () { return this['radio-color-text'] },

  ['radio-button-border-radius']: Radius.radiusSmall,
  get ['radio-button-bg-border-radius'] () { return this['radio-button-border-radius'] },

  ['radio-button-color-bg']: ColorTransparent,
  ['radio-button-color-text']: `var(${arcoCssvarsPrefix}-color-text-2)`,

  ['radio-button-color-bg_disabled']: ColorTransparent,
  ['radio-button-color-text_disabled']: `var(${arcoCssvarsPrefix}-color-text-4)`,
  get ['radio-button-color-bg_checked_disabled']() { return this['radio-button-color-bg_active'] },
  ['radio-button-color-text_checked_disabled']: `var(${arcoCssvarsPrefix}-color-primary-light-3)`,

  ['radio-button-color-separator-bg']: `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  ['radio-button-size-separator-width']: `1px`,
  ['radio-button-size-separator-height']: '14px',

  ['radio-size-default-height']: Size['size-default'],
  ['radio-size-small-height']: Size['size-small'],
  ['radio-size-mini-height']: Size['size-mini'],
  ['radio-size-large-height']: Size['size-large'],
  ['radio-group-size-line-height_vertical']: Size.size8,
}
