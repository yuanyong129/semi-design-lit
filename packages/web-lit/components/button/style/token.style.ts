import { FontWeight, BorderSize, Radius, Size, Spaceing, FontSize, arcoCssvarsPrefix, globalCss, BorderStyle } from "../../style/theme";

const tokenStyle = {
  'btn-font-weight':  FontWeight.fontWeight400,
  'btn-border-width': BorderSize["border-1"],
  'btn-border-radius': Radius.radiusSmall,

  get 'btn-size-mini-radius'() { return this["btn-border-radius"] },
  get 'btn-size-small-radius'() { return this["btn-border-radius"] },
  get 'btn-size-default-radius'() { return this["btn-border-radius"] },
  get 'btn-size-large-radius'() { return this["btn-border-radius"] },

  'btn-size-mini-height': Size["size-mini"],
  'btn-size-small-height': Size["size-small"],
  'btn-size-default-height': Size["size-default"],
  'btn-size-large-height': Size["size-large"],

  get 'btn-size-mini-border-width'() { return this["btn-border-width"] },
  get 'btn-size-small-border-width'() { return this["btn-border-width"] },
  get 'btn-size-default-border-width'() { return this["btn-border-width"] },
  get 'btn-size-large-border-width'() { return this["btn-border-width"] },

  'btn-size-mini-icon-spacing': Spaceing["@spacing-2"],
  'btn-size-small-icon-spacing': Spaceing["@spacing-3"],
  'btn-size-default-icon-spacing': Spaceing["@spacing-4"],
  'btn-size-large-icon-spacing': Spaceing["@spacing-4"],

  'btn-size-mini-icon-vertical-align': '-1px',
  'btn-size-small-icon-vertical-align': '-2px',
  'btn-size-default-icon-vertical-align': '-2px',
  'btn-size-large-icon-vertical-align': '-2px',

  'btn-size-mini-padding-horizontal': '11px',
  'btn-size-small-padding-horizontal': '15px',
  'btn-size-default-padding-horizontal': '15px',
  'btn-size-large-padding-horizontal': '19px',

  'btn-size-mini-font-size': FontSize["font-size-body-1"],
  'btn-size-small-font-size': FontSize.fontSizeBody3,
  'btn-size-default-font-size': FontSize.fontSizeBody3,
  'btn-size-large-font-size': FontSize.fontSizeBody3,

 /***** Outline *****/
  'btn-outline-color-text': globalCss["color-primary-6"],
  'btn-outline-color-text_disabled': `var(
    ${arcoCssvarsPrefix}-color-primary-light-3
  )`,
  'btn-outline-color-text_hover': globalCss["color-primary-5"],
  'btn-outline-color-text_active': globalCss["color-primary-7"],
  'btn-outline-color-bg': globalCss["color-transparent"],
  'btn-outline-color-bg_disabled': globalCss["color-transparent"],
  'btn-outline-color-bg_hover': globalCss["color-transparent"],
  'btn-outline-color-bg_active': globalCss["color-transparent"],
  'btn-outline-color-border': globalCss["color-primary-6"],
  'btn-outline-color-border_disabled': `var(
    ${arcoCssvarsPrefix}-color-primary-light-3
  )`,
  'btn-outline-color-border_hover': globalCss["color-primary-5"],
  'btn-outline-color-border_active': globalCss["color-primary-7"],
  // status
  'btn-outline-color-text_warning': globalCss["color-warning-6"],
  'btn-outline-color-text_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-outline-color-text_warning_hover': globalCss["color-warning-5"],
  'btn-outline-color-text_warning_active': globalCss["color-warning-7"],
  'btn-outline-color-bg_warning': globalCss["color-transparent"],
  'btn-outline-color-bg_warning_disabled': globalCss["color-transparent"],
  'btn-outline-color-bg_warning_hover': globalCss["color-transparent"],
  'btn-outline-color-bg_warning_active': globalCss["color-transparent"],
  'btn-outline-color-border_warning': globalCss["color-warning-6"],
  'btn-outline-color-border_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-outline-color-border_warning_hover': globalCss["color-warning-5"],
  'btn-outline-color-border_warning_active': globalCss["color-warning-7"],

  'btn-outline-color-text_danger': globalCss["color-danger-6"],
  'btn-outline-color-text_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-outline-color-text_danger_hover': globalCss["color-danger-5"],
  'btn-outline-color-text_danger_active': globalCss["color-danger-7"],
  'btn-outline-color-bg_danger': globalCss["color-transparent"],
  'btn-outline-color-bg_danger_disabled': globalCss["color-transparent"],
  'btn-outline-color-bg_danger_hover': globalCss["color-transparent"],
  'btn-outline-color-bg_danger_active': globalCss["color-transparent"],
  'btn-outline-color-border_danger': globalCss["color-danger-6"],
  'btn-outline-color-border_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-outline-color-border_danger_hover': globalCss["color-danger-5"],
  'btn-outline-color-border_danger_active': globalCss["color-danger-7"],

  'btn-outline-color-text_success': globalCss["color-success-6"],
  'btn-outline-color-text_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-outline-color-text_success_hover': globalCss["color-success-5"],
  'btn-outline-color-text_success_active': globalCss["color-success-7"],
  'btn-outline-color-bg_success': globalCss["color-transparent"],
  'btn-outline-color-bg_success_disabled': globalCss["color-transparent"],
  'btn-outline-color-bg_success_hover': globalCss["color-transparent"],
  'btn-outline-color-bg_success_active': globalCss["color-transparent"],
  'btn-outline-color-border_success': globalCss["color-success-6"],
  'btn-outline-color-border_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-outline-color-border_success_hover': globalCss["color-success-5"],
  'btn-outline-color-border_success_active': globalCss["color-success-7"],
  // border
  'btn-outline-border-style': BorderStyle["border-solid"],

  /***** Primary *****/
  'btn-primary-color-text': '#fff',
  'btn-primary-color-text_disabled': '#fff',
  'btn-primary-color-text_hover': '#fff',
  'btn-primary-color-text_active': '#fff',
  'btn-primary-color-bg': globalCss["color-primary-6"],
  'btn-primary-color-bg_disabled': `var(
    ${arcoCssvarsPrefix}-color-primary-light-3
  )`,
  'btn-primary-color-bg_hover': globalCss["color-primary-5"],
  'btn-primary-color-bg_active': globalCss["color-primary-7"],
  'btn-primary-color-border': globalCss["color-transparent"],
  'btn-primary-color-border_disabled': globalCss["color-transparent"],
  'btn-primary-color-border_hover': globalCss["color-transparent"],
  'btn-primary-color-border_active': globalCss["color-transparent"],
  // status
  'btn-primary-color-text_warning': '#fff',
  'btn-primary-color-text_warning_disabled': '#fff',
  'btn-primary-color-text_warning_hover': '#fff',
  'btn-primary-color-text_warning_active': '#fff',
  'btn-primary-color-bg_warning': globalCss["color-warning-6"],
  'btn-primary-color-bg_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-primary-color-bg_warning_hover': globalCss["color-warning-5"],
  'btn-primary-color-bg_warning_active': globalCss["color-warning-7"],
  'btn-primary-color-border_warning': globalCss["color-transparent"],
  'btn-primary-color-border_warning_disabled': globalCss["color-transparent"],
  'btn-primary-color-border_warning_hover': globalCss["color-transparent"],
  'btn-primary-color-border_warning_active': globalCss["color-transparent"],

  'btn-primary-color-text_danger': '#fff',
  'btn-primary-color-text_danger_disabled': '#fff',
  'btn-primary-color-text_danger_hover': '#fff',
  'btn-primary-color-text_danger_active': '#fff',
  'btn-primary-color-bg_danger': globalCss["color-danger-6"],
  'btn-primary-color-bg_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-primary-color-bg_danger_hover': globalCss["color-danger-5"],
  'btn-primary-color-bg_danger_active': globalCss["color-danger-7"],
  'btn-primary-color-border_danger': globalCss["color-transparent"],
  'btn-primary-color-border_danger_disabled': globalCss["color-transparent"],
  'btn-primary-color-border_danger_hover': globalCss["color-transparent"],
  'btn-primary-color-border_danger_active': globalCss["color-transparent"],

  'btn-primary-color-text_success': '#fff',
  'btn-primary-color-text_success_disabled': '#fff',
  'btn-primary-color-text_success_hover': '#fff',
  'btn-primary-color-text_success_active': '#fff',
  'btn-primary-color-bg_success': globalCss["color-success-6"],
  'btn-primary-color-bg_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-primary-color-bg_success_hover': globalCss["color-success-5"],
  'btn-primary-color-bg_success_active': globalCss["color-success-7"],
  'btn-primary-color-border_success': globalCss["color-transparent"],
  'btn-primary-color-border_success_disabled': globalCss["color-transparent"],
  'btn-primary-color-border_success_hover': globalCss["color-transparent"],
  'btn-primary-color-border_success_active': globalCss["color-transparent"],
  // border
  'btn-primary-border-style': BorderStyle["border-solid"],

  /***** Secondary *****/
  'btn-secondary-color-text': `var(${arcoCssvarsPrefix}-color-text-2)`,
  'btn-secondary-color-text_disabled': `var(${arcoCssvarsPrefix}-color-text-4)`,
  'btn-secondary-color-text_hover': `var(${arcoCssvarsPrefix}-color-text-2)`,
  'btn-secondary-color-text_active': `var(${arcoCssvarsPrefix}-color-text-2)`,
  'btn-secondary-color-bg': `var(${arcoCssvarsPrefix}-color-secondary)`,
  'btn-secondary-color-bg_disabled': `var(
    ${arcoCssvarsPrefix}-color-secondary-disabled
  )`,
  'btn-secondary-color-bg_hover': `var(
    ${arcoCssvarsPrefix}-color-secondary-hover
  )`,
  'btn-secondary-color-bg_active': `var(
    ${arcoCssvarsPrefix}-color-secondary-active
  )`,
  'btn-secondary-color-border': globalCss["color-transparent"],
  'btn-secondary-color-border_disabled': globalCss["color-transparent"],
  'btn-secondary-color-border_hover': globalCss["color-transparent"],
  'btn-secondary-color-border_active': globalCss["color-transparent"],
  // status
  'btn-secondary-color-text_warning': globalCss["color-warning-6"],
  'btn-secondary-color-text_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-secondary-color-text_warning_hover': globalCss["color-warning-6"],
  'btn-secondary-color-text_warning_active': globalCss["color-warning-6"],
  'btn-secondary-color-bg_warning': `var(
    ${arcoCssvarsPrefix}-color-warning-light-1
  )`,
  'btn-secondary-color-bg_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-1
  )`,
  'btn-secondary-color-bg_warning_hover': `var(
    ${arcoCssvarsPrefix}-color-warning-light-2
  )`,
  'btn-secondary-color-bg_warning_active': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-secondary-color-border_warning': globalCss["color-transparent"],
  'btn-secondary-color-border_warning_disabled': globalCss["color-transparent"],
  'btn-secondary-color-border_warning_hover': globalCss["color-transparent"],
  'btn-secondary-color-border_warning_active': globalCss["color-transparent"],

  'btn-secondary-color-text_danger': globalCss["color-danger-6"],
  'btn-secondary-color-text_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-secondary-color-text_danger_hover': globalCss["color-danger-6"],
  'btn-secondary-color-text_danger_active': globalCss["color-danger-6"],
  'btn-secondary-color-bg_danger': `var(
    ${arcoCssvarsPrefix}-color-danger-light-1
  )`,
  'btn-secondary-color-bg_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-1
  )`,
  'btn-secondary-color-bg_danger_hover': `var(
    ${arcoCssvarsPrefix}-color-danger-light-2
  )`,
  'btn-secondary-color-bg_danger_active': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-secondary-color-border_danger': globalCss["color-transparent"],
  'btn-secondary-color-border_danger_disabled': globalCss["color-transparent"],
  'btn-secondary-color-border_danger_hover': globalCss["color-transparent"],
  'btn-secondary-color-border_danger_active': globalCss["color-transparent"],

  'btn-secondary-color-text_success': globalCss["color-success-6"],
  'btn-secondary-color-text_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-secondary-color-text_success_hover': globalCss["color-success-6"],
  'btn-secondary-color-text_success_active': globalCss["color-success-6"],
  'btn-secondary-color-bg_success': `var(
    ${arcoCssvarsPrefix}-color-success-light-1
  )`,
  'btn-secondary-color-bg_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-1
  )`,
  'btn-secondary-color-bg_success_hover': `var(
    ${arcoCssvarsPrefix}-color-success-light-2
  )`,
  'btn-secondary-color-bg_success_active': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-secondary-color-border_success': globalCss["color-transparent"],
  'btn-secondary-color-border_success_disabled': globalCss["color-transparent"],
  'btn-secondary-color-border_success_hover': globalCss["color-transparent"],
  'btn-secondary-color-border_success_active': globalCss["color-transparent"],
  // border
  'btn-secondary-border-style': BorderStyle["border-solid"],

  /***** Dashed *****/
  'btn-dashed-color-text': `var(${arcoCssvarsPrefix}-color-text-2)`,
  'btn-dashed-color-text_disabled': `var(${arcoCssvarsPrefix}-color-text-4)`,
  'btn-dashed-color-text_hover': `var(${arcoCssvarsPrefix}-color-text-2)`,
  'btn-dashed-color-text_active': `var(${arcoCssvarsPrefix}-color-text-2)`,
  'btn-dashed-color-bg': `var(${arcoCssvarsPrefix}-color-fill-2)`,
  'btn-dashed-color-bg_disabled': `var(${arcoCssvarsPrefix}-color-fill-2)`,
  'btn-dashed-color-bg_hover': `var(${arcoCssvarsPrefix}-color-fill-3)`,
  'btn-dashed-color-bg_active': `var(${arcoCssvarsPrefix}-color-fill-4)`,
  'btn-dashed-color-border': `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  'btn-dashed-color-border_disabled': `var(
    ${arcoCssvarsPrefix}-color-neutral-3
  )`,
  'btn-dashed-color-border_hover': `var(${arcoCssvarsPrefix}-color-neutral-4)`,
  'btn-dashed-color-border_active': `var(${arcoCssvarsPrefix}-color-neutral-5)`,
  // status
  'btn-dashed-color-text_warning': globalCss["color-warning-6"],
  'btn-dashed-color-text_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-dashed-color-text_warning_hover': globalCss["color-warning-6"],
  'btn-dashed-color-text_warning_active': globalCss["color-warning-6"],
  'btn-dashed-color-bg_warning': `var(
    ${arcoCssvarsPrefix}-color-warning-light-1
  )`,
  'btn-dashed-color-bg_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-1
  )`,
  'btn-dashed-color-bg_warning_hover': `var(
    ${arcoCssvarsPrefix}-color-warning-light-2
  )`,
  'btn-dashed-color-bg_warning_active': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-dashed-color-border_warning': `var(
    ${arcoCssvarsPrefix}-color-warning-light-2
  )`,
  'btn-dashed-color-border_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-2
  )`,
  'btn-dashed-color-border_warning_hover': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-dashed-color-border_warning_active': `var(
    ${arcoCssvarsPrefix}-color-warning-light-4
  )`,

  'btn-dashed-color-text_danger': globalCss["color-danger-6"],
  'btn-dashed-color-text_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-dashed-color-text_danger_hover': globalCss["color-danger-6"],
  'btn-dashed-color-text_danger_active': globalCss["color-danger-6"],
  'btn-dashed-color-bg_danger': `var(
    ${arcoCssvarsPrefix}-color-danger-light-1
  )`,
  'btn-dashed-color-bg_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-1
  )`,
  'btn-dashed-color-bg_danger_hover': `var(
    ${arcoCssvarsPrefix}-color-danger-light-2
  )`,
  'btn-dashed-color-bg_danger_active': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-dashed-color-border_danger': `var(
    ${arcoCssvarsPrefix}-color-danger-light-2
  )`,
  'btn-dashed-color-border_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-2
  )`,
  'btn-dashed-color-border_danger_hover': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-dashed-color-border_danger_active': `var(
    ${arcoCssvarsPrefix}-color-danger-light-4
  )`,

  'btn-dashed-color-text_success': globalCss["color-success-6"],
  'btn-dashed-color-text_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-dashed-color-text_success_hover': globalCss["color-success-6"],
  'btn-dashed-color-text_success_active': globalCss["color-success-6"],
  'btn-dashed-color-bg_success': `var(
    ${arcoCssvarsPrefix}-color-success-light-1
  )`,
  'btn-dashed-color-bg_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-1
  )`,
  'btn-dashed-color-bg_success_hover': `var(
    ${arcoCssvarsPrefix}-color-success-light-2
  )`,
  'btn-dashed-color-bg_success_active': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-dashed-color-border_success': `var(
    ${arcoCssvarsPrefix}-color-success-light-2
  )`,
  'btn-dashed-color-border_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-2
  )`,
  'btn-dashed-color-border_success_hover': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-dashed-color-border_success_active': `var(
    ${arcoCssvarsPrefix}-color-success-light-4
  )`,
  // border
  'btn-dashed-border-style': BorderStyle["border-dashed"],

  /***** Text *****/
  'btn-text-color-text': globalCss["color-primary-6"],
  'btn-text-color-text_disabled': `var(
    ${arcoCssvarsPrefix}-color-primary-light-3
  )`,
  'btn-text-color-text_hover': globalCss["color-primary-6"],
  'btn-text-color-text_active': globalCss["color-primary-6"],
  'btn-text-color-bg': globalCss["color-transparent"],
  'btn-text-color-bg_disabled': globalCss["color-transparent"],
  'btn-text-color-bg_hover': `var(${arcoCssvarsPrefix}-color-fill-2)`,
  'btn-text-color-bg_active': `var(${arcoCssvarsPrefix}-color-fill-3)`,
  'btn-text-color-border': globalCss["color-transparent"],
  'btn-text-color-border_disabled': globalCss["color-transparent"],
  'btn-text-color-border_hover': globalCss["color-transparent"],
  'btn-text-color-border_active': globalCss["color-transparent"],
  // status
  'btn-text-color-text_warning': globalCss["color-warning-6"],
  'btn-text-color-text_warning_disabled': `var(
    ${arcoCssvarsPrefix}-color-warning-light-3
  )`,
  'btn-text-color-text_warning_hover': globalCss["color-warning-6"],
  'btn-text-color-text_warning_active': globalCss["color-warning-6"],
  'btn-text-color-bg_warning': globalCss["color-transparent"],
  'btn-text-color-bg_warning_disabled': globalCss["color-transparent"],
  'btn-text-color-bg_warning_hover': `var(${arcoCssvarsPrefix}-color-fill-2)`,
  'btn-text-color-bg_warning_active': `var(${arcoCssvarsPrefix}-color-fill-3)`,
  'btn-text-color-border_warning': globalCss["color-transparent"],
  'btn-text-color-border_warning_disabled': globalCss["color-transparent"],
  'btn-text-color-border_warning_hover': globalCss["color-transparent"],
  'btn-text-color-border_warning_active': globalCss["color-transparent"],

  'btn-text-color-text_danger': globalCss["color-danger-6"],
  'btn-text-color-text_danger_disabled': `var(
    ${arcoCssvarsPrefix}-color-danger-light-3
  )`,
  'btn-text-color-text_danger_hover': globalCss["color-danger-6"],
  'btn-text-color-text_danger_active': globalCss["color-danger-6"],
  'btn-text-color-bg_danger': globalCss["color-transparent"],
  'btn-text-color-bg_danger_disabled': globalCss["color-transparent"],
  'btn-text-color-bg_danger_hover': `var(${arcoCssvarsPrefix}-color-fill-2)`,
  'btn-text-color-bg_danger_active': `var(${arcoCssvarsPrefix}-color-fill-3)`,
  'btn-text-color-border_danger': globalCss["color-transparent"],
  'btn-text-color-border_danger_disabled': globalCss["color-transparent"],
  'btn-text-color-border_danger_hover': globalCss["color-transparent"],
  'btn-text-color-border_danger_active': globalCss["color-transparent"],

  'btn-text-color-text_success': globalCss["color-success-6"],
  'btn-text-color-text_success_disabled': `var(
    ${arcoCssvarsPrefix}-color-success-light-3
  )`,
  'btn-text-color-text_success_hover': globalCss["color-success-6"],
  'btn-text-color-text_success_active': globalCss["color-success-6"],
  'btn-text-color-bg_success': globalCss["color-transparent"],
  'btn-text-color-bg_success_disabled': globalCss["color-transparent"],
  'btn-text-color-bg_success_hover': `var(${arcoCssvarsPrefix}-color-fill-2)`,
  'btn-text-color-bg_success_active': `var(${arcoCssvarsPrefix}-color-fill-3)`,
  'btn-text-color-border_success': globalCss["color-transparent"],
  'btn-text-color-border_success_disabled': globalCss["color-transparent"],
  'btn-text-color-border_success_hover': globalCss["color-transparent"],
  'btn-text-color-border_success_active': globalCss["color-transparent"],
  // border
  'btn-text-border-style': BorderStyle["border-solid"],

  // vue overwrite token
  get 'btn-size-medium-radius'() { return this['btn-size-default-radius'] },
  get 'btn-size-medium-border-width'() { return this["btn-size-default-border-width"] },
  get 'btn-size-medium-icon-spacing'() { return this["btn-size-default-icon-spacing"] },
  get 'btn-size-medium-icon-vertical-align'() { return this["btn-size-default-icon-vertical-align"] },
  get 'btn-size-medium-padding-horizontal'() { return this["btn-size-default-padding-horizontal"] },
  get 'btn-size-medium-font-size'() { return this["btn-size-default-font-size"] },
  get 'btn-size-medium-height'() { return this["btn-size-default-height"] },

  /***** focus-visible *****/
  'btn-box-shadow-radius': '0.25em',
  'btn-primary-color-box-shadow': globalCss["color-primary-3"],
  'btn-outline-color-box-shadow':globalCss["color-primary-3"],
  'btn-secondary-color-box-shadow': globalCss["color-secondary-active"],
  'btn-dashed-color-box-shadow': globalCss["color-secondary-active"],
  'btn-text-color-box-shadow': globalCss["color-secondary-active"],
  'btn-color-box-shadow_warning': globalCss["color-warning-3"],
  'btn-color-box-shadow_danger': globalCss["color-danger-3"],
  'btn-color-box-shadow_success': globalCss["color-success-3"], 
};


export default tokenStyle;