import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";

const empty = getPrefixCls('empty');
const e = (suffix: string) => unsafeCSS(`${empty}${suffix}`);

export const styles = css`
  .${e('')} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    padding: 32px 0;
    color: var(--semi-color-text-2);
    text-align: center;
  }

  .${e('-horizontal')} {
    flex-direction: row;
    text-align: left;
  }

  .${e('-image')} {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    color: var(--semi-color-text-3);
    font-size: 72px;
    line-height: 1;
  }

  .${e('-image')} img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .${e('-horizontal')} .${e('-image')} {
    margin-right: 16px;
    margin-bottom: 0;
  }

  .${e('-content')} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .${e('-horizontal')} .${e('-content')} {
    align-items: flex-start;
  }

  .${e('-title')} {
    margin-bottom: 4px;
    color: var(--semi-color-text-1);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  .${e('-description')} {
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 20px;
  }
`;
