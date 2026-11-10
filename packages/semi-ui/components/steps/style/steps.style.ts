import { css } from 'lit';

export const stepsStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  .semi-steps {
    display: flex;
    box-sizing: border-box;
    width: 100%;
  }

  .semi-steps-vertical {
    flex-direction: column;
  }

  .semi-steps-vertical ::slotted(semi-step) {
    flex: 0 0 auto;
  }

  .semi-steps-nav {
    overflow: hidden;
    border-radius: var(--semi-border-radius-medium);
  }
`;
