import React from 'react';
function ensureCreateSvgIcon() {
  if (typeof window !== 'undefined') {
    window.createSvgIcon = function(Component, displayName) {
      if (typeof Component === 'string') {
        const SvgIcon = React.forwardRef((props, ref) => {
          return React.createElement('img', {
            src: Component,
            alt: displayName || 'Icon',
            ref: ref,
            ...props
          });
        });
        SvgIcon.displayName = displayName || 'SvgIcon';
        return SvgIcon;
      }
      const SvgIcon = React.forwardRef((props, ref) => {
        if (!Component) return null;
        return React.createElement(Component, {
          ...props,
          ref: ref
        });
      });
      SvgIcon.displayName = displayName || (Component && Component.displayName) || 'SvgIcon';
      return SvgIcon;
    };
    console.log('createSvgIcon function installed (React version)');
  }
}
ensureCreateSvgIcon();
export default ensureCreateSvgIcon; 