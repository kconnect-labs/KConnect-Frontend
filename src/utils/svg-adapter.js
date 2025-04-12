import React from 'react';

var createSvgIcon = function(Component, displayName) {
  if (typeof Component === 'string') {
    var SvgIcon = function(props) {
      return React.createElement('img', {
        src: Component,
        alt: displayName || 'Icon',
        ...props
      });
    };
    
    SvgIcon.displayName = displayName || 'SvgIcon';
    return SvgIcon;
  }
  
  var SvgIcon = function(props) {
    return React.createElement(Component, props);
  };
  
  SvgIcon.displayName = displayName || 'SvgIcon';
  return SvgIcon;
}

var getSvgUrl = function(url) {
  return url;
}

var SvgAdapter = {
  createSvgIcon: createSvgIcon,
  getSvgUrl: getSvgUrl
};

export { createSvgIcon, getSvgUrl };
export default SvgAdapter; 