import { css } from 'lit';

export const collapsePanelStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  .semi-collapse-panel {
    box-sizing: border-box;
    border-bottom: 1px solid var(--semi-color-border);
    background: var(--semi-color-bg-2);
  }

  :host(:last-child) .semi-collapse-panel {
    border-bottom: 0;
  }

  .semi-collapse-header {
    display: flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
    padding: 12px 16px;
    border: 0;
    background: transparent;
    color: var(--semi-color-text-0);
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    text-align: left;
    cursor: pointer;
  }

  .semi-collapse-header:hover {
    background: var(--semi-color-fill-0);
  }

  .semi-collapse-header:focus-visible {
    outline: 2px solid var(--semi-color-primary);
    outline-offset: -2px;
  }

  .semi-collapse-header[disabled] {
    color: var(--semi-color-text-3);
    cursor: not-allowed;
  }

  .semi-collapse-header[disabled]:hover {
    background: transparent;
  }

  .semi-collapse-header-text {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .semi-collapse-extra {
    flex: none;
    margin-left: auto;
    color: var(--semi-color-text-2);
    font-weight: 400;
  }

  .semi-collapse-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    color: var(--semi-color-text-2);
    transition: transform 0.2s ease;
  }

  .semi-collapse-panel-active .semi-collapse-icon {
    transform: rotate(90deg);
  }

  .semi-collapse-icon-right .semi-collapse-icon {
    order: 3;
    margin-left: 4px;
  }

  .semi-collapse-icon-right .semi-collapse-extra {
    order: 2;
    margin-left: auto;
  }

  .semi-collapse-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease;
  }

  .semi-collapse-panel-active .semi-collapse-body {
    grid-template-rows: 1fr;
  }

  .semi-collapse-body-inner {
    overflow: hidden;
    min-height: 0;
  }

  .semi-collapse-body-content {
    padding: 4px 16px 16px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 22px;
  }

  :host([ghost]) .semi-collapse-panel {
    background: transparent;
    border-bottom-color: transparent;
  }

  :host([ghost]) .semi-collapse-header {
    padding-left: 0;
    padding-right: 0;
  }

  :host([ghost]) .semi-collapse-header:hover {
    background: transparent;
  }

  :host([ghost]) .semi-collapse-body-content {
    padding-left: 0;
    padding-right: 0;
  }
`;
