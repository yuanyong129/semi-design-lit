import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../_utils/global-config";

const divider = getPrefixCls('divider');
const d = (suffix: string) => unsafeCSS(`${divider}${suffix}`);

export const styles = css`
  .${d('')} {
    box-sizing: border-box;
  }

  .${d('-horizontal')} {
    position: relative;
    clear: both;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    margin: 16px 0;
    border-bottom: 1px solid var(--semi-color-border);
  }

  .${d('-vertical')} {
    display: inline-block;
    min-width: 1px;
    max-width: 1px;
    height: 1em;
    min-height: 1em;
    margin: 0 8px;
    vertical-align: middle;
    border-left: 1px solid var(--semi-color-border);
  }

  .${d('-with-text')} {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 16px 0;
    color: var(--semi-color-text-2);
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    border-bottom: 0;
  }

  .${d('-with-text')}::before,
  .${d('-with-text')}::after {
    display: block;
    flex: 1;
    border-top: 1px solid var(--semi-color-border);
    content: '';
  }

  .${d('-text')} {
    display: inline-block;
    padding: 0 12px;
  }

  /* text orientation */
  .${d('-text-left')}::before {
    flex: 0 0 24px;
  }

  .${d('-text-right')}::after {
    flex: 0 0 24px;
  }

  /* custom line style */
  .${d('-horizontal')}.${d('-dashed')} {
    border-bottom-style: dashed;
  }

  .${d('-horizontal')}.${d('-dotted')} {
    border-bottom-style: dotted;
  }

  .${d('-vertical')}.${d('-dashed')} {
    border-left-style: dashed;
  }

  .${d('-vertical')}.${d('-dotted')} {
    border-left-style: dotted;
  }

  .${d('-with-text')}.${d('-dashed')}::before,
  .${d('-with-text')}.${d('-dashed')}::after {
    border-top-style: dashed;
  }

  .${d('-with-text')}.${d('-dotted')}::before,
  .${d('-with-text')}.${d('-dotted')}::after {
    border-top-style: dotted;
  }
`;
