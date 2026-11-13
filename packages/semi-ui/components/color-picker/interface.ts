export interface HsvaColor {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ColorValue {
  hsva: HsvaColor;
  rgba: RgbaColor;
  hex: string;
}

export type ColorPickerFormat = 'hex' | 'rgba' | 'hsva';

export interface ColorPickerChangeDetail {
  value: ColorValue;
}

export interface ColorPickerColorChangeDetail {
  value: ColorValue;
}
