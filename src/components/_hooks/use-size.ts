import { Size } from "../_utils/constant";

export const useSize = (
  size?: Size,
  { defaultValue = 'medium' } : { defaultValue?: Size } = {}
) => {
  return size ?? defaultValue;
}