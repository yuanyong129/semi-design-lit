import { css, unsafeCSS } from "lit";
import { getPrefixCls } from '../../_utils/global-config';

export const prefixCls = getPrefixCls('divider');

export const styles = css`
  .${unsafeCSS(prefixCls)}-horizontal {
    position: relative;
    clear: both;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    border-color: var(--color-neutral-3);
  }

  .${unsafeCSS(prefixCls)}-vertical {
    display: inline-block;
    min-width: 1px;
    max-width: 1px;
    height: 1em;
    margin: 0 12px;
    vertical-align: middle;
    border-left: 1px solid var(--color-neutral-3);
  }
`;