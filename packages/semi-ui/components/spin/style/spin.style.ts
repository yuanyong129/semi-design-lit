import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const prefixCls = getPrefixCls('spin');
const p = (suffix: string) => unsafeCSS(`${prefixCls}${suffix}`);

export const styles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  :host(.semi-spin-host-block) {
    display: block;
  }

  .${p('')} {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--semi-color-primary);
  }

  .${p('-block')} {
    display: block;
    width: 100%;
  }

  .${p('-hidden')} .${p('-wrapper')} {
    display: none;
  }

  .${p('-wrapper')} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .${p('-block')} > .${p('-wrapper')} {
    position: absolute;
    inset: 0;
    z-index: 2;
    background-color: rgba(var(--semi-white), 0.6);
  }

  .${p('-spinner')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .${p('-icon')} {
    display: block;
    width: 20px;
    height: 20px;
    animation: semi-spin-rotate 0.8s linear infinite;
  }

  .${p('-small')} .${p('-icon')} {
    width: 14px;
    height: 14px;
  }

  .${p('-large')} .${p('-icon')} {
    width: 32px;
    height: 32px;
  }

  .${p('-tip')} {
    color: var(--semi-color-primary);
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
  }

  .${p('-children')} {
    position: relative;
    width: 100%;
    transition: opacity 0.2s ease;
  }

  .${p('-block')}:not(.${p('-hidden')}) > .${p('-children')} {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }

  @keyframes semi-spin-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .${p('-icon')} {
      animation-duration: 2s;
    }
  }
`;
