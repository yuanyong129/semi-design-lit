import { css } from 'lit';

export const headerStyles = css`
  :host {
    display: block;
    flex: 0 0 auto;
    box-sizing: border-box;
  }

  .semi-layout-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    padding: 0 50px;
    color: var(--semi-color-text-0);
    background: var(--semi-color-bg-1);
    border-bottom: 1px solid var(--semi-color-border);
  }
`;
