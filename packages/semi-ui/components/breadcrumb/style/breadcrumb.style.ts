import { css, unsafeCSS } from 'lit';
import { getPrefixCls } from '../../_utils/global-config';

const breadcrumb = getPrefixCls('breadcrumb');
const b = (suffix: string) => unsafeCSS(`${breadcrumb}${suffix}`);

export const breadcrumbStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 20px;
  }

  :host([compact]) {
    font-size: 12px;
    line-height: 18px;
  }

  .${b('')} {
    box-sizing: border-box;
    color: var(--semi-color-text-2);
    font-size: 14px;
    line-height: 20px;
  }

  .${b('-compact')} {
    font-size: 12px;
  }

  .${b('-list')} {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;
