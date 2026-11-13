import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const prefixCls = getPrefixCls('rating');
const p = (suffix: string) => unsafeCSS(`${prefixCls}${suffix}`);

export const styles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .${p('')} {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--semi-color-fill-0);
    outline: none;
    cursor: pointer;
  }

  .${p('')}:focus-visible {
    border-radius: var(--semi-border-radius-small);
    outline: 2px solid var(--semi-color-primary-light-active);
    outline-offset: 2px;
  }

  .${p('-star')} {
    position: relative;
    display: inline-block;
    line-height: 1;
    cursor: pointer;
  }

  .${p('-star-bg')},
  .${p('-star-fill')} {
    display: block;
    line-height: 1;
  }

  .${p('-star-fill')} {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    color: var(--semi-color-primary);
    white-space: nowrap;
    pointer-events: none;
  }

  .${p('-star-fill')} semi-icon-star-fill {
    display: block;
  }

  .${p('-disabled')} {
    cursor: default;
    opacity: 0.6;
  }

  .${p('-disabled')} .${p('-star')} {
    cursor: default;
  }

  .${p('-small')} .${p('-star')} {
    line-height: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    .${p('-star-fill')} {
      transition: width 0.15s ease;
    }
  }
`;
