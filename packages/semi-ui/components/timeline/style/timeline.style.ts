import { css } from 'lit';

export const timelineStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  .semi-timeline {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  .semi-timeline slot {
    display: contents;
  }
`;
