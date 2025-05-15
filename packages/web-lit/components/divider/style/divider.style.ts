import { css, unsafeCSS } from "lit";
import { arcoCssvarsPrefix, prefix } from "../../style/theme";
import token from './token.style';

const dividerPrefixCls = `${prefix}-divider`;

export const styles = css`
  .${unsafeCSS(dividerPrefixCls)}-horizontal {
    position: relative;
    clear: both;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    margin: ${unsafeCSS(token["divider-margin-vertical"])} 0;
    border-bottom: ${unsafeCSS(token["divider-size"])} ${unsafeCSS(token["divider-line-style"])} ${unsafeCSS(token["divider-color-bg"])};
  }

  .${unsafeCSS(dividerPrefixCls)}-horizontal.${unsafeCSS(dividerPrefixCls)}-with-text {
    margin: ${unsafeCSS(token["divider-margin-vertical_text"])} 0;
  }

  .${unsafeCSS(dividerPrefixCls)}-vertical {
    display: inline-block;
    min-width: 1px;
    max-width: 1px;
    min-height: 1em;
    margin: 0 ${unsafeCSS(token["divider-margin-horizontal"])};
    vertical-align: middle;
    border-left: ${unsafeCSS(token["divider-size"])} ${unsafeCSS(token["divider-line-style"])} ${unsafeCSS(token["divider-color-bg"])};
  }

  /* Only the horizontal dividing line supports text, and only the horizontal situation is considered */
  .${unsafeCSS(dividerPrefixCls)}-text {
    position: absolute;
    top: 50%;
    box-sizing: border-box;
    padding: 0 ${unsafeCSS(token["divider-margin-text"])};
    color: ${unsafeCSS(token["divider-color-text"])};
    font-weight: ${unsafeCSS(token["divider-font-weight"])};
    font-size: ${unsafeCSS(token["divider-font-size"])};
    line-height: 2;
    background: var(${unsafeCSS(arcoCssvarsPrefix)}-color-bg-2);
    transform: translateY(-50%);
  }

  .${unsafeCSS(dividerPrefixCls)}-text-center {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .${unsafeCSS(dividerPrefixCls)}-text-left {
    left: ${unsafeCSS(token["divider-position-text-left"])};
  }

  .${unsafeCSS(dividerPrefixCls)}-text-right {
    right: ${unsafeCSS(token["divider-position-text-right"])};
  }

`;
