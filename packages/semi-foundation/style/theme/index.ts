import { unsafeCSS } from "lit";
export {
  semiThemeTag,
  semiVarsPrefix,
  semiCssvarsPrefix,
  BorderSize,
  BorderStyle,
  Size,
  Spaceing,
  ColorTransparent,
  FontSize,
  FontWeight,
  Radius,
  default as globalCss,
} from './global';

export const prefix = 'semi';

export const fontFamily = unsafeCSS('Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif');

export const codeFamily = unsafeCSS('Consolas, Menlo, monospace');

// global font size
export const fontSizeBody = unsafeCSS('14px');

// Semi motions. The default Semi theme disables transitions, we keep a subtle
// duration so that hover / focus feedback stays visible in the docs.
export const transitionDuration1 = '0.1s';
export const transitionDuration2 = unsafeCSS('0.2s');
export const transitionDuration3 = unsafeCSS('0.3s');
export const transitionDuration4 = unsafeCSS('0.4s');
export const transitionDuration5 = unsafeCSS('0.5s');
export const transitionDurationLoading = unsafeCSS('1s');

// linear
export const transitionTimingFunctionLinear = 'cubic-bezier(0, 0, 1, 1)';
// standard
export const transitionTimingFunctionStandard = unsafeCSS('cubic-bezier(0.34, 0.69, 0.1, 1)');
// overshoot
export const transitionTimingFunctionOvershoot = unsafeCSS('cubic-bezier(0.3, 1.3, 0.3, 1)');
// decelerate
export const transitionTimingFunctionDecelerate = unsafeCSS('cubic-bezier(0.4, 0.8, 0.74, 1)');
// accelerate
export const transitionTimingFunctionAccelerate = unsafeCSS('cubic-bezier(0.26, 0, 0.6, 0.2)');

export const zIndexPopupBase = 1000;
export const zIndexAffix = zIndexPopupBase - 1;
export const zIndexPopup = zIndexPopupBase;
export const zIndexDrawer = zIndexPopupBase + 1;
export const zIndexModal = zIndexDrawer;
export const zIndexMessage = zIndexPopupBase + 3;
export const zIndexNotification = zIndexPopupBase + 3;
export const zIndexImagePreview = zIndexModal;

export const lineHeightBase = 1.5;
