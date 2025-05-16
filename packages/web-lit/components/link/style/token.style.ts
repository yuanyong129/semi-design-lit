import { lineHeightBase, globalCss } from '../../style/theme/index';
import { FontSize, Radius, Size, Spaceing } from "../../style/theme/global";

export const linkFontSize = FontSize.fontSizeBody3;
export const linkColorBg_hover = 'var(--color-fill-2)';
export const linkColorBg_active = 'var(--color-fill-3)';
export const linkPaddingHorizontal = Spaceing['@spacing-2'];
export const linkLineHeight = lineHeightBase;

export const linkColorText = globalCss['color-link-6'];
export const linkColorText_hover = linkColorText;
export const linkColorText_active = linkColorText;
export const linkColorText_disabled = 'var(--color-link-light-3)';
export const linkColorText_loading = 'var(--color-link-light-3)';

export const linkColorText_success = globalCss['color-success-6'];
export const linkColorText_success_hover = linkColorText_success;
export const linkColorText_success_active = linkColorText_success;
export const linkColorText_success_disabled = 'var(--color-success-light-3)';
export const linkColorText_success_loading = 'var(--color-success-light-3)';

export const linkColorText_error = globalCss['color-danger-6'];
export const linkColorText_error_active = linkColorText_error;
export const linkColorText_error_hover = linkColorText_error;
export const linkColorText_error_disabled = 'var(--color-danger-light-3)';
export const linkColorText_error_loading = 'var(--color-danger-light-3)';

export const linkColorText_warning = globalCss['color-warning-6'];
export const linkColorText_warning_hover = linkColorText_warning;
export const linkColorText_warning_active = linkColorText_warning;
export const linkColorText_warning_disabled = 'var(--color-warning-light-2)';
export const linkColorText_warning_loading = 'var(--color-warning-light-2)';
export const linkMarginIconRight = Spaceing['@spacing-3'];

export const linkPaddingVertical = '1px';
export const linkSizeIcon = Size.size3;
export const linkBorderRadius = Radius.radiusSmall;