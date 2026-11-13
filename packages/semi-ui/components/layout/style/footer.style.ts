import { css } from 'lit';

export const footerStyles = css`
  :host {
    display: block;
    flex: 0 0 auto;
    box-sizing: border-box;
  }

  .semi-layout-footer {
    padding: 24px 50px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    background: var(--semi-color-bg-1);
    border-top: 1px solid var(--semi-color-border);
  }
`;
