import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";
import { Radius, transitionDuration2 } from "../../style/theme";

const btn = getPrefixCls('button');
const p = (suffix: string) => unsafeCSS(`${btn}${suffix}`);

export const styles = css`
  .${p('')} {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 32px;
    padding: 0 12px;
    color: var(--semi-color-text-0);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    vertical-align: middle;
    background-color: var(--semi-color-fill-0);
    border: 1px solid transparent;
    border-radius: ${unsafeCSS(Radius.radiusSmall)};
    outline: none;
    cursor: pointer;
    user-select: none;
    -webkit-appearance: none;
    transition:
      background-color ${unsafeCSS(transitionDuration2)} ease,
      border-color ${unsafeCSS(transitionDuration2)} ease,
      color ${unsafeCSS(transitionDuration2)} ease;
  }

  .${p('')}:focus-visible {
    outline: 2px solid var(--semi-color-primary-light-active);
    outline-offset: 0;
  }

  .${p('')}:disabled,
  .${p('')}.${p('-disabled')} {
    cursor: not-allowed;
  }

  .${p('')}:active {
    transition: none;
  }

  .${p('-content')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .${p('-icon')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .${p('-icon')} + .${p('-content')} {
    margin-left: 8px;
  }

  .${p('-content')} + .${p('-icon')} {
    margin-left: 8px;
  }

  .${p('-icon-only')} {
    width: 32px;
    padding: 0;
  }

  .${p('-block')} {
    display: flex;
    width: 100%;
  }

  .${p('-loading')} {
    cursor: default;
    pointer-events: none;
  }

  .${p('-loading')} .${p('-content')},
  .${p('-loading')} .${p('-icon')} {
    opacity: 0.75;
  }

  /* size */
  .${p('-size-large')} {
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
  }

  .${p('-size-large')}.${p('-icon-only')} {
    width: 40px;
    padding: 0;
  }

  .${p('-size-small')} {
    height: 24px;
    padding: 0 12px;
    font-size: 14px;
  }

  .${p('-size-small')}.${p('-icon-only')} {
    width: 24px;
    padding: 0;
  }

  /* type palettes */
  .${p('-primary')} {
    --semi-btn-accent: var(--semi-color-primary);
    --semi-btn-accent-hover: var(--semi-color-primary-hover);
    --semi-btn-accent-active: var(--semi-color-primary-active);
    --semi-btn-solid: var(--semi-color-primary);
    --semi-btn-solid-hover: var(--semi-color-primary-hover);
    --semi-btn-solid-active: var(--semi-color-primary-active);
  }

  .${p('-secondary')} {
    --semi-btn-accent: var(--semi-color-secondary);
    --semi-btn-accent-hover: var(--semi-color-secondary-hover);
    --semi-btn-accent-active: var(--semi-color-secondary-active);
    --semi-btn-solid: var(--semi-color-secondary);
    --semi-btn-solid-hover: var(--semi-color-secondary-hover);
    --semi-btn-solid-active: var(--semi-color-secondary-active);
    --semi-btn-outline-border: var(--semi-color-border);
  }

  .${p('-tertiary')} {
    --semi-btn-accent: var(--semi-color-text-1);
    --semi-btn-accent-hover: var(--semi-color-text-0);
    --semi-btn-accent-active: var(--semi-color-text-0);
    --semi-btn-solid: var(--semi-color-tertiary);
    --semi-btn-solid-hover: var(--semi-color-tertiary-hover);
    --semi-btn-solid-active: var(--semi-color-tertiary-active);
    --semi-btn-outline-border: var(--semi-color-border);
  }

  .${p('-warning')} {
    --semi-btn-accent: var(--semi-color-warning);
    --semi-btn-accent-hover: var(--semi-color-warning-hover);
    --semi-btn-accent-active: var(--semi-color-warning-active);
    --semi-btn-solid: var(--semi-color-warning);
    --semi-btn-solid-hover: var(--semi-color-warning-hover);
    --semi-btn-solid-active: var(--semi-color-warning-active);
  }

  .${p('-danger')} {
    --semi-btn-accent: var(--semi-color-danger);
    --semi-btn-accent-hover: var(--semi-color-danger-hover);
    --semi-btn-accent-active: var(--semi-color-danger-active);
    --semi-btn-solid: var(--semi-color-danger);
    --semi-btn-solid-hover: var(--semi-color-danger-hover);
    --semi-btn-solid-active: var(--semi-color-danger-active);
  }

  /* theme: light */
  .${p('-light')} {
    color: var(--semi-btn-accent);
    background-color: var(--semi-color-fill-0);
    border-color: transparent;
  }

  .${p('-light')}:hover {
    color: var(--semi-btn-accent-hover);
    background-color: var(--semi-color-fill-1);
  }

  .${p('-light')}:active {
    color: var(--semi-btn-accent-active);
    background-color: var(--semi-color-fill-2);
  }

  .${p('-light')}.${p('-disabled')},
  .${p('-light')}:disabled {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-fill-0);
    border-color: transparent;
  }

  /* theme: solid */
  .${p('-solid')} {
    color: var(--semi-color-white);
    background-color: var(--semi-btn-solid);
    border-color: var(--semi-btn-solid);
  }

  .${p('-solid')}:hover {
    background-color: var(--semi-btn-solid-hover);
    border-color: var(--semi-btn-solid-hover);
  }

  .${p('-solid')}:active {
    background-color: var(--semi-btn-solid-active);
    border-color: var(--semi-btn-solid-active);
  }

  .${p('-solid')}.${p('-disabled')},
  .${p('-solid')}:disabled {
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-bg);
    border-color: var(--semi-color-disabled-bg);
  }

  /* theme: outline */
  .${p('-outline')} {
    color: var(--semi-btn-accent);
    background-color: transparent;
    border-color: var(--semi-btn-outline-border, var(--semi-btn-accent));
  }

  .${p('-outline')}:hover {
    color: var(--semi-btn-accent-hover);
    background-color: var(--semi-color-fill-0);
    border-color: var(--semi-btn-accent-hover);
  }

  .${p('-outline')}:active {
    color: var(--semi-btn-accent-active);
    background-color: var(--semi-color-fill-1);
    border-color: var(--semi-btn-accent-active);
  }

  .${p('-outline')}.${p('-disabled')},
  .${p('-outline')}:disabled {
    color: var(--semi-color-disabled-text);
    background-color: transparent;
    border-color: var(--semi-color-disabled-border);
  }

  /* theme: borderless */
  .${p('-borderless')} {
    color: var(--semi-btn-accent);
    background-color: transparent;
  }

  .${p('-borderless')}:hover {
    color: var(--semi-btn-accent-hover);
    background-color: var(--semi-color-fill-0);
  }

  .${p('-borderless')}:active {
    color: var(--semi-btn-accent-active);
    background-color: var(--semi-color-fill-1);
  }

  .${p('-borderless')}.${p('-disabled')},
  .${p('-borderless')}:disabled {
    color: var(--semi-color-disabled-text);
    background-color: transparent;
  }

  /* link style button */
  .${p('-link')} {
    text-decoration: none;
  }

  .${p('-link')}.${p('-icon-only')} {
    vertical-align: middle;
  }

  /* button group */
  .${p('-in-group')}.${p('-group-first')} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .${p('-in-group')}.${p('-group-last')} {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .${p('-in-group')}.${p('-group-middle')} {
    border-radius: 0;
  }

  .${p('-in-group')}.${p('-outline')}:not(.${p('-group-first')}) {
    margin-left: -1px;
  }

  .${p('-in-group')}:hover,
  .${p('-in-group')}:active,
  .${p('-in-group')}:focus-visible {
    z-index: 1;
  }
`;

export const groupStyles = css`
  .${unsafeCSS(getPrefixCls('button-group'))} {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .${unsafeCSS(getPrefixCls('button-group'))}-block {
    display: flex;
    width: 100%;
  }

  ::slotted(semi-button) {
    display: inline-flex;
  }

  .${unsafeCSS(getPrefixCls('button-group'))}-block ::slotted(semi-button) {
    flex: 1;
  }
`;
