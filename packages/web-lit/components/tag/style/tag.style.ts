import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";
import { TAG_COLORS } from "../interface";

export const tagPrefixCls = getPrefixCls('tag');
const t = (suffix: string) => unsafeCSS(`${tagPrefixCls}${suffix}`);

const colorCss = TAG_COLORS.map((color) => {
  if (color === 'white') {
    return `
      .${tagPrefixCls}-white-light,
      .${tagPrefixCls}-white-solid,
      .${tagPrefixCls}-white-ghost {
        color: var(--semi-color-text-0);
        background-color: var(--semi-color-bg-4);
        border-color: rgba(var(--semi-grey-2), 0.7);
      }
      .${tagPrefixCls}-white-solid {
        color: var(--semi-color-white);
      }
    `;
  }
  return `
    .${tagPrefixCls}-${color}-light {
      color: rgba(var(--semi-${color}-8), 1);
      background-color: rgba(var(--semi-${color}-5), 0.15);
    }
    .${tagPrefixCls}-${color}-solid {
      color: var(--semi-color-white);
      background-color: rgba(var(--semi-${color}-5), 1);
    }
    .${tagPrefixCls}-${color}-ghost {
      color: rgba(var(--semi-${color}-5), 1);
      background-color: transparent;
      border-color: rgba(var(--semi-${color}-4), 1);
    }
  `;
}).join('\n');

export const styles = css`
  .${t('')} {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    max-width: 100%;
    height: 20px;
    padding: 0 6px;
    color: var(--semi-color-text-0);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    vertical-align: bottom;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .${t('-circle')} {
    border-radius: var(--semi-border-radius-full);
  }

  .${t('-hidden')} {
    display: none;
  }

  .${t('-closable')} {
    padding-right: 4px;
  }

  .${t('-content')} {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .${t('-prefix-icon')},
  .${t('-suffix-icon')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .${t('-prefix-icon')} {
    margin-right: 4px;
  }

  .${t('-suffix-icon')} {
    margin-left: 4px;
  }

  .${t('-close')} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    margin-left: 4px;
    color: var(--semi-color-text-2);
    font-size: 8px;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;
  }

  .${t('-close')}:hover {
    color: var(--semi-color-text-1);
    background-color: var(--semi-color-fill-0);
  }

  /* size */
  .${t('-small')} {
    height: 20px;
    padding: 0 6px;
    font-size: 12px;
  }

  .${t('-large')} {
    height: 24px;
    padding: 0 6px;
    font-size: 12px;
    line-height: 20px;
  }

  .${t('-large')} .${t('-close')} {
    width: 14px;
    height: 14px;
    font-size: 10px;
  }

  /* color palette */
  ${unsafeCSS(colorCss)}

  .${t('-custom')} {
    color: var(--semi-color-white);
  }
`;
