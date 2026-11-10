import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    color: var(--semi-color-text-2);
    font-size: inherit;
    line-height: inherit;
    white-space: nowrap;
  }

  :host(:not(:last-child))::after {
    content: var(--semi-breadcrumb-separator, '/');
    margin: 0 var(--semi-breadcrumb-separator-gap, 8px);
    color: var(--semi-color-text-3);
    font-weight: 400;
  }

  :host(:last-child) {
    color: var(--semi-color-text-0);
    font-weight: 500;
  }

  :host([disabled]) {
    color: var(--semi-color-text-3);
    pointer-events: none;
  }

  a,
  .text {
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: var(--semi-color-primary);
  }
`;
