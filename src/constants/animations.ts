import { Easing } from 'react-native-reanimated';

export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

export const SPRING_SOFT = {
  damping: 14,
  stiffness: 160,
  mass: 0.7,
};

export const TIMING = {
  entry: 350,
  chart: 1200,
  fast: 200,
};

export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_IN_OUT = Easing.inOut(Easing.cubic);
