import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  .semi-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: var(--semi-color-text-0);
    font-size: 14px;
  }

  .semi-form-item {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 24px;
  }

  .semi-form-item-label {
    box-sizing: border-box;
    padding-right: 16px;
    color: var(--semi-color-text-1);
    line-height: 32px;
    text-align: right;
  }

  .semi-form-item-label > label {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    min-height: 32px;
    color: var(--semi-color-text-1);
    font-size: 14px;
  }

  .semi-form-item-required {
    margin-right: 2px;
    color: var(--semi-color-danger);
  }

  .semi-form-item-content {
    flex: 1;
    min-width: 0;
  }

  .semi-form-item-control {
    min-width: 0;
  }

  .semi-form-item-message,
  .semi-form-item-help,
  .semi-form-item-extra {
    margin-top: 4px;
    font-size: 12px;
    line-height: 20px;
  }

  .semi-form-item-message {
    color: var(--semi-color-danger);
  }

  .semi-form-item-help,
  .semi-form-item-extra {
    color: var(--semi-color-text-3);
  }

  .semi-form-item-error .semi-form-item-label > label {
    color: var(--semi-color-danger);
  }

  .semi-form-item-label-top {
    flex-direction: column;
  }

  .semi-form-item-label-left .semi-form-item-label {
    text-align: left;
  }

  .semi-form-item-label-left .semi-form-item-label > label {
    justify-content: flex-start;
  }

  .semi-form-item-label-top .semi-form-item-label {
    width: 100% !important;
    max-width: 100% !important;
    padding-right: 0;
    line-height: 20px;
    text-align: left;
  }

  .semi-form-item-label-top .semi-form-item-label > label {
    justify-content: flex-start;
    min-height: 22px;
  }

  .semi-form-item-label-top .semi-form-item-content {
    margin-top: 8px;
  }

  .semi-form-item-vertical {
    flex-direction: column;
  }

  .semi-form-item-vertical .semi-form-item-label {
    width: 100% !important;
    max-width: 100% !important;
    padding-right: 0;
    line-height: 20px;
    text-align: left;
  }

  .semi-form-item-vertical .semi-form-item-label > label {
    justify-content: flex-start;
    min-height: 22px;
  }

  .semi-form-item-vertical .semi-form-item-content {
    margin-top: 8px;
  }
`;
