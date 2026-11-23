import { Easing } from 'remotion';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadMono } from '@remotion/google-fonts/IBMPlexMono';

const { fontFamily: bebas } = loadBebas();
const { fontFamily: cormorant } = loadCormorant();
const { fontFamily: montserrat } = loadMontserrat();
const { fontFamily: mono } = loadMono();

export const COLORS = {
  navy: '#0A1628',
  teal: '#0F4C5C',
  gold: '#C9A24B',
  parchment: '#E8DCC0',
  stampRed: '#B3261E',
  textWhite: '#F5F1E6',
  darkBacking: 'rgba(10, 22, 40, 0.72)',
};

export const FONTS = {
  title: bebas,
  history: cormorant,
  ui: montserrat,
  mono: mono,
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
