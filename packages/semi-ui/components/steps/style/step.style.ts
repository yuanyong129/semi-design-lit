import { css } from 'lit';

export const stepStyles = css`
  :host {
    display: block;
    flex: 1 1 0;
    min-width: 0;
  }

  .semi-step {
    position: relative;
    box-sizing: border-box;
    height: 100%;
  }

  .semi-step-horizontal {
    padding-right: 16px;
  }

  .semi-step-vertical {
    display: flex;
    padding-bottom: 24px;
  }

  .semi-step-head {
    display: flex;
    min-width: 0;
  }

  .semi-step-horizontal .semi-step-head {
    flex-direction: column;
    gap: 8px;
  }

  .semi-step-vertical .semi-step-head {
    gap: 12px;
    align-items: flex-start;
  }

  .semi-step-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 24px;
    height: 24px;
    border: 1px solid var(--semi-color-border);
    border-radius: 50%;
    background: var(--semi-color-fill-0);
    color: var(--semi-color-text-2);
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    box-sizing: border-box;
  }

  .semi-step-main {
    min-width: 0;
    flex: 1;
  }

  .semi-step-title {
    color: var(--semi-color-text-0);
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    overflow-wrap: anywhere;
  }

  .semi-step-description {
    margin-top: 2px;
    color: var(--semi-color-text-2);
    font-size: 12px;
    line-height: 20px;
    overflow-wrap: anywhere;
  }

  .semi-step-tail {
    position: absolute;
    z-index: 0;
    background: var(--semi-color-border);
    pointer-events: none;
  }

  .semi-step-horizontal .semi-step-tail {
    top: 11px;
    left: 32px;
    right: 0;
    height: 1px;
  }

  .semi-step-vertical .semi-step-tail {
    top: 24px;
    bottom: 0;
    left: 11px;
    width: 1px;
  }

  .semi-step-finish .semi-step-tail {
    background: var(--semi-color-primary);
  }

  .semi-step-error .semi-step-tail {
    background: var(--semi-color-danger);
  }

  .semi-step-warning .semi-step-tail {
    background: var(--semi-color-warning);
  }

  .semi-step-process .semi-step-icon {
    border-color: var(--semi-color-primary);
    background: var(--semi-color-primary);
    color: var(--semi-color-white, #fff);
  }

  .semi-step-finish .semi-step-icon {
    border-color: var(--semi-color-primary);
    background: var(--semi-color-primary-light-default);
    color: var(--semi-color-primary);
  }

  .semi-step-error .semi-step-icon {
    border-color: var(--semi-color-danger);
    background: var(--semi-color-danger);
    color: var(--semi-color-white, #fff);
  }

  .semi-step-warning .semi-step-icon {
    border-color: var(--semi-color-warning);
    background: var(--semi-color-warning);
    color: var(--semi-color-white, #fff);
  }

  .semi-step-exclamation {
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }

  .semi-step-dot .semi-step-icon {
    border: 0;
    background: transparent;
  }

  .semi-step-dot .semi-step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--semi-color-text-3);
  }

  .semi-step-dot.semi-step-process .semi-step-dot {
    background: var(--semi-color-primary);
  }

  .semi-step-dot.semi-step-finish .semi-step-dot {
    background: var(--semi-color-primary);
  }

  .semi-step-dot.semi-step-error .semi-step-dot {
    background: var(--semi-color-danger);
  }

  .semi-step-dot.semi-step-warning .semi-step-dot {
    background: var(--semi-color-warning);
  }

  .semi-step-dot .semi-step-tail {
    top: 11px;
  }

  .semi-step-nav {
    height: auto;
    padding: 12px 16px;
    border-right: 1px solid var(--semi-color-border);
    background: var(--semi-color-fill-0);
  }

  .semi-step-nav.semi-step-last {
    border-right: 0;
  }

  .semi-step-nav.semi-step-process {
    background: var(--semi-color-primary-light-default);
  }

  .semi-step-nav.semi-step-process .semi-step-title {
    color: var(--semi-color-primary);
  }

  .semi-step-nav .semi-step-tail {
    display: none;
  }

  .semi-step-nav .semi-step-icon {
    display: none;
  }

  .semi-step-nav .semi-step-head {
    display: block;
  }

  .semi-step-small .semi-step-icon {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .semi-step-small .semi-step-title {
    font-size: 12px;
    line-height: 20px;
  }

  .semi-step-small.semi-step-horizontal .semi-step-tail {
    top: 9px;
    left: 28px;
  }

  .semi-step-small.semi-step-vertical .semi-step-tail {
    top: 20px;
    left: 9px;
  }

  .semi-step-clickable {
    cursor: pointer;
  }

  .semi-step-clickable:hover .semi-step-title {
    color: var(--semi-color-primary);
  }

  .semi-step-clickable:focus-visible {
    outline: 2px solid var(--semi-color-primary);
    outline-offset: 2px;
  }

  .semi-step-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .semi-step-disabled:hover .semi-step-title {
    color: var(--semi-color-text-0);
  }
`;
