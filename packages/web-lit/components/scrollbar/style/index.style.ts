import { css, unsafeCSS } from "lit";
import { prefix } from "../../style/theme";
import tokenStyle from "./token.style";
import { styleToUnsafeCss } from "../../_utils/web-utils";

const scrollPrefixCls = unsafeCSS(`${prefix}-scrollbar`);

const tokenCss = styleToUnsafeCss(tokenStyle);

export const styles = css`
  .${scrollPrefixCls} {
    position: relative;
  }

  .${scrollPrefixCls}-container {
    position: relative;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .${scrollPrefixCls}-track {
    position: absolute;
    z-index: 100;
  }
  .${scrollPrefixCls}-track-direction-horizontal {
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: ${tokenCss["scrollbar-track-size"]};
  }

  .${scrollPrefixCls}-track-direction-vertical {
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: ${tokenCss["scrollbar-track-size"]};
    height: 100%;
  }

  .${scrollPrefixCls}.${scrollPrefixCls}-type-track {
    .${scrollPrefixCls}-track {
      background-color: ${tokenCss["scrollbar-track-bg_color"]};

      &-direction-horizontal {
        border-top: ${tokenCss["scrollbar-track-border_size"]} solid
          ${tokenCss["scrollbar-track-border_color"]};
        border-bottom: ${tokenCss["scrollbar-track-border_size"]} solid
          ${tokenCss["scrollbar-track-border_color"]};
      }

      &-direction-vertical {
        border-right:${tokenCss["scrollbar-track-border_size"]} solid
          ${tokenCss["scrollbar-track-border_color"]};
        border-left: ${tokenCss["scrollbar-track-border_size"]} solid
          ${tokenCss["scrollbar-track-border_color"]};
      }
    }

    .${scrollPrefixCls}-thumb {
      &-direction-horizontal {
        margin: -${tokenCss["scrollbar-track-border_size"]} 0;
      }

      &-direction-vertical {
        margin: 0 -${tokenCss["scrollbar-track-border_size"]};
      }
    }

    &.${scrollPrefixCls}-both {
      .${scrollPrefixCls}-track-direction-vertical::after {
        position: absolute;
        right: -${tokenCss["scrollbar-track-border_size"]};
        bottom: 0;
        display: block;
        box-sizing: border-box;
        width: ${tokenCss["scrollbar-track-size"]};
        height: ${tokenCss["scrollbar-track-size"]};
        background-color: ${tokenCss["scrollbar-track-bg_color"]};
        border-right: ${tokenCss["scrollbar-track-border_size"]} solid
          ${tokenCss["scrollbar-track-border_color"]};
        border-bottom: ${tokenCss["scrollbar-track-border_size"]} solid
          ${tokenCss["scrollbar-track-border_color"]};
        content: '';
      }
    }
  }

  .${scrollPrefixCls}-thumb {
    position: absolute;
    display: block;
    box-sizing: border-box;

    &:hover,
    &-dragging {
      .${scrollPrefixCls}-thumb-bar {
        background-color: ${tokenCss["scrollbar-thumb-bar-bg_color_hover"]};
      }
    }

    &-direction-horizontal {
      .${scrollPrefixCls}-thumb-bar {
        height: ${tokenCss["scrollbar-thumb-bar-size"]};
        margin: ${(parseInt(tokenStyle["scrollbar-track-size"]) - parseInt(tokenStyle["scrollbar-thumb-bar-size"])) / 2 }px 0;
      }
    }

    &-direction-vertical {
      .${scrollPrefixCls}-thumb-bar {
        width: ${tokenCss["scrollbar-thumb-bar-size"]};
        margin: 0 ${(parseInt(tokenStyle['scrollbar-track-size']) - parseInt(tokenStyle['scrollbar-thumb-bar-size'])) / 2 }px;
      }
    }
  }

  .${scrollPrefixCls}-thumb-bar {
    width: 100%;
    height: 100%;
    background-color: ${tokenCss["scrollbar-thumb-bar-bg_color"]};
    border-radius: ${tokenCss['scrollbar-thumb-bar-border_radius']};
  }

  .${scrollPrefixCls}.${scrollPrefixCls}-type-embed {
    .${scrollPrefixCls}-thumb {
      opacity: 0;
      transition: opacity ease 200ms;
      &-dragging {
        opacity: 0.8;
      }
    }

    &:hover {
      .${scrollPrefixCls}-thumb {
        opacity: 0.8;
      }
    }
  }
`;

