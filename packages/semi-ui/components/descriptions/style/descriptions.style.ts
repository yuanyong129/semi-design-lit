import { css } from 'lit';

export const descriptionsStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  .semi-descriptions {
    display: grid;
    grid-template-columns: repeat(var(--semi-descriptions-columns, 3), minmax(0, 1fr));
    width: 100%;
    box-sizing: border-box;
  }

  .semi-descriptions slot {
    display: contents;
  }

  .semi-descriptions-bordered {
    border: 1px solid var(--semi-color-border);
    border-radius: var(--semi-border-radius-medium);
    overflow: hidden;
  }
`;
