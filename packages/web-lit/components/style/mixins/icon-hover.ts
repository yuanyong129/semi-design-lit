import { css, unsafeCSS } from "lit"
import { prefix } from "../theme";

export const iconHover = (prefixCls: string, _innerHeight: string, bgHeight: string) => {
  return css`
    .${unsafeCSS(prefix)}-icon-hover.${unsafeCSS(prefixCls)}-icon-hover::before {
      width: ${unsafeCSS(bgHeight)};
      height: ${unsafeCSS(bgHeight)};
    }
  `; 
}

export const iconHoverBg = (prefixCls: string, backgroundColorHover: string) => {
  return css`
    .${unsafeCSS(prefix)}-icon-hover.${unsafeCSS(prefixCls)}-icon-hover:hover::before {
      background-color: ${unsafeCSS(backgroundColorHover)};
    }
  `;
}