import { css, unsafeCSS } from "lit";
import { getPrefixCls } from '../_utils/global-config';
import * as token from "./token.style";
import { transitionDuration1, transitionTimingFunctionLinear } from "../../style/theme";

export const prefixCls = getPrefixCls('link');

export const styles = css`
  .${unsafeCSS(prefixCls)} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${unsafeCSS(token.linkPaddingVertical)} ${unsafeCSS(token.linkPaddingHorizontal)};
    color: ${unsafeCSS(token.linkColorText)};
    font-size: ${unsafeCSS(token.linkFontSize)};
    line-height: ${unsafeCSS(token.linkLineHeight)};
    text-decoration: none;
    background-color: transparent;
    border-radius: ${unsafeCSS(token.linkBorderRadius)};
    cursor: pointer;
    transition: all ${unsafeCSS(transitionDuration1)} ${unsafeCSS(transitionTimingFunctionLinear)};
    
    &:hover {
      color: ${unsafeCSS(token.linkColorText_hover)};
      background-color: ${unsafeCSS(token.linkColorBg_hover)};
    }

    &:active {
      color: ${unsafeCSS(token.linkColorText_active)};
      background-color: ${unsafeCSS(token.linkColorBg_active)};
      transition: none;
    }
  }

  .${unsafeCSS(prefixCls)}.${unsafeCSS(prefixCls)}-hoverless {
    display: inline;
    padding: 0;
    background-color: unset;

    &:active, &:hover {
      background-color: unset;
    }
  }

  .${unsafeCSS(prefixCls)}.${unsafeCSS(prefixCls)}-disabled {
    color: ${unsafeCSS(token.linkColorText_disabled)};
    background: none;
    cursor: not-allowed;
  }

  .${unsafeCSS(prefixCls)}.${unsafeCSS(prefixCls)}-loading {
    color: ${unsafeCSS(token.linkColorText_loading)};
    background: none;
    cursor: default;
  }

  /** 不同状态 */
  .${unsafeCSS(prefixCls)}-status-success {
    color: ${unsafeCSS(token.linkColorText_success)};

    &:hover {
      color: ${unsafeCSS(token.linkColorText_success_hover)};
    }

    &:active {
      color: ${unsafeCSS(token.linkColorText_success_active)};
    }
  }
  .${unsafeCSS(prefixCls)}-status-success.${unsafeCSS(prefixCls)}-disabled {
    color: ${unsafeCSS(token.linkColorText_success_disabled)};
  }
  .${unsafeCSS(prefixCls)}-status-success.${unsafeCSS(prefixCls)}-loading {
    color: ${unsafeCSS(token.linkColorText_success_loading)};
  }

  .${unsafeCSS(prefixCls)}-status-danger {
    color: ${unsafeCSS(token.linkColorText_error)};

    &:hover {
      color: ${unsafeCSS(token.linkColorText_error_hover)};
    }

    &:active {
      color: ${unsafeCSS(token.linkColorText_error_active)};
    }
  }

  .${unsafeCSS(prefixCls)}-status-danger.${unsafeCSS(prefixCls)}-disabled {
    color: ${unsafeCSS(token.linkColorText_error_disabled)};
  }

  .${unsafeCSS(prefixCls)}-status-danger.${unsafeCSS(prefixCls)}-loading {
    color: ${unsafeCSS(token.linkColorText_error_loading)};
  }

  .${unsafeCSS(prefixCls)}-status-warning {
    color: ${unsafeCSS(token.linkColorText_warning)};

    &:hover {
      color: ${unsafeCSS(token.linkColorText_warning_hover)};
    }

    &:active {
      color: ${unsafeCSS(token.linkColorText_warning_active)};
    }
  }

  .${unsafeCSS(prefixCls)}-status-warning.${unsafeCSS(prefixCls)}-disabled {
    color: ${unsafeCSS(token.linkColorText_warning_disabled)};
  }

  .${unsafeCSS(prefixCls)}-status-warning.${unsafeCSS(prefixCls)}-loading {
    color: ${unsafeCSS(token.linkColorText_warning_loading)};
  }

  /** 链接图标 */ 
  .${unsafeCSS(prefixCls)}-icon {
    margin-right: ${unsafeCSS(token.linkMarginIconRight)};
    font-size: ${unsafeCSS(token.linkSizeIcon)};
    vertical-align: middle;
  }
`;
