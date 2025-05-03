import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Confetti from 'react-confetti';

/**
 * Компонент мини-игры "Поймай цель" для профиля
 * @param {Object} props - Свойства компонента
 * @param {Object} props.gameData - Конфигурация мини-игры
 * @param {Object} props.colors - Цвета для мини-игры
 * @param {Boolean} props.confettiOnClick - Показывать конфетти при клике
 */
const ProfileMiniGame = ({ gameData, colors, confettiOnClick = false }) => {
  
  const config = {
    targetSize: gameData?.target_size || '40px',
    maxTargets: gameData?.max_targets || 3,
    targetSpawnRate: gameData?.target_spawn_rate || 2,
    pointsPerClick: gameData?.points_per_click || 10,
    displayScore: gameData?.display_score !== false,
    scorePosition: gameData?.score_position || { top: '20px', right: '20px' }
  };
  
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  
  
  const targetColors = colors?.target || ['#FF9800', '#F57C00', '#FB8C00', '#EF6C00', '#E65100'];
  const primaryColor = colors?.primary || '#FF9800';
  const scoreColor = colors?.score || '#FFFFFF';
  
  
  const createRandomTarget = () => {
    if (!containerRef.current) return null;
    
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    
    const targetSizeNum = parseInt(config.targetSize.replace('px', ''), 10);
    
    
    const x = Math.random() * (containerWidth - targetSizeNum);
    const y = Math.random() * (containerHeight - targetSizeNum - 60) + 60; 
    
    
    const color = targetColors[Math.floor(Math.random() * targetColors.length)];
    
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      color,
      size: targetSizeNum
    };
  };
  
  
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      };
      
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, []);
  
  
  useEffect(() => {
    if (targets.length >= config.maxTargets) return;
    
    const spawnInterval = setInterval(() => {
      if (targets.length < config.maxTargets) {
        const newTarget = createRandomTarget();
        if (newTarget) {
          setTargets(prev => [...prev, newTarget]);
        }
      }
    }, 1000 / config.targetSpawnRate);
    
    return () => clearInterval(spawnInterval);
  }, [targets, config.maxTargets, config.targetSpawnRate]);
  
  
  const handleTargetClick = (targetId) => {
    
    setTargets(prev => prev.filter(target => target.id !== targetId));
    
    
    setScore(prev => prev + config.pointsPerClick);
    
    
    if (confettiOnClick) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
  };
  
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 10,
        cursor: 'crosshair'
      }}
    >
      
      {config.displayScore && (
        <Box
          sx={{ 
            position: 'absolute',
            top: config.scorePosition.top,
            right: config.scorePosition.right,
            padding: '5px 15px',
            borderRadius: '20px',
            background: `linear-gradient(45deg, ${primaryColor}CC, ${primaryColor}99)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 15
          }}
        >
          <Typography 
            sx={{ 
              fontSize: '16px',
              fontWeight: 'bold',
              color: scoreColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {score}
          </Typography>
        </Box>
      )}
      
      
      {targets.map(target => (
        <Box
          key={target.id}
          onClick={() => handleTargetClick(target.id)}
          sx={{
            position: 'absolute',
            left: `${target.x}px`,
            top: `${target.y}px`,
            width: `${target.size}px`,
            height: `${target.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${target.color}DD, ${target.color}88)`,
            boxShadow: `0 0 10px ${target.color}AA`,
            cursor: 'pointer',
            zIndex: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${target.size * 0.6}px`,
            transition: 'transform 0.1s',
            animation: 'pulse 1.5s infinite alternate',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.95)', boxShadow: `0 0 5px ${target.color}88` },
              '100%': { transform: 'scale(1.05)', boxShadow: `0 0 15px ${target.color}AA` }
            },
            '&:hover': {
              transform: 'scale(1.1)',
            },
            '&:active': {
              transform: 'scale(0.9)',
            }
          }}
        >
          ★
        </Box>
      ))}
      
      
      {showConfetti && dimensions.width > 0 && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={30}
          gravity={0.2}
          colors={targetColors}
        />
      )}
    </Box>
  );
};

export default ProfileMiniGame; 