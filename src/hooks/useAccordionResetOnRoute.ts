import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAccordionResetOnRoute(initialValue = '') {
  const { pathname } = useLocation();
  const [openItem, setOpenItem] = useState(initialValue);

  useEffect(() => {
    setOpenItem(initialValue);
  }, [pathname, initialValue]);

  return [openItem, setOpenItem] as const;
}
