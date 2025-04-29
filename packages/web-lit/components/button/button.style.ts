import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../_utils/global-config";

export const prefixCls = getPrefixCls('btn');
const prefixClsCss = unsafeCSS(prefixCls);

const primary6 = unsafeCSS`color: rgb(var(--primary-6));`;
const bgPrimary6 = unsafeCSS`background-color: rgb(var(--primary-6));`;
const colorText2 = unsafeCSS`color: var(--color-text-2);`;
const colorFill2 = unsafeCSS`background-color: var(--color-fill-2);`;
const colorFill3 = unsafeCSS`background-color: var(--color-fill-3);`;
const colorFill4 = unsafeCSS`background-color: var(--color-fill-4);`;

/** 带状态的主要按钮样式 */
const primaryStatusStyles = ['success', 'warning', 'danger'].map((item) => css`
  .${prefixClsCss}-primary.${prefixClsCss}-status-${unsafeCSS(item)} {
    background-color: rgb(var(--${unsafeCSS(item)}-6));
  }
  .${prefixClsCss}-primary.${prefixClsCss}-status-${unsafeCSS(item)}:hover {
    background-color: rgb(var(--${unsafeCSS(item)}-5));
  }
  .${prefixClsCss}-primary.${prefixClsCss}-status-${unsafeCSS(item)}:active {
    background-color: rgb(var(--${unsafeCSS(item)}-7));
  }
`);

/** 带状态的次级按钮样式 */
const secondaryStatusStyles = ['success', 'warning', 'danger'].map(item => css`
  .${prefixClsCss}-secondary.${prefixClsCss}-status-${unsafeCSS(item)} {
    color: rgb(var(--${unsafeCSS(item)}-6));
    background-color: var(--color-${unsafeCSS(item)}-light-1);
  }
  .${prefixClsCss}-secondary.${prefixClsCss}-status-${unsafeCSS(item)}:hover {
    background-color: var(--color-${unsafeCSS(item)}-light-2);
  }
  .${prefixClsCss}-secondary.${prefixClsCss}-status-${unsafeCSS(item)}:active {
    background-color: var(--color-${unsafeCSS(item)}-light-3);
  }
`);

/** 带状态的虚线按钮样式 */
const dashedStatusStyles = ['success', 'warning', 'danger'].map(item => css`
  .${prefixClsCss}-dashed.${prefixClsCss}-status-${unsafeCSS(item)} {
    color: rgb(var(--${unsafeCSS(item)}-6));
    background-color: var(--color-${unsafeCSS(item)}-light-1);
    border-color: var(--color-${unsafeCSS(item)}-light-2);
  }
  .${prefixClsCss}-dashed.${prefixClsCss}-status-${unsafeCSS(item)}:hover {
    background-color: var(--color-${unsafeCSS(item)}-light-2);
    border-color: var(--color-${unsafeCSS(item)}-light-3);
  }
  .${prefixClsCss}-dashed.${prefixClsCss}-status-${unsafeCSS(item)}:active {
    background-color: var(--color-${unsafeCSS(item)}-light-3);
    border-color: var(--color-${unsafeCSS(item)}-light-4);
  }
`);

/** 带状态的文字按钮样式 */
const textStatusStyles = ['success', 'warning', 'danger'].map(item => css`
  .${prefixClsCss}-text.${prefixClsCss}-status-${unsafeCSS(item)} {
    color: rgb(var(--${unsafeCSS(item)}-6));
  }
`);


/** 按钮大小样式表 */
const btnSizeStyles = css`
  .${prefixClsCss}-size-mini {
    padding: 0 11px;
    height: 24px;
    border-radius: 2px;
    font-size: 12px;
  }
  .${prefixClsCss}-size-small {
    padding: 0 15px;
    height: 28px;
    border-radius: 2px;
    font-size: 14px;
  }
  .${prefixClsCss}-size-medium {
    font-size: 14px;
    padding: 0 15px;
    height: 32px;
    border-radius: 2px;
  }
  .${prefixClsCss}-size-large {
    padding: 0 19px;
    height: 36px;
    border-radius: 2px;
    font-size: 14px;
  }
`;

/** 普通按钮样式 */
const primaryBtnStyles = css`
  .${prefixClsCss}-primary {
    ${bgPrimary6}
    color: white;
    border: 1px solid transparent;
  }
  .${prefixClsCss}-primary:hover {
    background-color: rgb(var(--primary-5));
  }
  .${prefixClsCss}-primary:active {
    background-color: rgb(var(--primary-7));
  }
  ${primaryStatusStyles[0]}
  ${primaryStatusStyles[1]}
  ${primaryStatusStyles[2]}
`

/** 次级按钮样式 */
const secondaryBtnStyles = css`
  .${prefixClsCss}-secondary {
    ${colorText2}
    background-color: rgb(242, 243, 245);
    border: 1px solid transparent;
  }
  .${prefixClsCss}-secondary:hover {
    background-color: rgb(229, 230, 235);
    border-color: transparent;
  }
  .${prefixClsCss}-secondary:active {
    background-color: rgb(201, 205, 212);
    border-color: transparent;
  }
  ${secondaryStatusStyles[0]}
  ${secondaryStatusStyles[1]}
  ${secondaryStatusStyles[2]}
`;

const outlineStatusStyles = ['success', 'warning', 'danger'].map(item => css`
  .${prefixClsCss}-outline.${prefixClsCss}-status-${unsafeCSS(item)} {
    color: rgb(var(--${unsafeCSS(item)}-6));
    border-color: rgb(var(--${unsafeCSS(item)}-6));
  }
  .${prefixClsCss}-outline.${prefixClsCss}-status-${unsafeCSS(item)}:hover {
    color: rgb(var(--${unsafeCSS(item)}-5));
    border-color: rgb(var(--${unsafeCSS(item)}-5));
  }
  .${prefixClsCss}-outline.${prefixClsCss}-status-${unsafeCSS(item)}:active {
    color: rgb(var(--${unsafeCSS(item)}-7));
    border-color: rgb(var(--${unsafeCSS(item)}-7));
  }
`);

/** 边框按钮样式 */
const outlineBtnStyles = css`
  .${prefixClsCss}-outline  {
    ${primary6}
    background-color: transparent;
    border: 1px solid rgb(var(--primary-6));
  }
  .${prefixClsCss}-outline:hover {
    color: rgb(var(--primary-5));
    border-color: rgb(var(--primary-5));
  }

  .${prefixClsCss}-outline:active  {
    color: rgb(var(--primary-7));
    border-color: rgb(var(--primary-7));
  }

  ${outlineStatusStyles[0]}
  ${outlineStatusStyles[1]}
  ${outlineStatusStyles[2]}
`;


/** 虚线按钮样式 */
const dashedBtnStyles = css`
  .${prefixClsCss}-dashed {
    ${colorText2}
    ${colorFill2}
    border: 1px dashed var(--color-neutral-3);
  }
  .${prefixClsCss}-dashed:hover {
    ${colorFill3}
    border-color: var(--color-neutral-4);
  }
  .${prefixClsCss}-dashed:active {
    ${colorFill4}
    border-color: var(--color-neutral-5);
  }
  ${dashedStatusStyles[0]}
  ${dashedStatusStyles[1]}
  ${dashedStatusStyles[2]}
`;
/** 文字按钮样式 */
const textBtnStyles = css`
  .${prefixClsCss}-text {
    ${primary6}
    background-color: transparent;
    border: 1px solid transparent;
  }
  .${prefixClsCss}-text:hover {
    ${colorFill2}
    border-color: transparent;
  }
  .${prefixClsCss}-text:active {
    ${colorFill3}
    border-color: transparent;
  }
  ${textStatusStyles[0]}
  ${textStatusStyles[1]}
  ${textStatusStyles[2]}
`;

const iconStyles = css`
  .${prefixClsCss}-icon {
    font-size: 12px;
  }
`;

export const styles = css`
  .${prefixClsCss} {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-weight: 400;
    line-height: 1.5715;
    white-space: nowrap;
    outline: none;
    cursor: pointer;
    transition: all .1s cubic-bezier(0,0,1,1);
    user-select: none;
  }
  .${prefixClsCss}-long {
    display: flex;
    width: 100%;
  }
  ${ iconStyles }
  ${ btnSizeStyles }
  ${ primaryBtnStyles }
  ${ secondaryBtnStyles }
  ${ dashedBtnStyles }
  ${ outlineBtnStyles }
  ${ textBtnStyles }
`