import { unsafeCSS } from "lit";

export const prefix = unsafeCSS('arco');

export const fontFamily = unsafeCSS('Inter, "-apple-system", BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif');

export const codeFamily = unsafeCSS('Consolas, Menlo');

// global font size
export const fontSizeBody = unsafeCSS('14px');

export const transitionDuration1 = unsafeCSS('0.1s');
export const transitionDuration2 = unsafeCSS('0.2s');
export const transitionDuration3 = unsafeCSS('0.3s');
export const transitionDuration4 = unsafeCSS('0.4s');
export const transitionDuration5 = unsafeCSS('0.5s');
export const transitionDurationLoading = unsafeCSS('1s');

// 线性
export const transitionTimingFunctionLinear = unsafeCSS('cubic-bezier(0, 0, 1, 1)');
// 标准
export const transitionTimingFunctionStandard = unsafeCSS('cubic-bezier(0.34, 0.69, 0.1, 1)');
// 过冲
export const transitionTimingFunctionOvershoot = unsafeCSS('cubic-bezier(0.3, 1.3, 0.3, 1)');
// 减速
export const transitionTimingFunctionDecelerate = unsafeCSS('cubic-bezier(0.4, 0.8, 0.74, 1)');
// 加速
export const transitionTimingFunctionAccelerate = unsafeCSS('cubic-bezier(0.26, 0, 0.6, 0.2)');

export const zIndexPopupBase = unsafeCSS(1000);
// @z-index-affix: @z-index-popup-base - 1; // 999
// @z-index-popup: @z-index-popup-base; // 1000
// @z-index-drawer: @z-index-popup-base + 1; // 1001
// @z-index-modal: @z-index-drawer; // 1001
// @z-index-message: @z-index-popup-base + 3; // 1003
// @z-index-notification: @z-index-popup-base + 3; // 1003
// @z-index-image-preview: @z-index-modal; // 1001

export const lineHeightBase = unsafeCSS(1.5715);

// @popup-box-shadow-base: @shadow1-down;