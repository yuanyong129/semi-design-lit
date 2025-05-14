import { prefix } from '../../style/theme';
import { css, unsafeCSS } from 'lit';

const spacePrefixCls = `${prefix}-space`;

export const styles = css`
  .${unsafeCSS(spacePrefixCls)} {
    display: inline-flex;
  }

  .${unsafeCSS(spacePrefixCls)}-item:empty {
    display: none;
  }

  .${unsafeCSS(spacePrefixCls)}-horizontal .${unsafeCSS(spacePrefixCls)}-item {
    display: flex;
    align-items: center;
  }

  .${unsafeCSS(spacePrefixCls)}-vertical {
    flex-direction: column;
  }

  .${unsafeCSS(spacePrefixCls)}-align-baseline {
    align-items: baseline;
  }

  .${unsafeCSS(spacePrefixCls)}-align-start {
    align-items: flex-start;
  }

  .${unsafeCSS(spacePrefixCls)}-align-end {
    align-items: flex-end;
  }

  .${unsafeCSS(spacePrefixCls)}-align-center {
    align-items: center;
  }

  .${unsafeCSS(spacePrefixCls)}-wrap {
    flex-wrap: wrap;
  }

  .${unsafeCSS(spacePrefixCls)}-fill {
    display: flex;
  }
  
  .${unsafeCSS(spacePrefixCls)}-rtl {
    direction: rtl;
  }
`;