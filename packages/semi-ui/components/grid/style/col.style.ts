import { css, unsafeCSS } from 'lit';

const percent = (value: number) => `${((value / 24) * 100).toFixed(6)}%`;

const widthRules = (prefix: string) =>
  Array.from({ length: 24 }, (_, index) => index + 1)
    .map((value) => `:host(.${prefix}-${value}) { width: ${percent(value)}; }`)
    .concat(`:host(.${prefix}-0) { display: none; }`)
    .join('\n');

const offsetRules = (prefix: string) =>
  Array.from({ length: 25 }, (_, value) => value)
    .filter((value) => value > 0)
    .map((value) => `:host(.${prefix}-offset-${value}) { margin-left: ${percent(value)}; }`)
    .join('\n');

const pushRules = (prefix: string) =>
  Array.from({ length: 25 }, (_, value) => value)
    .filter((value) => value > 0)
    .map(
      (value) =>
        `:host(.${prefix}-push-${value}) { left: ${percent(value)}; }\n:host(.${prefix}-pull-${value}) { right: ${percent(value)}; }`
    )
    .join('\n');

const breakpoints: Array<[string, number]> = [
  ['sm', 576],
  ['md', 768],
  ['lg', 992],
  ['xl', 1200],
  ['xxl', 1600],
];

const responsiveRules = breakpoints
  .map(
    ([name, width]) => `@media (min-width: ${width}px) {
${widthRules(`semi-col-${name}`)}
${offsetRules(`semi-col-${name}`)}
${pushRules(`semi-col-${name}`)}
}`
  )
  .join('\n');

export const colStyles = css`
  :host {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }

  .semi-col {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding-right: calc(var(--semi-grid-gutter-x, 0px) / 2);
    padding-left: calc(var(--semi-grid-gutter-x, 0px) / 2);
  }

  ${unsafeCSS(widthRules('semi-col'))}
  ${unsafeCSS(offsetRules('semi-col'))}
  ${unsafeCSS(pushRules('semi-col'))}
  ${unsafeCSS(widthRules('semi-col-xs'))}
  ${unsafeCSS(responsiveRules)}
`;
