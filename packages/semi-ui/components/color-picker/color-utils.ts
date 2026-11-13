import type { ColorValue, HsvaColor, RgbaColor } from './interface';

const round = (value: number, precision = 0) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const DEFAULT_COLOR: ColorValue = {
  hsva: { h: 176, s: 71, v: 77, a: 1 },
  rgba: { r: 57, g: 197, b: 187, a: 1 },
  hex: '#39c5bb',
};

const toHex = (value: number) => {
  const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
};

export const hexToRgba = (hex: string): RgbaColor => {
  let value = hex.trim();
  if (value.startsWith('#')) value = value.slice(1);
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }
  const alpha = value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
    a: round(alpha, 2),
  };
};

export const rgbaToHex = ({ r, g, b, a }: RgbaColor): string => {
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a === undefined || a === 1) return base;
  return `${base}${toHex(a * 255)}`;
};

export const rgbaToHsva = ({ r, g, b, a }: RgbaColor): HsvaColor => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  if (hue < 0) hue += 6;
  return {
    h: round(hue * 60),
    s: round(max ? (delta / max) * 100 : 0),
    v: round((max / 255) * 100),
    a: round(a ?? 1, 2),
  };
};

export const hsvaToRgba = ({ h, s, v, a }: HsvaColor): RgbaColor => {
  const hue = (h / 360) * 6;
  const saturation = s / 100;
  const value = v / 100;
  const index = Math.floor(hue);
  const chroma = value * (1 - saturation);
  const second = value * (1 - (hue - index) * saturation);
  const third = value * (1 - (1 - hue + index) * saturation);
  const module = index % 6;
  return {
    r: round([value, second, chroma, chroma, third, value][module] * 255),
    g: round([third, value, value, second, chroma, chroma][module] * 255),
    b: round([chroma, chroma, third, value, value, second][module] * 255),
    a: round(a ?? 1, 2),
  };
};

export const hsvaToHex = (hsva: HsvaColor): string => rgbaToHex(hsvaToRgba(hsva));

export const hexToHsva = (hex: string): HsvaColor => rgbaToHsva(hexToRgba(hex));

export const hsvaToHsla = ({ h, s, v, a }: HsvaColor) => {
  const lightness = ((200 - s) * v) / 100;
  return {
    h: round(h),
    s: round(
      lightness > 0 && lightness < 200
        ? ((s * v) / 100 / (lightness <= 100 ? lightness : 200 - lightness)) * 100
        : 0
    ),
    l: round(lightness / 2),
    a: round(a ?? 1, 2),
  };
};

export const hsvaToHslString = (hsva: HsvaColor): string => {
  const { h, s, l } = hsvaToHsla(hsva);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const hsvaToHslaString = (hsva: HsvaColor): string => {
  const { h, s, l, a } = hsvaToHsla(hsva);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};

export const hsvaToRgbaString = (hsva: HsvaColor): string => {
  const { r, g, b, a } = hsvaToRgba(hsva);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const parseRgba = (value: string): RgbaColor | null => {
  const match = /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i.exec(
    value
  );
  if (!match) return null;
  return {
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
  };
};

const parseHsva = (value: string): HsvaColor | null => {
  const match = /hsva?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i.exec(
    value
  );
  if (!match) return null;
  const angleUnits: Record<string, number> = { grad: 360 / 400, turn: 360, rad: 360 / (Math.PI * 2) };
  return {
    h: Number(match[1]) * (angleUnits[match[2]] || 1),
    s: Number(match[3]),
    v: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  };
};

export const colorStringToValue = (raw: string): ColorValue => {
  const value = raw.trim();
  if (value.startsWith('#')) {
    return {
      hsva: hexToHsva(value),
      rgba: hexToRgba(value),
      hex: value,
    };
  }
  if (value.toLowerCase().startsWith('rgba') || value.toLowerCase().startsWith('rgb')) {
    const rgba = parseRgba(value);
    if (!rgba) throw new Error(`Semi ColorPicker: error on static colorStringToValue method, input value is invalid: ${raw}`);
    return { hsva: rgbaToHsva(rgba), rgba, hex: rgbaToHex(rgba) };
  }
  if (value.toLowerCase().startsWith('hsva') || value.toLowerCase().startsWith('hsv')) {
    const hsva = parseHsva(value);
    if (!hsva) throw new Error(`Semi ColorPicker: error on static colorStringToValue method, input value is invalid: ${raw}`);
    return { hsva, rgba: hsvaToRgba(hsva), hex: hsvaToHex(hsva) };
  }
  throw new Error(`Semi ColorPicker: error on static colorStringToValue method, input value is invalid: ${raw}`);
};

export const formatColorInput = (color: ColorValue, format: ColorPickerFormatValue): string => {
  if (format === 'rgba') return `${color.rgba.r},${color.rgba.g},${color.rgba.b}`;
  if (format === 'hsva') return `${color.hsva.h},${color.hsva.s},${color.hsva.v}`;
  return color.hex.slice(0, 7);
};

type ColorPickerFormatValue = 'hex' | 'rgba' | 'hsva';

export const parseColorInput = (value: string, format: ColorPickerFormatValue): HsvaColor | RgbaColor | string | null => {
  if (format === 'rgba' || format === 'hsva') {
    const match = /^\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,?\s*([\d.]*)\s*$/.exec(value);
    if (!match) return null;
    const numbers = [match[1], match[2], match[3], match[4] === undefined || match[4] === '' ? 1 : match[4]].map(Number);
    const alpha = numbers[3];
    if (numbers.some((number) => Number.isNaN(number)) || alpha < 0 || alpha > 1) return null;
    if (format === 'rgba') {
      if (numbers[0] > 255 || numbers[1] > 255 || numbers[2] > 255) return null;
      return { r: numbers[0], g: numbers[1], b: numbers[2], a: alpha };
    }
    if (numbers[0] > 360 || numbers[1] > 100 || numbers[2] > 100) return null;
    return { h: numbers[0], s: numbers[1], v: numbers[2], a: alpha };
  }
  const hex = value.startsWith('#') ? value : `#${value}`;
  return /^#[\da-f]{6}([\da-f]{2})?$/i.test(hex) ? hex : null;
};
