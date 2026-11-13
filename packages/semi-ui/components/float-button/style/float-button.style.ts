import { css } from 'lit';

export const floatButtonStyles = css`
  :host {
    position: fixed;
    right: 24px;
    bottom: 40px;
    z-index: 1000;
    display: inline-block;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  semi-badge {
    display: inline-flex;
  }

  .semi-float-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: var(--semi-color-primary);
    color: var(--semi-color-white);
    box-shadow: var(--semi-shadow-elevated);
    font: inherit;
    cursor: pointer;
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .semi-float-button:hover {
    background: var(--semi-color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--semi-shadow-elevated);
  }

  .semi-float-button:focus-visible {
    outline: 2px solid var(--semi-color-primary);
    outline-offset: 2px;
  }

  .semi-float-button-round {
    border-radius: 50%;
  }

  .semi-float-button-square {
    border-radius: var(--semi-border-radius-medium, 8px);
  }

  .semi-float-button-small {
    width: 32px;
    height: 32px;
  }

  .semi-float-button-large {
    width: 48px;
    height: 48px;
  }

  .semi-float-button-colorful {
    background: linear-gradient(135deg, var(--semi-color-primary) 0%, #8a5cf6 100%);
  }

  .semi-float-button-colorful:hover {
    background: linear-gradient(135deg, var(--semi-color-primary-hover) 0%, #7c4df0 100%);
  }

  .semi-float-button-disabled,
  .semi-float-button:disabled {
    background: var(--semi-color-disabled-fill);
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .semi-float-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
  }

  .semi-float-button-small .semi-float-button-icon {
    font-size: 14px;
  }

  .semi-float-button-large .semi-float-button-icon {
    font-size: 22px;
  }

  ::slotted([slot='icon']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;
