import { css } from 'lit';

export const contentStyles = css`
  :host {
    display: block;
    flex: auto;
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
  }

  .semi-layout-content {
    box-sizing: border-box;
    min-height: 0;
    padding: 24px;
    color: var(--semi-color-text-0);
    background: var(--semi-color-bg-0);
  }
`;
