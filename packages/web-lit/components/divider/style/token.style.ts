import { arcoCssvarsPrefix, BorderStyle, FontSize, FontWeight, Spaceing } from "../../style/theme";

export default {
  ['divider-margin-horizontal']: Spaceing["@spacing-6"],
  ['divider-margin-vertical']: Spaceing["@spacing-8"],
  ['divider-margin-vertical_text']: Spaceing["@spacing-8"],
  ['divider-margin-text']: Spaceing["@spacing-7"],
  ['divider-position-text-left']: Spaceing["@spacing-9"],
  ['divider-position-text-right']: Spaceing["@spacing-9"],
  ['divider-font-size']: FontSize.fontSizeBody3,
  ['divider-font-weight']: FontWeight.fontWeight500,

  ['divider-size']: '1px',
  ['divider-line-style']: BorderStyle["border-solid"],
  ['divider-color-bg']: `var(${arcoCssvarsPrefix}-color-neutral-3)`,
  ['divider-color-text']: `var(${arcoCssvarsPrefix}-color-text-1)`,
}
