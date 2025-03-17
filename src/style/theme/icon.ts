import { css, CSSResult } from "lit";
import { prefix, transitionDurationLoading, transitionTimingFunctionLinear } from './index';


const size = (iconSize: CSSResult, iconBgHeight: CSSResult) => {
  return css`
    line-height: ${iconSize};

    &::before {
      top: 50%;
      left: 50%;
      width: iconBgHeight;
      height: iconBgHeight;
      transform: translate(-50%, -50%);
    }
  `
}

export const iconStyles = css`
  .${prefix}-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    font-style: normal;
    vertical-align: -2px;
    outline: none;
    stroke: currentColor;
  }

  .${prefix}-icon-loading,
  .${prefix}-icon-spin {
    animation: ~'${prefix}-loading-circle' ${transitionDurationLoading} infinite ${transitionTimingFunctionLinear};
  }

  @keyframes ~'${prefix}-loading-circle' {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .${prefix}-icon-hover {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .${prefix}-icon-hover .${prefix}-icon {
    position: relative;
  }

  .${prefix}-icon-hover::before {
    position: absolute;
    display: block;
    box-sizing: border-box;
    background-color: @color-transparent;
    border-radius: @icon-hover-border-radius;
    transition: background-color @transition-duration-1
      @transition-timing-function-linear;
    content: '';
  }

  .${prefix}-icon-hover:hover::before {
    background-color: @icon-hover-color-bg;
  }

  .${prefix}-icon-hover.${prefix}-icon-hover-disabled::before {
    opacity: 0;
  }

`;

// ${size('@icon-hover-size-default-icon', '@icon-hover-size-default-height')};

//   .${prefix}-icon-hover-size-mini {
//     ${size(@icon-hover-size-mini-icon, @icon-hover-size-mini-height)};
//   }

//   .${prefix}-icon-hover-size-small {
//     ${size(@icon-hover-size-small-icon, @icon-hover-size-small-height)};
//   }

//   .${prefix}-icon-hover-size-large {
//     ${size(@icon-hover-size-large-icon, @icon-hover-size-large-height)};
//   }

//   .${prefix}-icon-hover-size-huge {
//     ${size(@icon-hover-size-huge-icon, @icon-hover-size-huge-height)};
//   }