export const getLighterColor = (hexColor, factor = 0.3) => {
  if (!hexColor || hexColor === 'transparent' || hexColor.startsWith('rgba')) {
    return hexColor;
  }
  
  const hex = hexColor.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const lighter = (component) => Math.min(255, Math.floor(component + (255 - component) * factor));
  
  return `#${lighter(r).toString(16).padStart(2, '0')}${lighter(g).toString(16).padStart(2, '0')}${lighter(b).toString(16).padStart(2, '0')}`;
}; 