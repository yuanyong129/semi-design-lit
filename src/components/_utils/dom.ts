export function getChildElements (childNodes: NodeListOf<ChildNode>): ChildNode[] {
  const result: ChildNode[] = [];
  childNodes.forEach(item => {
    if(item.nodeType === 3) {
      if(item.nodeValue?.replace('/n', '').trim() !== '') {
        result.push(item);
      }
    } else {
      return result.push(item);
    }
  });
  return result;
}


export function getSlots(children: HTMLCollection): Record<string, Element> {
  const result: Record<string, Element> = {};
  Array.from(children).forEach((item) => {
    if(item.slot) {
      result[item.slot] = item;
    }
  })
  return result;
} 