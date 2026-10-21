import { css, unsafeCSS } from "lit";
import { getPrefixCls } from '../../_utils/global-config';

export const prefixCls = getPrefixCls('link');
const l = (suffix: string) => unsafeCSS(`${prefixCls}${suffix}`);

export const styles = css`
  .${l('')} {
    display: inline-flex;
    align-items: center;
    color: var(--semi-color-link);
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .${l('')}:hover {
    color: var(--semi-color-link-hover);
  }

  .${l('')}:active {
    color: var(--semi-color-link-active);
  }

  .${l('-underline')} {
    text-decoration: underline;
  }

  .${l('-icon')} {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
    font-size: 14px;
  }

  .${l('-content')} {
    display: inline;
  }

  /* themes */
  .${l('-primary')} {
    color: var(--semi-color-primary);
  }

  .${l('-primary')}:hover {
    color: var(--semi-color-primary-hover);
  }

  .${l('-primary')}:active {
    color: var(--semi-color-primary-active);
  }

  .${l('-secondary')} {
    color: var(--semi-color-text-1);
  }

  .${l('-secondary')}:hover {
    color: var(--semi-color-text-0);
  }

  .${l('-secondary')}:active {
    color: var(--semi-color-text-0);
  }

  .${l('-tertiary')} {
    color: var(--semi-color-text-2);
  }

  .${l('-tertiary')}:hover {
    color: var(--semi-color-text-1);
  }

  .${l('-tertiary')}:active {
    color: var(--semi-color-text-0);
  }

  .${l('-success')} {
    color: var(--semi-color-success);
  }

  .${l('-success')}:hover {
    color: var(--semi-color-success-hover);
  }

  .${l('-success')}:active {
    color: var(--semi-color-success-active);
  }

  .${l('-warning')} {
    color: var(--semi-color-warning);
  }

  .${l('-warning')}:hover {
    color: var(--semi-color-warning-hover);
  }

  .${l('-warning')}:active {
    color: var(--semi-color-warning-active);
  }

  .${l('-danger')} {
    color: var(--semi-color-danger);
  }

  .${l('-danger')}:hover {
    color: var(--semi-color-danger-hover);
  }

  .${l('-danger')}:active {
    color: var(--semi-color-danger-active);
  }

  .${l('')}.${l('-disabled')},
  .${l('')}.${l('-disabled')}:hover,
  .${l('')}.${l('-disabled')}:active {
    color: var(--semi-color-disabled-text);
    text-decoration: none;
    cursor: not-allowed;
  }
`;
