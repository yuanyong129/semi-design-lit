export function hasPropOrSlot<T = { [key: string]: any }>(
  props: T,
  slots: Record<string, Element>,
  propName: string
) {
  return Boolean((props as any)[propName] || slots[propName]);
}