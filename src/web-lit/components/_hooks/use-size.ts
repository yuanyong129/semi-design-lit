import { Size } from "../_utils/constant";
import { ContextConsumer } from "@lit/context";
import { configProviderContext } from "../config-provider/context";
import { LitElement } from "lit";

export const useSize = (
  context: LitElement,
  size?: Size,
  { defaultValue = 'medium' } : { defaultValue?: Size } = {}
) => {

  const configProviderCtx = new ContextConsumer(context, { context : configProviderContext}).value;

  const mergedSize = size ?? configProviderCtx?.size ?? defaultValue;
  
  return { mergedSize } ;
}