import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const badge = getPrefixCls('badge');
const b = (suffix: string) => unsafeCSS(`${badge}${suffix}`);

export const styles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .${b('')} {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .${b('-count')} {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    box-sizing: border-box;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    transform: translate(50%, -50%);
    border-radius: 10px;
    background-color: var(--semi-color-danger);
    box-shadow: 0 0 0 2px var(--semi-color-bg-0);
    color: var(--semi-color-white);
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    white-space: nowrap;
  }

  .${b('-count-primary')} {
    background-color: var(--semi-color-primary);
  }

  .${b('-count-success')} {
    background-color: var(--semi-color-success);
  }

  .${b('-count-warning')} {
    background-color: var(--semi-color-warning);
  }

  .${b('-count-danger')} {
    background-color: var(--semi-color-danger);
  }

  .${b('-dot')} {
    box-sizing: border-box;
    width: 8px;
    min-width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
  }

  .${b('-status')} {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 20px;
  }

  .${b('-status-dot')} {
    display: inline-block;
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: var(--semi-color-info);
  }

  .${b('-status-success')} .${b('-status-dot')} {
    background-color: var(--semi-color-success);
  }

  .${b('-status-warning')} .${b('-status-dot')} {
    background-color: var(--semi-color-warning);
  }

  .${b('-status-danger')} .${b('-status-dot')} {
    background-color: var(--semi-color-danger);
  }
`;
