import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";

const radio = getPrefixCls('radio');
const group = getPrefixCls('radio-group');
const r = (suffix: string) => unsafeCSS(`${radio}${suffix}`);
const g = (suffix: string) => unsafeCSS(`${group}${suffix}`);

export const styles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .${r('')} {
    position: relative;
    display: inline-flex;
    align-items: center;
    color: var(--semi-color-text-0);
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    cursor: pointer;
  }

  .${r('-input')} {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
  }

  .${r('-inner')} {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-color: transparent;
    border: 1px solid var(--semi-color-text-3);
    border-radius: 50%;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  .${r('')}:hover .${r('-inner')} {
    border-color: var(--semi-color-primary);
  }

  .${r('-input')}:focus-visible + .${r('-inner')} {
    box-shadow: 0 0 0 2px var(--semi-color-primary-light-active);
  }

  .${r('-checked')} .${r('-inner')} {
    background-color: var(--semi-color-primary);
    border-color: var(--semi-color-primary);
  }

  .${r('-checked')} .${r('-inner')}::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background-color: var(--semi-color-white);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    content: '';
  }

  .${r('-checked')}:hover .${r('-inner')} {
    background-color: var(--semi-color-primary-hover);
    border-color: var(--semi-color-primary-hover);
  }

  .${r('-addon')} {
    display: inline-flex;
    align-items: center;
  }

  .${r('-disabled')},
  .${r('-disabled')}:hover {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
  }

  .${r('-disabled')} .${r('-inner')},
  .${r('-disabled')}:hover .${r('-inner')} {
    background-color: var(--semi-color-disabled-fill);
    border-color: var(--semi-color-disabled-border);
  }

  .${r('-disabled')}.${r('-checked')} .${r('-inner')},
  .${r('-disabled')}.${r('-checked')}:hover .${r('-inner')} {
    background-color: var(--semi-color-primary-disabled);
    border-color: var(--semi-color-primary-disabled);
  }

  .${r('-disabled')}.${r('-checked')} .${r('-inner')}::after {
    background-color: var(--semi-color-white);
  }

  /* button type */
  .${r('-button')} {
    height: 28px;
    margin: 0;
    padding: 0 12px;
    color: var(--semi-color-text-1);
    font-weight: 600;
    border-radius: 4px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .${r('-button')}:hover {
    background-color: var(--semi-color-fill-1);
  }

  .${r('-button')}.${r('-checked')} {
    color: var(--semi-color-primary);
    background-color: var(--semi-color-bg-3);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  .${r('-button-solid')}.${r('-checked')} {
    color: var(--semi-color-white);
    background-color: var(--semi-color-primary);
    box-shadow: none;
  }

  .${r('-button-solid')}.${r('-checked')}:hover {
    background-color: var(--semi-color-primary-hover);
  }

  .${r('-button-outline')} {
    border: 1px solid var(--semi-color-border);
    border-radius: 0;
  }

  :host(:first-child) .${r('-button-outline')} {
    border-radius: 4px 0 0 4px;
  }

  :host(:last-child) .${r('-button-outline')} {
    border-radius: 0 4px 4px 0;
  }

  :host(:not(:first-child)) .${r('-button-outline')} {
    margin-left: -1px;
  }

  .${r('-button-outline')}.${r('-checked')} {
    color: var(--semi-color-primary);
    background-color: transparent;
    border-color: var(--semi-color-primary);
    box-shadow: none;
  }

  .${r('-button')}.${r('-disabled')} {
    color: var(--semi-color-disabled-text);
    background-color: transparent;
    box-shadow: none;
  }

  /* card type */
  .${r('-card')} {
    padding: 8px 12px;
    border: 1px solid var(--semi-color-border);
    border-radius: 6px;
    transition:
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .${r('-card')} .${r('-inner')} {
    display: none;
  }

  .${r('-card')}.${r('-checked')} {
    color: var(--semi-color-primary);
    background-color: var(--semi-color-primary-light-default);
    border-color: var(--semi-color-primary);
  }

  .${r('-card')}.${r('-disabled')} {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill);
    border-color: var(--semi-color-disabled-border);
  }

  /* group */
  .${g('')} {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    vertical-align: middle;
  }

  .${g('-vertical')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .${g('-button')} {
    gap: 0;
    padding: 2px;
    background-color: var(--semi-color-fill-0);
    border-radius: 6px;
  }

  .${g('-button-outline')} {
    padding: 0;
    background-color: transparent;
    border-radius: 0;
  }

  .${g('-disabled')} {
    cursor: not-allowed;
  }
`;
