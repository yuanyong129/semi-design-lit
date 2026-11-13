import { css } from 'lit';

export const siderStyles = css`
  :host {
    display: flex;
    flex: 0 0 auto;
    align-self: stretch;
    box-sizing: border-box;
    min-height: 0;
  }

  .semi-layout-sider {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100%;
    overflow: hidden;
    color: var(--semi-color-text-0);
    background: var(--semi-color-bg-1);
    border-right: 1px solid var(--semi-color-border);
    transition: width 0.2s ease;
  }

  .semi-layout-sider-children {
    flex: 1;
    box-sizing: border-box;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    white-space: nowrap;
  }

  .semi-layout-sider-trigger {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    padding: 0;
    color: var(--semi-color-text-2);
    font-size: 12px;
    background: var(--semi-color-fill-0);
    border: 0;
    border-top: 1px solid var(--semi-color-border);
    cursor: pointer;
  }

  .semi-layout-sider-trigger:hover {
    color: var(--semi-color-primary);
    background: var(--semi-color-fill-1);
  }

  .semi-layout-sider-trigger:focus-visible {
    outline: 2px solid var(--semi-color-primary-light-active);
    outline-offset: -2px;
  }
`;
