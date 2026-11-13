export type ResizableDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

export type ResizableSize = {
  width?: string | number;
  height?: string | number;
};

export type ResizableEnable = Partial<Record<ResizableDirection, boolean>>;

export type ResizableHandleStyle = Partial<
  Record<ResizableDirection, Record<string, string | number>>
>;

export type ResizableHandleClass = Partial<Record<ResizableDirection, string>>;

export type ResizableHandleNode = Partial<Record<ResizableDirection, unknown>>;

export interface ResizableSnap {
  x?: number[];
  y?: number[];
}

export type ResizeStartCallback = (
  event: MouseEvent | TouchEvent,
  direction: ResizableDirection
) => void | boolean;

export type ResizeCallback = (
  size: ResizableSize,
  event: MouseEvent | TouchEvent,
  direction: ResizableDirection
) => void;

export interface ResizableChangeDetail extends ResizableSize {
  direction: ResizableDirection;
  event: MouseEvent | TouchEvent;
}
