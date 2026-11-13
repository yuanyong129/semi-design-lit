import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const prefixCls = getPrefixCls('pin-code');
const p = (suffix: string) => unsafeCSS(`${prefixCls}${suffix}`);

export const styles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  .${p('')} {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .${p('-input')} {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    color: var(--semi-color-text-0);
    font-family: inherit;
    font-size: 18px;
    font-weight: 600;
    line-height: 38px;
    text-align: center;
    background-color: var(--semi-color-bg-2);
    border: 1px solid var(--semi-color-border);
    border-radius: var(--semi-border-radius-small);
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .${p('-input')}:hover:not(:disabled) {
    border-color: var(--semi-color-primary-light-active);
  }

  .${p('-input')}:focus,
  .${p('-input-active')} {
    border-color: var(--semi-color-primary);
    box-shadow: 0 0 0 2px var(--semi-color-primary-light-default);
  }

  .${p('-input')}:disabled {
    color: var(--semi-color-text-2);
    background-color: var(--semi-color-disabled-fill);
    cursor: not-allowed;
  }

  .${p('-small')} .${p('-input')} {
    width: 32px;
    height: 32px;
    font-size: 16px;
    line-height: 30px;
  }

  .${p('-large')} .${p('-input')} {
    width: 48px;
    height: 48px;
    font-size: 20px;
    line-height: 46px;
  }

  .${p('-error')} .${p('-input')} {
    border-color: var(--semi-color-danger);
  }

  .${p('-error')} .${p('-input')}:focus {
    box-shadow: 0 0 0 2px var(--semi-color-danger-light-default);
  }

  .${p('-warning')} .${p('-input')} {
    border-color: var(--semi-color-warning);
  }

  .${p('-warning')} .${p('-input')}:focus {
    box-shadow: 0 0 0 2px var(--semi-color-warning-light-default);
  }
`;
