import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const avatar = getPrefixCls('avatar');
const a = (suffix: string) => unsafeCSS(`${avatar}${suffix}`);

export const styles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .${a('')} {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--semi-color-primary);
    color: var(--semi-color-white);
    font-weight: 600;
    line-height: 1;
    text-align: center;
    user-select: none;
  }

  .${a('-circle')} {
    border-radius: 50%;
  }

  .${a('-square')} {
    border-radius: 4px;
  }

  .${a('-extra-small')} {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }

  .${a('-small')} {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }

  .${a('-default')} {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .${a('-medium')} {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }

  .${a('-large')} {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

  .${a('-extra-large')} {
    width: 64px;
    height: 64px;
    font-size: 22px;
  }

  .${a('-image')} {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .${a('')} ::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
