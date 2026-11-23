import { Easing } from 'remotion';

export const COLORS = {
  navy: '#0A1628',
  teal: '#0F4C5C',
  gold: '#C9A24B',
  parchment: '#E8DCC0',
  stampRed: '#B3261E',
  textWhite: '#F5F1E6',
  darkBacking: 'rgba(10, 22, 40, 0.78)',
};

export const FONTS = {
  title: 'Impact, "Arial Black", "Liberation Sans", sans-serif',
  history: 'Georgia, "Liberation Serif", "Times New Roman", serif',
  ui: '"Liberation Sans", Arial, Helvetica, sans-serif',
  mono: '"Liberation Mono", "DejaVu Sans Mono", monospace',
};

export const SAFE_AREA = {
  paddingLeft: 96,
  paddingRight: 96,
  paddingTop: 54,
  paddingBottom: 54,
};

export const EASINGS = {
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),
  smoothOut: Easing.bezier(0.22, 1, 0.36, 1),
};
