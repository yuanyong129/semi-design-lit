import { css } from 'lit';

export const collapsibleStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  .semi-collapsible-wrapper {
    overflow: hidden;
    transition-property: height, opacity;
    transition-timing-function: ease;
  }

  .semi-collapsible-inner {
    overflow: hidden;
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .semi-collapsible-wrapper {
      transition-duration: 0ms !important;
    }
  }
`;
