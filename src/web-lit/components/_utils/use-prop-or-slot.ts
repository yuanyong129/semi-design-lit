import { TemplateResult } from "lit";

export function hasPropOrSlot<T = { [key: string]: any }>(
  props: T,
  slots: Record<string, Element | TemplateResult | undefined>,
  propName: string
) {
  return Boolean((props as any)[propName] || slots[propName]);
}