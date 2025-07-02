import { createElement } from 'react';
import { createSvgIcon as createMuiSvgIcon } from '@mui/material/utils';

export function createSvgIcon(path, displayName) {
  return createMuiSvgIcon(
    createElement('path', { d: path }),
    displayName
  );
}

// Экспортируем в глобальную область для обратной совместимости
if (typeof window !== 'undefined') {
  window.createSvgIcon = createSvgIcon;
} 