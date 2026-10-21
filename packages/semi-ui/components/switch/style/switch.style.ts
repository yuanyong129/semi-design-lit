import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";

export const switchPrefixCls = getPrefixCls('switch');
const s = (suffix: string) => unsafeCSS(`${switchPrefixCls}${suffix}`);

export const styles = css`
  .${s('')} {
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 40px;
    height: 24px;
    padding: 0;
    vertical-align: middle;
    background-color: var(--semi-color-fill-0);
    border: none;
    border-radius: 12px;
    outline: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .${s('')}:hover {
    background-color: var(--semi-color-fill-1);
  }

  .${s('')}:active {
    background-color: var(--semi-color-fill-2);
  }

  .${s('')}:focus-visible {
    outline: 2px solid var(--semi-color-primary-light-active);
  }

  .${s('-checked')} {
    background-color: var(--semi-color-success);
  }

  .${s('-checked')}:hover {
    background-color: var(--semi-color-success-hover);
  }

  .${s('-checked')}:active {
    background-color: var(--semi-color-success-active);
  }

  .${s('-disabled')},
  .${s('-disabled')}:hover,
  .${s('-disabled')}:active {
    background-color: transparent;
    border: 1px solid var(--semi-color-border);
    cursor: not-allowed;
  }

  .${s('-disabled')}.${s('-checked')},
  .${s('-disabled')}.${s('-checked')}:hover,
  .${s('-disabled')}.${s('-checked')}:active {
    background-color: var(--semi-color-success-disabled);
    border-color: transparent;
  }

  .${s('-loading')} {
    cursor: default;
  }

  .${s('-knob')} {
    position: absolute;
    top: 3px;
    left: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: var(--semi-color-text-3);
    font-size: 10px;
    background-color: var(--semi-color-white);
    border: 1px solid var(--semi-color-border);
    border-radius: 50%;
    transition:
      left 0.2s ease,
      background-color 0.2s ease;
  }

  .${s('-checked')} .${s('-knob')} {
    left: calc(100% - 20px);
    color: var(--semi-color-success);
    border-color: transparent;
  }

  .${s('-disabled')} .${s('-knob')} {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-bg);
    border-color: var(--semi-color-border);
  }

  .${s('-loading')} .${s('-knob')} {
    color: var(--semi-color-success);
  }

  .${s('-inner')} {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  .${s('-text')} {
    display: block;
    color: var(--semi-color-text-2);
    font-size: 12px;
    line-height: 24px;
    white-space: nowrap;
  }

  .${s('-checked')} .${s('-text')} {
    color: var(--semi-color-white);
  }

  .${s('-checked')} .${s('-inner')} {
    justify-content: flex-start;
    padding: 0 26px 0 9px;
  }

  .${s('')}:not(.${s('-checked')}) .${s('-inner')} {
    justify-content: flex-end;
    padding: 0 9px 0 26px;
  }

  .${s('-with-text')} {
    width: auto;
    min-width: 48px;
    padding: 0;
  }

  .${s('-small')}.${s('-with-text')} {
    min-width: 28px;
  }

  .${s('-small')} .${s('-inner')} {
    display: none;
  }

  .${s('-large')}.${s('-with-text')} {
    min-width: 60px;
  }

  .${s('-large')} .${s('-inner')} {
    padding: 0 30px 0 10px;
  }

  .${s('-large')}:not(.${s('-checked')}) .${s('-inner')} {
    padding: 0 10px 0 30px;
  }

  /* size */
  .${s('-small')} {
    width: 26px;
    height: 16px;
    border-radius: 8px;
  }

  .${s('-small')} .${s('-knob')} {
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    font-size: 8px;
  }

  .${s('-small')}.${s('-checked')} .${s('-knob')} {
    left: calc(100% - 14px);
  }

  .${s('-large')} {
    width: 54px;
    height: 32px;
    border-radius: 16px;
  }

  .${s('-large')} .${s('-knob')} {
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .${s('-large')}.${s('-checked')} .${s('-knob')} {
    left: calc(100% - 27px);
  }

  .${s('-large')} .${s('-text')} {
    font-size: 14px;
    line-height: 32px;
  }
`;
