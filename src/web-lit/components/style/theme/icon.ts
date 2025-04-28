import { css, unsafeCSS } from "lit";
import { ColorTransparent, prefix, transitionDuration1, transitionDurationLoading, transitionTimingFunctionLinear } from './index';
import componentStyle from './component.ts';

const size = (iconSize: string, iconBgHeight: string) => {
  return css`
    line-height: ${unsafeCSS(iconSize)};

    &::before {
      top: 50%;
      left: 50%;
      width: ${unsafeCSS(iconBgHeight)};
      height: ${unsafeCSS(iconBgHeight)};
      transform: translate(-50%, -50%);
    }
  `
}

export const iconStyles = css`
  .${unsafeCSS(prefix)}-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    font-style: normal;
    vertical-align: -2px;
    outline: none;
    stroke: currentColor;
    --color-fill-2: var(--color-neutral-2);
  }

  .${unsafeCSS(prefix)}-icon-loading,
  .${unsafeCSS(prefix)}-icon-spin {
    animation: ${unsafeCSS(prefix)}-loading-circle ${transitionDurationLoading} infinite ${unsafeCSS(transitionTimingFunctionLinear)};
  }

  @keyframes ${unsafeCSS(prefix)}-loading-circle {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .${unsafeCSS(prefix)}-icon-hover {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .${unsafeCSS(prefix)}-icon-hover .${unsafeCSS(prefix)}-icon {
    position: relative;
  }

  .${unsafeCSS(prefix)}-icon-hover::before {
    position: absolute;
    display: block;
    box-sizing: border-box;
    background-color: ${unsafeCSS(ColorTransparent)};
    border-radius: ${unsafeCSS(componentStyle['icon-hover-border-radius'])};
    transition: background-color ${unsafeCSS(transitionDuration1)}
      ${unsafeCSS(transitionTimingFunctionLinear)};
    content: '';
  }

  .${unsafeCSS(prefix)}-icon-hover:hover::before {
    background-color: ${unsafeCSS(componentStyle['icon-hover-color-bg'])};
  }

  .${unsafeCSS(prefix)}-icon-hover.${unsafeCSS(prefix)}-icon-hover-disabled::before {
    opacity: 0;
  }

  .${unsafeCSS(prefix)}-icon-hover {
    ${size(componentStyle['icon-hover-size-default-icon'], componentStyle['icon-hover-size-default-height'])};
  }

  .${unsafeCSS(prefix)}-icon-hover-size-mini {
    ${size(componentStyle['icon-hover-size-mini-icon'], componentStyle['icon-hover-size-mini-height'])};
  }

  .${unsafeCSS(prefix)}-icon-hover-size-small {
    ${size(componentStyle['icon-hover-size-small-icon'], componentStyle['icon-hover-size-small-height'])};
  }

  .${unsafeCSS(prefix)}-icon-hover-size-large {
    ${size(componentStyle['icon-hover-size-large-icon'], componentStyle['icon-hover-size-large-height'])};
  }

  .${unsafeCSS(prefix)}-icon-hover-size-huge {
    ${size(componentStyle['icon-hover-size-huge-icon'], componentStyle['icon-hover-size-huge-height'])};
  }

`;