import { css } from 'lit';

export const layoutStyles = css`
  :host {
    display: flex;
    flex: auto;
    flex-direction: column;
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
  }

  :host([data-has-sider]) {
    flex-direction: row;
  }

  .semi-layout {
    display: flex;
    flex: auto;
    flex-direction: column;
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
    background: var(--semi-color-bg-0);
  }

  :host([data-has-sider]) .semi-layout {
    flex-direction: row;
  }
`;
