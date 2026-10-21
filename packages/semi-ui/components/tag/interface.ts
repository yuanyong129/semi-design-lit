export const TAG_COLORS = [
  'amber',
  'blue',
  'cyan',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'light-green',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
  'white',
] as const;

export type TagColor = typeof TAG_COLORS[number];

export type TagSize = 'small' | 'default' | 'large';
export type TagType = 'ghost' | 'solid' | 'light';
export type TagShape = 'square' | 'circle';
