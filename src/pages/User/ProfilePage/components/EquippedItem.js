import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import OptimizedImage from '../../../../components/OptimizedImage';

const particleAnimation = (color) => keyframes`
  0% {
    transform: scale(1) translate(0, 0) rotate(0deg);
    opacity: 0.9;
  }
  100% {
    transform: scale(${Math.random() * 0.8 + 0.8}) translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 150}px) rotate(${Math.random() * 360}deg);
    opacity: 0;
  }
`;

const levitationAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const EquippedItemContainer = styled(Box)(({ index }) => {
    const positions = [
        { top: '-15px', right: '0px', zIndex: 12 }, // Верхний-правый
        { top: '70px', right: '-20px', zIndex: 11 }, // Нижний-правый
        { top: '70px', left: '-20px', zIndex: 10, right: 'auto' }, // Нижний-левый
    ];
    const position = positions[index] || positions[0];

    return {
        position: 'absolute',
        ...position,
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        animation: `${levitationAnimation} ${3 + Math.random()}s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`,
    };
});

const ItemImage = styled(OptimizedImage)({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'relative',
  zIndex: 1,
});

const ParticlesContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
});

const StarParticle = styled(Box)(({ color, delay, duration }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: `${Math.random() * 8 + 4}px`,
  height: `${Math.random() * 8 + 4}px`,
  background: `radial-gradient(circle at center, ${color} 0%, ${color} 50%, transparent 100%)`,
  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  animation: `${particleAnimation(color)} ${duration}s ease-out infinite`,
  animationDelay: `${delay}s`,
  opacity: 0,
  transform: 'translate(-50%, -50%)',
}));

const getAverageColor = (imgElement, callback) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const width = imgElement.width;
  const height = imgElement.height;

  if (width === 0 || height === 0) {
    callback('rgba(208, 188, 255, 0.8)');
    return;
  }

  canvas.width = width;
  canvas.height = height;

  context.drawImage(imgElement, 0, 0);

  let data;
  try {
    data = context.getImageData(0, 0, width, height).data;
  } catch (e) {
    console.error('Could not get image data for color extraction:', e);
    callback('rgba(208, 188, 255, 0.8)'); // fallback color
    return;
  }

  let r = 0, g = 0, b = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 128) { // a(alpha) > 128 to ignore transparent pixels
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  
  if (count === 0) {
      callback('rgba(208, 188, 255, 0.8)'); // fallback if all transparent
      return;
  }

  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  callback(`rgba(${r}, ${g}, ${b}, 0.9)`);
};

const EquippedItem = ({ item, index = 0 }) => {
  const [particleColor, setParticleColor] = useState('rgba(208, 188, 255, 0.8)');
  const imgRef = useRef(null);

  useEffect(() => {
    if (item?.image_url) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = item.image_url;
      img.onload = () => {
        getAverageColor(img, (color) => {
          setParticleColor(color);
        });
      };
      img.onerror = () => {
        setParticleColor('rgba(208, 188, 255, 0.8)');
      }
    }
  }, [item?.image_url]);

  if (!item) {
    return null;
  }

  const isUpgraded = item.upgrade_level === 1;

  const particles = isUpgraded ? Array.from({ length: 20 }).map((_, i) => (
    <StarParticle
      key={i}
      color={particleColor}
      delay={Math.random() * 4}
      duration={Math.random() * 3 + 3}
    />
  )) : [];

  return (
    <EquippedItemContainer index={index}>
      {isUpgraded && <ParticlesContainer>{particles}</ParticlesContainer>}
      <ItemImage 
        src={item.image_url} 
        alt={item.item_name}
        width="100%"
        height="100%"
        fallbackText=""
        showSkeleton={false}
        onLoad={(e) => {
          if (e && e.target && e.target.complete) {
            getAverageColor(e.target, (color) => {
              setParticleColor(color);
            });
          }
        }}
      />
    </EquippedItemContainer>
  );
};

export default EquippedItem; 