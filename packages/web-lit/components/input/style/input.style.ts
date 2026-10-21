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

  .${i('-wrapper-error')} {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default);
  }

  .${i('-wrapper-error')}.${i('-wrapper-focus')} {
    border-color: var(--semi-color-danger);
  }

  .${i('-wrapper-error')}:hover {
    background-color: var(--semi-color-danger-light-hover);
    border-color: var(--semi-color-danger-light-hover);
  }

  .${i('-wrapper-error')}.${i('-wrapper-focus')}:hover {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger);
  }

  .${i('-wrapper-disabled')} {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill);
    cursor: not-allowed;
  }

  .${i('-wrapper-disabled')}:hover {
    background-color: var(--semi-color-disabled-fill);
  }

  .${i('-wrapper-borderless')} {
    background-color: transparent;
    border-color: transparent;
  }

  .${i('-wrapper-borderless')}:hover {
    background-color: transparent;
  }

  .${i('-wrapper-borderless')}.${i('-wrapper-focus')} {
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
    align-items: center;
    margin-right: 8px;
    color: var(--semi-color-text-2);
    font-size: 16px;
  }

  .${i('-suffix')} {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    color: var(--semi-color-text-2);
    font-size: 16px;
  }

  .${i('-clearbtn')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    color: var(--semi-color-text-3);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .${i('-clearbtn')}:hover {
    color: var(--semi-color-text-2);
  }

  /* input group with addons */
  .${i('-group')} {
    display: inline-flex;
    align-items: stretch;
    width: 100%;
  }

  .${i('-addon')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 12px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    white-space: nowrap;
    background-color: var(--semi-color-fill-0);
    border: 1px solid var(--semi-color-border);
  }

  .${i('-addon-before')} {
    border-right: none;
    border-radius: 3px 0 0 3px;
  }

  .${i('-addon-after')} {
    border-left: none;
    border-radius: 0 3px 3px 0;
  }

  .${i('-group')} .${i('-wrapper')} {
    flex: 1;
  }

  .${i('-group')} .${i('-addon-before')} + .${i('-wrapper')} {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .${i('-group')} .${i('-wrapper')}:has(+ .${i('-addon-after')}) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;
