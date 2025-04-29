import { arcoCssvarsPrefix, Radius, Size } from "./global";

export default {
  /********* icon hover *********/
  'icon-hover-border-radius': Radius.radiusCircle,
  'icon-hover-color-bg': `var(${arcoCssvarsPrefix}-color-fill-2)`,

  'icon-hover-size-default-height': Size.size5,
  'icon-hover-size-small-height': Size.size5,
  'icon-hover-size-mini-height': Size.size5,
  'icon-hover-size-large-height': Size.size6,
  'icon-hover-size-huge-height': Size.size6,

  'icon-hover-size-small-icon': Size.size3,
  'icon-hover-size-mini-icon': Size.size3,
  'icon-hover-size-default-icon': Size.size3,
  'icon-hover-size-large-icon': Size.size3,
  'icon-hover-size-huge-icon': Size.size3,

  // vue overwrite token
  get 'icon-hover-size-medium-height' () {
    return this['icon-hover-size-default-height'];
  },
  get 'icon-hover-size-medium-icon'() {
    return this['icon-hover-size-default-icon']
  }
}