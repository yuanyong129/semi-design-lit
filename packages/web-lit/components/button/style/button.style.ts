import { css, unsafeCSS } from "lit";
import { arcoCssvarsPrefix, lineHeightBase, prefix, Radius, Size, transitionDuration1, transitionTimingFunctionLinear } from "../../style/theme";
import tokenStyle from "./token.style";

const btnPrefixCls = unsafeCSS(`${prefix}-btn`);

const handleCss = (key: string) => unsafeCSS((tokenStyle as any)[key]);
const token = (key: string) => (tokenStyle as any)[key];

function btnType(type: string) {
  const typeCss = unsafeCSS(type);
  function normal() {
    return `
      color: ${handleCss(`btn-${type}-color-text`)};
      background-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-bg`])};
      border: ${unsafeCSS(tokenStyle["btn-size-default-border-width"])}
        ${unsafeCSS((tokenStyle as any)[`btn-${type}-border-style`])} ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-border`])};
    `;
  }

  return css`
    .${btnPrefixCls}-${typeCss},
    .${btnPrefixCls}-${typeCss}[type='button'],
    .${btnPrefixCls}-${typeCss}[type='submit'] {
      ${unsafeCSS(normal())}

      &:hover {
        color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-text_hover`])};
        background-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-bg_hover`])};
        border-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-border_hover`])};
      }

      &:focus-visible {
        box-shadow: 0 0 0 ${unsafeCSS(tokenStyle["btn-box-shadow-radius"])} ${unsafeCSS((tokenStyle as any)[`{btn-${type}-color-box-shadow}`])};
      }

      &:active {
        color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-text_active`])};
        background-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-bg_active`])};
        border-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-border_active`])};
      }

      &.${btnPrefixCls}-loading {
        ${unsafeCSS(normal())}
      }

      &.${btnPrefixCls}-disabled {
        color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-text_disabled`])};
        background-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-bg_disabled`])};
        border: ${unsafeCSS(tokenStyle["btn-size-default-border-width"])}
          ${unsafeCSS((tokenStyle as any)[`btn-${type}-border-style`])} ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-border_disabled`])};
        cursor: not-allowed;
      }
    }
  `;
}

function btnStatus(type: string, status: string) {
  function normal() {
    return `
      color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-text_${status}`])};
      background-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-bg_${status}`])};
      border-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-border_${status}`])};
    `;
  }

  return css`
    .${btnPrefixCls}-${unsafeCSS(type)}.${btnPrefixCls}-status-${unsafeCSS(status)} {
      ${unsafeCSS(normal())}

      &:hover {
        color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-text_${status}_hover`])};
        background-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-bg_${status}_hover`])};
        border-color: ${unsafeCSS((tokenStyle as any)[`btn-${type}-color-border_${status}_hover`])};
      }

      &:focus-visible {
        box-shadow: 0 0 0 ${unsafeCSS(tokenStyle["btn-box-shadow-radius"])} ${unsafeCSS((tokenStyle as any)[`btn-color-box-shadow_${status}`])};
      }

      &:active {
        color: ${handleCss(`btn-${type}-color-text_${status}_active`)};
        background-color: ${handleCss(`btn-${type}-color-bg_${status}_active`)};
        border-color: ${handleCss(`btn-${type}-color-border_${status}_active`)};
      }

      &.${btnPrefixCls}-loading {
        ${unsafeCSS(normal())}
      }

      &.${btnPrefixCls}-disabled {
        color: ${handleCss(`btn-${type}-color-text_${status}_disabled`)};
        background-color: ${handleCss(`btn-${type}-color-bg_${status}_disabled`)};
        border: ${handleCss(`btn-size-default-border-width`)}  ${handleCss(`btn-${type}-border-style`)} ${handleCss(`btn-${type}-color-border_${status}_disabled`)};
      }
    }
  `;
}

function btnSize(size: string) {
  const sizeType = `size-${size}`;
  const sizeHeight = `btn-size-${size}-height`;
  const bsp = `btn-${sizeType}-padding-horizontal`;
  const bsf = `btn-${sizeType}-font-size`;
  const bss = `btn-${sizeType}-icon-spacing`;

  return css`
    .${btnPrefixCls}-${unsafeCSS(sizeType)} {
      height: ${handleCss(sizeHeight)};
      padding: 0 ${handleCss(bsp)};
      font-size: ${handleCss(bsf)};
      border-radius: ${handleCss(`btn-${sizeType}-radius`)};

      &:not(.${btnPrefixCls}-only-icon) .${btnPrefixCls}-icon {
        margin-right: ${handleCss(`btn-${sizeType}-icon-spacing`)};
      }

      svg {
        vertical-align:  ${handleCss(`btn-${sizeType}-icon-vertical-align`)};
      }
    }

    .${btnPrefixCls}-${unsafeCSS(sizeType)}.${btnPrefixCls}-loading-fixed-width.${btnPrefixCls}-loading {
      padding-right: ${ parseInt(token(bsp)) - ((parseInt(token(bsf)) + parseInt(token(bss))) / 2) };
      padding-left: ${ parseInt(token(bsp)) - ((parseInt(token(bsf)) + parseInt(token(bss))) / 2) };
    }

    .${btnPrefixCls}-${unsafeCSS(sizeType)}.${btnPrefixCls}-only-icon {
      width: ${unsafeCSS((Size as any)[sizeType])};
      height: ${unsafeCSS((Size as any)[sizeType])};
      padding: 0;
    }

    .${btnPrefixCls}-${unsafeCSS(sizeType)}.${btnPrefixCls}-shape-circle {
      width: ${unsafeCSS((Size as any)[sizeType])};
      height: ${unsafeCSS((Size as any)[sizeType])};
      padding: 0;
      text-align: center;
      border-radius: ${unsafeCSS(Radius.radiusCircle)};
    }

    .${btnPrefixCls}-${unsafeCSS(sizeType)}.${btnPrefixCls}-shape-round {
      border-radius: calc(${unsafeCSS((Size as any)[sizeType])} * 0.5);
    }
  `;
}

export const styles = css`
  .${btnPrefixCls} {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-weight: ${tokenStyle["btn-font-weight"]};
    line-height: ${lineHeightBase};
    white-space: nowrap;
    outline: none;
    cursor: pointer;
    transition: all ${unsafeCSS(transitionDuration1)} ${unsafeCSS(transitionTimingFunctionLinear)};
    -webkit-appearance: none;
    user-select: none;
  }

  .${btnPrefixCls} > a:only-child {
    color: currentColor;
  }

  .${btnPrefixCls}-long {
    display: flex;
    width: 100%;
  }

  .${btnPrefixCls}:active {
    transition: none;
  }

  .${btnPrefixCls}-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .${btnPrefixCls}-link:not([href]) {
    color: var(${unsafeCSS(arcoCssvarsPrefix)}-color-text-4);
  }

  .${btnPrefixCls}-link:hover {
    text-decoration: none;
  }

  .${btnPrefixCls}-link.${btnPrefixCls}-only-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
  }

  .${btnPrefixCls}.${btnPrefixCls}-only-icon .${btnPrefixCls}-icon {
    display: flex;
    justify-content: center;
  }

  .${btnPrefixCls}-loading {
    position: relative;
    cursor: default;

    &::before {
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      z-index: 1;
      display: block;
      background: #fff;
      border-radius: inherit;
      opacity: 0.4;
      transition: opacity ${unsafeCSS(transitionDuration1)}
        ${unsafeCSS(transitionTimingFunctionLinear)};
      content: '';
      pointer-events: none;
    }
  }

  .${btnPrefixCls}-loading-fixed-width {
    transition: none;
  }

  .${btnPrefixCls}-two-chinese-chars > *:not(svg) {
    margin-right: -0.3em;
    letter-spacing: 0.3em;
  }

  ${btnType('outline')}
  ${btnStatus('outline', 'warning')}
  ${btnStatus('outline', 'danger')}
  ${btnStatus('outline', 'success')}

  ${btnType('primary')}
  ${btnStatus('primary', 'warning')}
  ${btnStatus('primary', 'danger')}
  ${btnStatus('primary', 'success')}

  ${btnType('secondary')}
  ${btnStatus('secondary', 'warning')}
  ${btnStatus('secondary', 'danger')}
  ${btnStatus('secondary', 'success')}

  ${btnType('dashed')}
  ${btnStatus('dashed', 'warning')}
  ${btnStatus('dashed', 'danger')}
  ${btnStatus('dashed', 'success')}

  ${btnType('text')}
  ${btnStatus('text', 'warning')}
  ${btnStatus('text', 'danger')}
  ${btnStatus('text', 'success')}

  ${btnSize('mini')}
  ${btnSize('small')}
  ${btnSize('medium')}
  ${btnSize('large')}

  /** 按钮组样式 */ 
  .is-group.${btnPrefixCls}-outline:not(.is-first),
  .is-group.${btnPrefixCls}-dashed:not(.is-first) {
    margin-left: -1px;
  }

  .is-group.${btnPrefixCls}-outline,
  .is-group.${btnPrefixCls}-dashed {
    &:hover,
    &:active {
      z-index: 2;
    }
  }

  .is-group.${btnPrefixCls}.${btnPrefixCls}.is-first {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .is-group.${btnPrefixCls}.${btnPrefixCls}.is-last {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .is-group.${btnPrefixCls}:not(.is-first):not(.is-last) {
    border-radius: 0;
  }

  .is-group.${btnPrefixCls}-primary:not(.is-last) {
    border-right: 1px solid ${unsafeCSS(tokenStyle["btn-primary-color-bg_hover"])};
  }

  .is-group.${btnPrefixCls}-secondary:not(.is-last) {
    border-right: 1px solid ${unsafeCSS(tokenStyle["btn-secondary-color-bg_hover"])};
  }

  .is-group.${btnPrefixCls}-status-warning:not(.is-last) {
     border-right: 1px solid ${unsafeCSS(tokenStyle["btn-primary-color-bg_warning_hover"])};
  }

  .is-group.${btnPrefixCls}-status-danger:not(.is-last) {
    border-right: 1px solid ${unsafeCSS(tokenStyle["btn-primary-color-bg_danger_hover"])};
  }

  .is-group.${btnPrefixCls}-status-success:not(.is-last) {
    border-right: 1px solid ${unsafeCSS(tokenStyle["btn-primary-color-bg_success_hover"])};
  }

  body[arco-theme='dark']  .${btnPrefixCls}-primary.${btnPrefixCls}-disabled {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const groupStyles = css`
  /** 按钮组样式 */ 
  .${btnPrefixCls}-group {
    display: inline-flex;
    align-items: center;
  }
`;

