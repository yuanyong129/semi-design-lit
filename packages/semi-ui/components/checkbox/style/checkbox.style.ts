import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const checkbox = getPrefixCls('checkbox');
const group = getPrefixCls('checkbox-group');
const c = (suffix: string) => unsafeCSS(`${checkbox}${suffix}`);
const g = (suffix: string) => unsafeCSS(`${group}${suffix}`);

export const styles = css`
  .${c('')} {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    color: var(--semi-color-text-0);
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    user-select: none;
  }

  .${c('-input')} {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  .${c('-indicator')} {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    margin-top: 2px;
    color: var(--semi-color-white);
    font-size: 12px;
    background-color: var(--semi-color-fill-0);
    border: 1px solid var(--semi-color-border);
    border-radius: 3px;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  .${c('')}:hover .${c('-indicator')} {
    border-color: var(--semi-color-primary);
  }

  .${c('-checked')} .${c('-indicator')},
  .${c('-indeterminate')} .${c('-indicator')} {
    background-color: var(--semi-color-primary);
    border-color: var(--semi-color-primary);
  }

  .${c('-label')} {
    margin-left: 8px;
  }

  .${c('-disabled')} {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
  }

  .${c('-disabled')} .${c('-indicator')} {
    background-color: var(--semi-color-disabled-fill);
    border-color: var(--semi-color-disabled-border);
  }

  .${c('-disabled')}.${c('-checked')} .${c('-indicator')},
  .${c('-disabled')}.${c('-indeterminate')} .${c('-indicator')} {
    color: var(--semi-color-white);
    background-color: var(--semi-color-primary-disabled);
    border-color: var(--semi-color-primary-disabled);
  }

  .${g('')} {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
  }

  .${g('-vertical')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;
