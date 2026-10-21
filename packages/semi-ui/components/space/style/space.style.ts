import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const space = getPrefixCls('space');
const s = (suffix: string) => unsafeCSS(`${space}${suffix}`);

export const styles = css`
  .${s('')} {
    display: inline-flex;
    box-sizing: border-box;
  }

  .${s('-horizontal')} {
    flex-direction: row;
  }

  .${s('-vertical')} {
    flex-direction: column;
  }

  .${s('-align-start')} {
    align-items: flex-start;
  }

  .${s('-align-end')} {
    align-items: flex-end;
  }

  .${s('-align-center')} {
    align-items: center;
  }

  .${s('-align-baseline')} {
    align-items: baseline;
  }

  .${s('-wrap')} {
    flex-wrap: wrap;
  }

  .${s('-rtl')} {
    direction: rtl;
  }

  ::slotted(*) {
    box-sizing: border-box;
  }
`;
