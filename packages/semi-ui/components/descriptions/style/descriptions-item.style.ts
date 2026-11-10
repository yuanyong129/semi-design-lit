import { css } from 'lit';

export const descriptionsItemStyles = css`
  :host {
    display: block;
    min-width: 0;
    grid-column: span var(--semi-descriptions-item-span, 1);
  }

  .semi-descriptions-item {
    display: grid;
    grid-template-columns: var(--semi-descriptions-label-width, 112px) minmax(0, 1fr);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 22px;
  }

  .semi-descriptions-item-small {
    --semi-descriptions-label-width: 96px;
    font-size: 13px;
    line-height: 20px;
  }

  .semi-descriptions-item-large {
    --semi-descriptions-label-width: 136px;
    font-size: 14px;
    line-height: 24px;
  }

  .semi-descriptions-item-vertical {
    grid-template-columns: minmax(0, 1fr);
  }

  .semi-descriptions-label {
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 12px 16px;
    color: var(--semi-color-text-2);
    background: var(--semi-color-fill-0);
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .semi-descriptions-content {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    box-sizing: border-box;
    padding: 12px 16px;
    color: var(--semi-color-text-1);
    text-align: left;
    overflow-wrap: anywhere;
  }

  .semi-descriptions-item-center .semi-descriptions-content {
    text-align: center;
    justify-content: center;
  }

  .semi-descriptions-item-right .semi-descriptions-content {
    text-align: right;
    justify-content: flex-end;
  }

  .semi-descriptions-item-small .semi-descriptions-label,
  .semi-descriptions-item-small .semi-descriptions-content {
    padding: 8px 12px;
  }

  .semi-descriptions-item-large .semi-descriptions-label,
  .semi-descriptions-item-large .semi-descriptions-content {
    padding: 16px 20px;
  }

  .semi-descriptions-item-bordered {
    border-right: 1px solid var(--semi-color-border);
    border-bottom: 1px solid var(--semi-color-border);
  }

  .semi-descriptions-item-bordered .semi-descriptions-label {
    border-right: 1px solid var(--semi-color-border);
  }

  .semi-descriptions-item-vertical.semi-descriptions-item-bordered .semi-descriptions-label {
    border-right: 0;
    border-bottom: 1px solid var(--semi-color-border);
  }

  .semi-descriptions-item-vertical .semi-descriptions-label {
    background: var(--semi-color-fill-0);
  }

  .semi-descriptions-item:not(.semi-descriptions-item-bordered) .semi-descriptions-label {
    padding: 6px 12px 6px 0;
    background: transparent;
  }

  .semi-descriptions-item:not(.semi-descriptions-item-bordered) .semi-descriptions-content {
    padding: 6px 0;
  }

  .semi-descriptions-item-vertical:not(.semi-descriptions-item-bordered) .semi-descriptions-label {
    padding: 4px 0;
  }

  .semi-descriptions-item-vertical:not(.semi-descriptions-item-bordered) .semi-descriptions-content {
    padding: 0 0 12px;
  }

  slot {
    display: contents;
  }
`;
