import { useState } from 'react';

export const useLightbox = () => {
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const openLightbox = (imageUrl) => {
    setCurrentImage(imageUrl);
    setLightboxIsOpen(true);
  };

  const closeLightbox = () => {
    setLightboxIsOpen(false);
    setCurrentImage('');
  };

  return {
    lightboxIsOpen,
    currentImage,
    openLightbox,
    closeLightbox
  };
}; 