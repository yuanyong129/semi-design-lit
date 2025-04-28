import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../_utils/global-config';

export const prefixCls = getPrefixCls('icon');
const prefixClsCss = unsafeCSS(prefixCls);

export const styles = css`
  .${prefixClsCss} {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    font-style: normal;
    vertical-align: -2px;
    outline: none;
    stroke: currentColor;
  }
`;