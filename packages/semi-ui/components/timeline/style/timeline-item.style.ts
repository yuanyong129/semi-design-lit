import { css } from 'lit';

export const timelineItemStyles = css`
  :host {
    display: block;
    order: var(--semi-timeline-order, 0);
  }

  .semi-timeline-item {
    position: relative;
    box-sizing: border-box;
    min-height: 40px;
    padding: 0 0 24px 28px;
  }

  .semi-timeline-item-last {
    padding-bottom: 0;
  }

  .semi-timeline-tail {
    position: absolute;
    top: 16px;
    bottom: 0;
    left: 6px;
    width: 1px;
    background: var(--semi-color-border);
  }

  .semi-timeline-item-last .semi-timeline-tail {
    display: none;
  }

  .semi-timeline-dot {
    position: absolute;
    top: 2px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    box-sizing: border-box;
    border: 2px solid var(--semi-color-bg-2);
    border-radius: 50%;
    background: var(--semi-color-primary);
    color: var(--semi-color-white, #fff);
    font-size: 9px;
    line-height: 1;
    z-index: 1;
  }

  .semi-timeline-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--semi-color-text-1);
    font-size: 14px;
    line-height: 22px;
  }

  .semi-timeline-time {
    margin-bottom: 2px;
    color: var(--semi-color-text-2);
    font-size: 12px;
    line-height: 18px;
  }

  .semi-timeline-body {
    overflow-wrap: anywhere;
  }

  .semi-timeline-item-right {
    padding: 0 28px 24px 0;
    text-align: right;
  }

  .semi-timeline-item-right.semi-timeline-item-last {
    padding-bottom: 0;
  }

  .semi-timeline-item-right .semi-timeline-tail {
    right: 6px;
    left: auto;
  }

  .semi-timeline-item-right .semi-timeline-dot {
    right: 0;
    left: auto;
  }

  .semi-timeline-item-alternate {
    min-height: 48px;
    padding: 0;
  }

  .semi-timeline-item-alternate .semi-timeline-tail {
    right: auto;
    left: 50%;
  }

  .semi-timeline-item-alternate .semi-timeline-dot {
    left: 50%;
    transform: translateX(-50%);
  }

  .semi-timeline-item-alternate .semi-timeline-content {
    width: calc(50% - 24px);
  }

  .semi-timeline-item-alternate.semi-timeline-item-left .semi-timeline-content {
    margin-right: auto;
    text-align: right;
  }

  .semi-timeline-item-alternate.semi-timeline-item-right .semi-timeline-content {
    margin-left: auto;
    text-align: left;
  }

  .semi-timeline-item-alternate.semi-timeline-item-right {
    padding: 0;
  }

  .semi-timeline-item-alternate.semi-timeline-item-right .semi-timeline-dot {
    right: auto;
  }
`;
