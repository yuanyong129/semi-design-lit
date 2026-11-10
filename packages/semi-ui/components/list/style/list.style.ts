import { css } from 'lit';

export const listStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  .semi-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    background: var(--semi-color-bg-2);
    border-radius: var(--semi-border-radius-medium);
  }

  .semi-list-bordered {
    border: 1px solid var(--semi-color-border);
    overflow: hidden;
  }

  .semi-list-header,
  .semi-list-footer {
    padding: 12px 16px;
    color: var(--semi-color-text-1);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }

  .semi-list-header {
    border-bottom: 1px solid var(--semi-color-border);
  }

  .semi-list-footer {
    border-top: 1px solid var(--semi-color-border);
    color: var(--semi-color-text-2);
    font-weight: 400;
  }

  .semi-list-body {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .semi-list-body slot {
    display: contents;
  }

  .semi-list-loading {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .semi-list-loading-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--semi-color-border);
  }

  .semi-list-loading-item:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;
