export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type GridGutter = number | [number, number];

export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface GridResponsiveValue {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
}
