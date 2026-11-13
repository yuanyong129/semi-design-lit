export type BackTopTarget =
  | HTMLElement
  | string
  | (() => HTMLElement | Window | null | undefined)
  | null;

export interface BackTopClickDetail {
  target: HTMLElement | Window;
}
