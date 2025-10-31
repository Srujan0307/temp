
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';

export function useIsCollapsed() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>(
    'sidebar-collapsed',
    isMobile,
  );

  return [isMobile ? true : isCollapsed, setIsCollapsed] as const;
}
