import { css } from 'lit';

export const backTopStyles = css`
  :host {
    position: fixed;
    right: 24px;
    bottom: 40px;
    z-index: 1000;
    display: block;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  .semi-back-top {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--semi-color-bg-2);
    color: var(--semi-color-text-1);
    box-shadow: var(--semi-shadow-elevated);
    font: inherit;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      transform 0.15s ease;
  }

  .semi-back-top:hover {
    background: var(--semi-color-fill-0);
    color: var(--semi-color-primary);
    transform: translateY(-2px);
  }

  .semi-back-top:focus-visible {
    outline: 2px solid var(--semi-color-primary);
    outline-offset: 2px;
  }

  .semi-back-top semi-icon-right {
    display: inline-flex;
    transform: rotate(-90deg);
    font-size: 18px;
  }

  ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;
