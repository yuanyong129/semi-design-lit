import { nothing, ReactiveElement } from 'lit';
import { RenderContent } from "./types";

export type Slots = Record<string, RenderContent | undefined> & { default?: Element[] }; 

export function getChildElements (childNodes: NodeListOf<ChildNode>): ChildNode[] {
  const result: ChildNode[] = [];
  Array.from(childNodes).filter(item => item.nodeType !== 8).forEach(item => {
    if(item.nodeType === 3) {
      if(item.nodeValue?.replace('/n', '').trim() !== '') {
        result.push(item);
      }
    } else {
      result.push(item);
    }
  });
  return result;
}

export function querySlots (name?: string) {
  return function (target: any, property: string) {

    Object.defineProperty(target, property, {
      get(this: ReactiveElement) {
        if(name) {
          let element: HTMLElement | undefined = undefined;
          Array.from(this.childNodes).forEach((item: any) => {
            if(item.slot === name) {
              element = item;
            }
          });
          return element;
        } else {
          const elements: Slots = { };
          Array.from(this.childNodes).forEach((item: any) => {
            if(item.slot) {
              elements[item.slot] = item;
            }
          })
          elements['default'] = Array.from(this.childNodes).filter((item: any) => !item.slot) as Element[];
          return elements;
        }
      },
      enumerable: true,
      configurable: true
    });
  }
}

export function handleCustomSlot<T = any>(slot?: RenderContent, args?: T) {
  if(!slot) return undefined;

  if(typeof slot === 'function') { 
    return slot(args)
  }

  return slot;
}



export const NOOP = () => {
  return undefined;
};

export const isServerRendering = (() => {
  try {
    return !(typeof window !== 'undefined' && document !== undefined);
  } catch (e) {
    return true;
  }
})();


export const on = (() => {
  if (isServerRendering) {
    return NOOP;
  }
  return <K extends keyof HTMLElementEventMap>(
    element: HTMLElement | Window,
    event: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options: boolean | AddEventListenerOptions = false
  ) => {
    element.addEventListener(
      event,
      handler as EventListenerOrEventListenerObject,
      options
    );
  };
})();

export const off = (() => {
  if (isServerRendering) {
    return NOOP;
  }
  return <K extends keyof HTMLElementEventMap>(
    element: HTMLElement | Window,
    type: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options: boolean | EventListenerOptions = false
  ) => {
    element.removeEventListener(
      type,
      handler as EventListenerOrEventListenerObject,
      options
    );
  };
})();