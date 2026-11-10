import { css } from 'lit';

export const collapseStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  .semi-collapse {
    box-sizing: border-box;
    overflow: hidden;
    background: var(--semi-color-bg-2);
  }

  .semi-collapse-bordered {
    border: 1px solid var(--semi-color-border);
    border-radius: var(--semi-border-radius-medium);
  }

  .semi-collapse-ghost {
    background: transparent;
  }
`;
