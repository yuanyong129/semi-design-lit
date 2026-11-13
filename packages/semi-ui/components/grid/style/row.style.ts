import { css, unsafeCSS } from 'lit';

const align = ['start', 'center', 'end', 'stretch']
  .map(
    (value) =>
      `.semi-row-align-${value} { align-items: ${
        value === 'start' ? 'flex-start' : value === 'end' ? 'flex-end' : value
      }; }`
  )
  .join('\n');

const justify = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly']
  .map(
    (value) =>
      `.semi-row-justify-${value} { justify-content: ${
        value === 'start' ? 'flex-start' : value === 'end' ? 'flex-end' : value
      }; }`
  )
  .join('\n');

export const rowStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  .semi-row {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    row-gap: var(--semi-grid-gutter-y, 0);
  }

  .semi-row-nowrap {
    flex-wrap: nowrap;
  }

  .semi-row-block {
    display: block;
  }

  ${unsafeCSS(align)}
  ${unsafeCSS(justify)}
`;
