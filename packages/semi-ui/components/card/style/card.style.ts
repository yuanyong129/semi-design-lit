import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const card = getPrefixCls('card');
const c = (suffix: string) => unsafeCSS(`${card}${suffix}`);

export const styles = css`
  :host {
    display: block;
    box-sizing: border-box;
    color: var(--semi-color-text-0);
  }

  .${c('')} {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--semi-color-bg-2);
    border-radius: 8px;
  }

  .${c('-bordered')} {
    border: 1px solid var(--semi-color-border);
  }

  .${c('-shadows-always')} {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .${c('-shadows-hover')} {
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .${c('-shadows-hover')}:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .${c('-cover')} {
    display: block;
    width: 100%;
    overflow: hidden;
    background-color: var(--semi-color-fill-0);
    line-height: 0;
  }

  .${c('-cover')} ::slotted(*) {
    display: block;
    width: 100%;
  }

  .${c('-cover')} ::slotted(img) {
    object-fit: cover;
  }

  .${c('-header')} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-sizing: border-box;
    min-height: 52px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--semi-color-border);
  }

  .${c('-header-title')} {
    min-width: 0;
    color: var(--semi-color-text-0);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .${c('-header-extra')} {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 20px;
  }

  .${c('-body')} {
    box-sizing: border-box;
    padding: 24px;
    color: var(--semi-color-text-1);
    font-size: 14px;
    line-height: 22px;
  }

  .${c('-body-loading')} {
    padding: 24px;
  }

  .${c('-footer')} {
    box-sizing: border-box;
    padding: 14px 24px;
    border-top: 1px solid var(--semi-color-border);
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 22px;
  }

  .${c('-actions')} {
    display: flex;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--semi-color-border);
    list-style: none;
  }

  .${c('-action')} {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    min-width: 0;
    padding: 12px 8px;
    color: var(--semi-color-text-2);
    font-size: 14px;
  }

  .${c('-action')} + .${c('-action')} {
    border-left: 1px solid var(--semi-color-border);
  }
`;
