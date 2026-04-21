export { useAppTheme as useColorSchemeContext } from '@/contexts/ThemeContext';
import { useAppTheme } from '@/contexts/ThemeContext';

export function useColorScheme() {
  const { resolvedTheme } = useAppTheme();
  return resolvedTheme;
}
