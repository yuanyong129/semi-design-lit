import { TemplateResult } from "lit";

export type Slots = Record<string, Element | TemplateResult | undefined>; 

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


export function getSlots(children: HTMLCollection): Slots {
  const result: Slots = {};
  Array.from(children).forEach((item) => {
    if(item.slot) {
      result[item.slot] = item;
    }
  })
  return result;
} 