import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Custom hook to enable smooth mouse wheel horizontal scrolling,
 * arrow button navigation, and scroll overflow state for desktop web.
 */
export function useHorizontalScroll() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const node = scrollRef.current?.getScrollableNode?.() || scrollRef.current;
    if (!node) return;
    
    // Check if scrolled away from start
    setCanScrollLeft(node.scrollLeft > 5);
    // Check if can scroll further right
    setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 5);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = scrollRef.current?.getScrollableNode?.() || scrollRef.current;
    if (!node) return;

    // Attach wheel listener to convert vertical wheel to horizontal scroll
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && node.scrollWidth > node.clientWidth) {
        e.preventDefault();
        node.scrollLeft += e.deltaY;
        checkScroll();
      }
    };

    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('scroll', checkScroll, { passive: true });
    
    // Initial check
    checkScroll();

    // Resize observer or window resize listener to update scroll bounds
    window.addEventListener('resize', checkScroll);

    return () => {
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scrollBy = (offset) => {
    const node = scrollRef.current?.getScrollableNode?.() || scrollRef.current;
    if (node) {
      if (typeof node.scrollBy === 'function') {
        node.scrollBy({ left: offset, behavior: 'smooth' });
      } else {
        node.scrollLeft += offset;
      }
      setTimeout(checkScroll, 300);
    }
  };

  return {
    scrollRef,
    scrollBy,
    canScrollLeft,
    canScrollRight,
    checkScroll,
  };
}
