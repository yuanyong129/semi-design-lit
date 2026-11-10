import { css } from 'lit';

export const listItemStyles = css`
  :host {
    display: block;
  }

  .semi-list-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-sizing: border-box;
    padding: 12px 16px;
  }

  .semi-list-item-small {
    gap: 8px;
    padding: 8px 12px;
  }

  .semi-list-item-large {
    gap: 16px;
    padding: 16px 20px;
  }

  .semi-list-item-split {
    border-bottom: 1px solid var(--semi-color-border);
  }

  .semi-list-item-last.semi-list-item-split {
    border-bottom: 0;
  }

  .semi-list-item-avatar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .semi-list-item-avatar[hidden],
  .semi-list-item-extra[hidden],
  .semi-list-item-actions[hidden] {
    display: none;
  }

  .semi-list-item-main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1 1 auto;
  }

  .semi-list-item-title-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
  }

  .semi-list-item-title {
    color: var(--semi-color-text-1);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    overflow-wrap: anywhere;
  }

  .semi-list-item-small .semi-list-item-title {
    font-size: 13px;
    line-height: 20px;
  }

  .semi-list-item-large .semi-list-item-title {
    font-size: 16px;
    line-height: 24px;
  }

  .semi-list-item-extra {
    flex: 0 0 auto;
    margin-left: auto;
    color: var(--semi-color-text-2);
    font-size: 13px;
    line-height: 22px;
    white-space: nowrap;
  }

  .semi-list-item-description {
    margin-top: 2px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 22px;
    overflow-wrap: anywhere;
  }

  .semi-list-item-small .semi-list-item-description {
    font-size: 13px;
    line-height: 20px;
  }

  .semi-list-item-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
    color: var(--semi-color-link);
    font-size: 13px;
  }

  slot {
    display: contents;
  }
`;
