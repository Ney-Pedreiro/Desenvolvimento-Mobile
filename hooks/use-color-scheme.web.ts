import { useEffect, useState } from 'react';
import { useAppTheme } from '@/contexts/ThemeContext';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { resolvedTheme } = useAppTheme();

  if (hasHydrated) {
    return resolvedTheme;
  }

  return 'light' as const;
}
