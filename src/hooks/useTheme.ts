import { palettes, fontFamily, typography, radius, spacing } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';

export function useTheme() {
  const mode = useUserStore((s) => s.themeMode);
  return { mode, colors: palettes[mode], fontFamily, typography, radius, spacing };
}
