import { css, unsafeCSS } from "lit";
import { prefix, transitionDurationLoading, transitionTimingFunctionLinear } from './index';

/**
 * Base styles shared by all Semi icon web components.
 * Icons are rendered inside their own shadow root, so the styles are attached
 * to every icon element instead of being global.
 */
export const iconStyles = css`
  .${unsafeCSS(prefix)}-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    font-style: normal;
    vertical-align: -0.125em;
    outline: none;
    stroke: currentColor;
    flex-shrink: 0;
  }

  .${unsafeCSS(prefix)}-icon-spin {
    animation: ${unsafeCSS(prefix)}-icon-spin ${transitionDurationLoading} infinite ${unsafeCSS(transitionTimingFunctionLinear)};
  }

  @keyframes ${unsafeCSS(prefix)}-icon-spin {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
