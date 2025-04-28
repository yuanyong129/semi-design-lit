import { css, unsafeCSS } from "lit";
import { prefix } from "../../style/theme";
import token from "./token.style";

const emptyPrefixCls = `${prefix}-empty`;

export const styles = css`
  .${unsafeCSS(emptyPrefixCls)} {
    box-sizing: border-box;
    width: 100%;
    padding: ${unsafeCSS(token['@empty-spacing-padding'])} 0;
    text-align: center;

    .${unsafeCSS(emptyPrefixCls)}-image {
      margin-bottom: ${unsafeCSS(token['@empty-spacing-image-margin-bottom'])};
      color: ${unsafeCSS(token['@empty-color-icon'])};
      font-size: ${unsafeCSS(token['@empty-font-size-image'])};
      line-height: 1;

      img {
        height: ${unsafeCSS(token['@empty-size-img-height'])};
      }
    }

    .${unsafeCSS(emptyPrefixCls)} .${unsafeCSS(emptyPrefixCls)}-description {
      color: ${unsafeCSS(token['@empty-color-text'])};
      font-size: ${unsafeCSS(token['@empty-font-size-text'])};
    }
  }
`;
