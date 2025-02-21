import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../_utils/global-config';

export const prefixCls = getPrefixCls('space');

export const styles = css`
  .${unsafeCSS(prefixCls)} {
    display: inline-flex;
  }
  .${unsafeCSS(prefixCls)}-horizontal .${unsafeCSS(prefixCls)}-item {
    display: flex;
    align-items: center;
  }

  .${unsafeCSS(prefixCls)}-vertical {
    flex-direction: column;
  }
  .${unsafeCSS(prefixCls)}-vertical .${unsafeCSS(prefixCls)}-item {
    width: 100%;
  }
  .${unsafeCSS(prefixCls)}-fill {
    display: flex;
  }
  .${unsafeCSS(prefixCls)}-align-baseline {
    align-items: baseline;
  }

  .${unsafeCSS(prefixCls)}-align-start {
    align-items: flex-start;
  }

  .${unsafeCSS(prefixCls)}-align-end {
    align-items: flex-end;
  }

  .${unsafeCSS(prefixCls)}-align-center {
    align-items: center;
  }

  .${unsafeCSS(prefixCls)}-wrap {
    flex-wrap: wrap;
  }
`;