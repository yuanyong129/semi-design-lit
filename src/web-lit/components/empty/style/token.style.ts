import { arcoCssvarsPrefix, FontSize, Size, Spaceing } from "../../style/theme";

export default {
  ['@empty-spacing-padding']: Spaceing['@spacing-5'],
  ['@empty-color-text']: `rgb(var(${arcoCssvarsPrefix}-gray-5))`,
  ['@empty-font-size-image']: Size['@size-12'],
  ['@empty-spacing-image-margin-bottom']: Spaceing['@spacing-2'],
  ['@empty-size-img-height']: Size['@size-20'],

  ['@empty-color-icon']: `rgb(var(${arcoCssvarsPrefix}-gray-5))`,
  ['@empty-font-size-text']: FontSize.fontSizeBody3,
}