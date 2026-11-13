import { css } from 'lit';

export const tagInputStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--semi-font-family, inherit);
    font-size: 14px;
    line-height: 20px;
    color: var(--semi-color-text-0);
  }

  * {
    box-sizing: border-box;
  }

  .semi-tagInput {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    min-height: 32px;
    padding: 2px 8px;
    border: 1px solid var(--semi-color-border);
    border-radius: var(--semi-border-radius-small, 6px);
    background: var(--semi-color-fill-0);
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  .semi-tagInput:hover {
    background: var(--semi-color-fill-1);
  }

  .semi-tagInput-focus,
  .semi-tagInput-focus:hover {
    border-color: var(--semi-color-primary);
    background: var(--semi-color-bg-2);
    box-shadow: 0 0 0 2px var(--semi-color-primary-light-active);
  }

  .semi-tagInput-small {
    min-height: 24px;
    padding: 0 6px;
    font-size: 12px;
  }

  .semi-tagInput-large {
    min-height: 40px;
    padding: 4px 12px;
    font-size: 16px;
  }

  .semi-tagInput-disabled {
    color: var(--semi-color-text-2);
    background: var(--semi-color-disabled-fill);
    cursor: not-allowed;
  }

  .semi-tagInput-disabled:hover {
    background: var(--semi-color-disabled-fill);
  }

  .semi-tagInput-error,
  .semi-tagInput-error:hover {
    border-color: var(--semi-color-danger);
  }

  .semi-tagInput-error.semi-tagInput-focus {
    box-shadow: 0 0 0 2px var(--semi-color-danger-light-active);
  }

  .semi-tagInput-warning,
  .semi-tagInput-warning:hover {
    border-color: var(--semi-color-warning);
  }

  .semi-tagInput-warning.semi-tagInput-focus {
    box-shadow: 0 0 0 2px var(--semi-color-warning-light-active);
  }

  .semi-tagInput-success,
  .semi-tagInput-success:hover {
    border-color: var(--semi-color-success);
  }

  .semi-tagInput-inset-label {
    flex: none;
    padding-right: 8px;
    color: var(--semi-color-text-2);
    white-space: nowrap;
  }

  .semi-tagInput-wrapper {
    display: flex;
    align-items: center;
    flex: 1 1 120px;
    flex-wrap: wrap;
    gap: 4px;
    min-width: 0;
  }

  .semi-tagInput-tag {
    flex: none;
    max-width: 100%;
  }

  .semi-tagInput-rest {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--semi-color-fill-1);
    color: var(--semi-color-text-1);
    font-size: 12px;
    line-height: 20px;
    cursor: default;
  }

  .semi-tagInput-small .semi-tagInput-rest {
    height: 18px;
    line-height: 18px;
    font-size: 11px;
  }

  .semi-tagInput-input {
    flex: 1 1 60px;
    width: 60px;
    min-width: 60px;
    height: 24px;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: inherit;
  }

  .semi-tagInput-input::placeholder {
    color: var(--semi-color-text-2);
  }

  .semi-tagInput-disabled .semi-tagInput-input {
    cursor: not-allowed;
  }

  .semi-tagInput-clearBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 16px;
    height: 16px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--semi-color-text-2);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .semi-tagInput:hover .semi-tagInput-clearBtn,
  .semi-tagInput-focus .semi-tagInput-clearBtn {
    opacity: 1;
  }

  .semi-tagInput-clearBtn:hover {
    color: var(--semi-color-text-0);
    background: var(--semi-color-fill-1);
  }

  .semi-tagInput-clearBtn semi-icon-close {
    font-size: 12px;
  }

  slot[name='prefix'],
  slot[name='suffix'] {
    display: contents;
  }

  ::slotted([slot='prefix']) {
    flex: none;
    color: var(--semi-color-text-2);
  }

  ::slotted([slot='suffix']) {
    flex: none;
    color: var(--semi-color-text-2);
  }
`;
