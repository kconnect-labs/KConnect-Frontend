
window.createSvgIcon = function(Component, displayName) {
  if (typeof Component === 'function') {
    return Component;
  } else if (typeof Component === 'string') {
    return function DummySvgIcon() {
      return null;
    };
  }
  
  return function EmptySvgIcon() {
    return null;
  };
}; 