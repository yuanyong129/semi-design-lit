import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";

const input = getPrefixCls('input');
const i = (suffix: string) => unsafeCSS(`${input}${suffix}`);

export const styles = css`
  .${i('-wrapper')} {
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    padding: 0 12px;
    color: var(--semi-color-text-0);
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    background-color: var(--semi-color-fill-0);
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: text;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  .${i('-wrapper')}:hover {
    background-color: var(--semi-color-fill-1);
  }

  .${i('-wrapper-focus')} {
    background-color: var(--semi-color-fill-0);
    border-color: var(--semi-color-focus-border);
  }

  .${i('-wrapper-focus')}:hover {
    background-color: var(--semi-color-fill-0);
  }

  .${i('-wrapper-readonly')} {
    cursor: default;
  }

  .${i('-wrapper-warning')} {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default);
  }

  .${i('-wrapper-warning')}:hover {
    background-color: var(--semi-color-warning-light-hover);
    border-color: var(--semi-color-warning-light-hover);
  }

  .${i('-wrapper-warning')}.${i('-wrapper-focus')} {
    border-color: var(--semi-color-warning);
  }

  .${i('-wrapper-error')} {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default);
  }

  .${i('-wrapper-error')}:hover {
    background-color: var(--semi-color-danger-light-hover);
    border-color: var(--semi-color-danger-light-hover);
  }

  .${i('-wrapper-error')}.${i('-wrapper-focus')} {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger);
  }

  .${i('-wrapper-success')} {
    background-color: var(--semi-color-success-light-default);
    border-color: var(--semi-color-success-light-default);
  }

  .${i('-wrapper-success')}.${i('-wrapper-focus')} {
    border-color: var(--semi-color-success);
  }

  .${i('-wrapper-disabled')} {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill);
    cursor: not-allowed;
  }

  .${i('-wrapper-disabled')}:hover {
    background-color: var(--semi-color-disabled-fill);
  }

  .${i('-wrapper-hidden')} {
    display: none;
  }

  .${i('-borderless')} {
    background-color: transparent;
    border-color: transparent;
  }

  .${i('-borderless')}:hover {
    background-color: transparent;
  }

  .${i('-borderless')}.${i('-wrapper-focus')} {
    background-color: transparent;
    border-color: transparent;
    box-shadow: 0 1px 0 0 var(--semi-color-focus-border);
  }

  .${i('')} {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    background-color: transparent;
    border: none;
    outline: none;
  }

  .${i('')}:disabled {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
  }

  .${i('')}::placeholder {
    color: var(--semi-color-text-2);
  }

  /* size */
  .${i('-wrapper-large')} {
    height: 40px;
    padding: 0 16px;
    font-size: 16px;
  }

  .${i('-wrapper-small')} {
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
  }

  .${i('-prefix')} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    margin-right: 8px;
    color: var(--semi-color-text-2);
    font-size: 16px;
    cursor: text;
  }

  .${i('-suffix')} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    margin-left: 8px;
    color: var(--semi-color-text-2);
    font-size: 16px;
    cursor: text;
  }

  .${i('-suffix-hidden')} {
    display: none;
  }

  .${i('-clearbtn')} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    color: var(--semi-color-text-3);
    font-size: 10px;
    background-color: var(--semi-color-fill-1);
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;
  }

  .${i('-clearbtn')}:hover {
    color: var(--semi-color-text-1);
    background-color: var(--semi-color-fill-2);
  }

  .${i('-modebtn')} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 6px;
    color: var(--semi-color-text-2);
    font-size: 16px;
    border-radius: 50%;
    cursor: pointer;
  }

  .${i('-modebtn')}:hover,
  .${i('-modebtn')}:focus-visible {
    color: var(--semi-color-text-0);
    outline: none;
  }

  .${i('-prepend')},
  .${i('-append')} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    box-sizing: border-box;
    padding: 0 12px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    white-space: nowrap;
    background-color: var(--semi-color-fill-0);
  }

  .${i('-prepend')} {
    margin-left: -12px;
    margin-right: 12px;
    border-right: 1px solid var(--semi-color-border);
    border-radius: 3px 0 0 3px;
  }

  .${i('-append')} {
    margin-left: 12px;
    margin-right: -12px;
    border-left: 1px solid var(--semi-color-border);
    border-radius: 0 3px 3px 0;
  }

  .${i('-wrapper-large')} .${i('-prepend')} {
    margin-left: -16px;
    padding: 0 16px;
  }

  .${i('-wrapper-large')} .${i('-append')} {
    margin-right: -16px;
    padding: 0 16px;
  }

  .${i('-wrapper-small')} .${i('-prepend')} {
    margin-left: -8px;
    padding: 0 8px;
  }

  .${i('-wrapper-small')} .${i('-append')} {
    margin-right: -8px;
    padding: 0 8px;
  }

  .${i('-wrapper-disabled')} .${i('-prepend')},
  .${i('-wrapper-disabled')} .${i('-append')} {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill);
  }
`;
