import React, { useState, useEffect, useRef } from 'react';
import { Box, styled, Typography } from '@mui/material';

const ENABLE_SKIBIDI_ATTACKS = false;

const SKIBIDI_MODES = {
  DISABLED: -1,  
  FULL: 0,      
  ATTACKS_ONLY: 1 
};


const getSkibidiMode = () => {
  
  if (!ENABLE_SKIBIDI_ATTACKS) return SKIBIDI_MODES.DISABLED;
  
  const savedMode = localStorage.getItem('skibidiMode');
  
  return savedMode !== null ? parseInt(savedMode, 10) : SKIBIDI_MODES.FULL;
};


const setSkibidiMode = (mode) => {
  localStorage.setItem('skibidiMode', mode);
};


const isSkibidiEnabled = () => {
  const mode = getSkibidiMode();
  return mode >= SKIBIDI_MODES.FULL;
};

const StyledSkibidi = styled(Box)(({ theme, position }) => ({
  position: 'fixed',
  zIndex: 9999,
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  animation: 'skibidi-entrance 0.5s ease-out',
  filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
  transformOrigin: 'center',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '@keyframes skibidi-entrance': {
    '0%': {
      opacity: 0,
      transform: 'scale(0) rotate(-45deg)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1) rotate(0)',
    },
  },
  ...position,
}));

const AttackNotification = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '20%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  padding: '15px 25px',
  borderRadius: '15px',
  background: 'rgba(255,30,30,0.9)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  color: 'white',
  textAlign: 'center',
  animation: 'attack-notification 3s ease-in-out forwards',
  '@keyframes attack-notification': {
    '0%': { 
      opacity: 0,
      transform: 'translateX(-50%) scale(0.5)',
    },
    '10%': { 
      opacity: 1,
      transform: 'translateX(-50%) scale(1.1)',
    },
    '20%': { 
      transform: 'translateX(-50%) scale(1)',
    },
    '80%': { 
      opacity: 1,
      transform: 'translateX(-50%) scale(1)',
    },
    '100%': { 
      opacity: 0,
      transform: 'translateX(-50%) scale(1.1)',
    }
  }
}));

const ModeToggle = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '120px',
  right: '10px',
  zIndex: 9999,
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.9)',
  }
}));

const StealAnimation = styled(Box)(({ theme, active, stolenElementPosition, finished }) => ({
  position: 'fixed',
  zIndex: 9998,
  background: 'rgba(255,0,0,0.15)',
  border: '2px dashed red',
  borderRadius: '8px',
  pointerEvents: 'none',
  transition: 'all 0.5s ease',
  opacity: active ? 1 : 0,
  ...stolenElementPosition,
  transform: finished ? 'scale(0.1) rotate(360deg)' : 'scale(1)',
}));


const skibidiGif = "/static/icons/skibidi.gif";


const stealableElements = [
  { selector: '.MuiAppBar-root', name: 'header', message: 'Скибиди туалет украл шапку!' },
  { selector: '.MuiBottomNavigation-root', name: 'bottomNav', message: 'Скибиди украл навигацию!' },
  { selector: '.MuiCard-root', name: 'card', message: 'Скибиди похитил карточку!' },
  { selector: '.MusicPlayerMinimized', name: 'musicPlayer', message: 'Скибиди украл плеер!' },
  { selector: '.content-container', name: 'container', message: 'Скибиди украл контент!' },
  { selector: '.post-card', name: 'post', message: 'Скибиди украл пост!' },
  { selector: 'div[class*="container"]', name: 'div', message: 'Скибиди похитил контейнер!' },
  { selector: 'div[class*="wrapper"]', name: 'wrapper', message: 'Скибиди украл блок!' },
  { selector: 'div[class*="content"]', name: 'content', message: 'Скибиди украл содержимое!' },
  { selector: 'div[class*="panel"]', name: 'panel', message: 'Скибиди украл панель!' },
  { selector: 'div[class*="box"]', name: 'box', message: 'Скибиди украл блок!' }
];


const findStealableElement = () => {
  
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  
  
  const isInViewport = (rect) => {
    
    const visibleHeight = Math.min(rect.bottom, scrollTop + viewportHeight) - Math.max(rect.top, scrollTop);
    const visibleWidth = Math.min(rect.right, scrollLeft + viewportWidth) - Math.max(rect.left, scrollLeft);
    
    const elementHeight = rect.height;
    const elementWidth = rect.width;
    
    const visiblePercentage = (visibleHeight * visibleWidth) / (elementHeight * elementWidth);
    
    return visibleHeight > 0 && 
           visibleWidth > 0 && 
           visiblePercentage > 0.7; 
  };
  
  
  const calculateElementScore = (element) => {
    const rect = element.getBoundingClientRect();
    
    
    if (!isInViewport(rect)) {
      return -1; 
    }
    
    
    const area = rect.width * rect.height;
    const idealArea = 40000; 
    const sizeFactor = 1 - Math.min(Math.abs(area - idealArea) / idealArea, 0.9);
    
    
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    
    const distanceFromCenter = Math.sqrt(
      Math.pow(centerX - elementCenterX, 2) + 
      Math.pow(centerY - elementCenterY, 2)
    );
    
    const maxDistance = Math.sqrt(Math.pow(viewportWidth/2, 2) + Math.pow(viewportHeight/2, 2));
    const distanceFactor = 1 - (distanceFromCenter / maxDistance);
    
    
    const hasContent = element.innerText.trim().length > 0 || element.querySelectorAll('img').length > 0;
    const contentFactor = hasContent ? 1 : 0.2;
    
    
    return sizeFactor * 0.3 + distanceFactor * 0.5 + contentFactor * 0.2;
  };

  
  for (const elementType of stealableElements) {
    const elements = document.querySelectorAll(elementType.selector);
    if (elements.length > 0) {
      
      const visibleElements = Array.from(elements).filter(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        
        
        return rect.width > 100 && 
               rect.height > 100 && 
               style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               
               rect.top < viewportHeight &&
               rect.left < viewportWidth &&
               rect.bottom > 0 &&
               rect.right > 0 &&
               
               isInViewport(rect);
      });

      if (visibleElements.length > 0) {
        
        const scoredElements = visibleElements.map(el => ({
          element: el,
          score: calculateElementScore(el)
        })).filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);
        
        if (scoredElements.length > 0) {
          
          const topElements = scoredElements.slice(0, Math.min(3, scoredElements.length));
          const randIndex = Math.floor(Math.random() * topElements.length);
          
          return { 
            element: topElements[randIndex].element, 
            type: elementType 
          };
        }
      }
    }
  }

  
  const allDivs = document.querySelectorAll('div');
  const stealableDivs = Array.from(allDivs).filter(div => {
    const rect = div.getBoundingClientRect();
    const style = getComputedStyle(div);
    
    
    return rect.width > 150 && 
           rect.height > 100 && 
           style.display !== 'none' && 
           style.visibility !== 'hidden' &&
           style.opacity !== '0' &&
           
           rect.top < viewportHeight &&
           rect.bottom > 0 &&
           rect.left < viewportWidth &&
           rect.right > 0 &&
           
           isInViewport(rect) &&
           
           (div.innerText.trim().length > 0 || div.querySelectorAll('img').length > 0) &&
           
           !div.classList.contains('skibidi-attack') &&
           !div.hasAttribute('data-skibidi-stolen') &&
           div.id !== 'skibidi-notification';
  });

  if (stealableDivs.length > 0) {
    
    const scoredDivs = stealableDivs.map(div => ({
      element: div,
      score: calculateElementScore(div)
    })).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    if (scoredDivs.length > 0) {
      
      const topDivs = scoredDivs.slice(0, Math.min(5, scoredDivs.length));
      const selectedDiv = topDivs[Math.floor(Math.random() * topDivs.length)];
      
      return {
        element: selectedDiv.element,
        type: { 
          selector: 'div', 
          name: 'element', 
          message: 'Скибиди украл элемент страницы!' 
        }
      };
    }
  }

  
  return null;
};

const SkibidiAttack = () => {
  const [skibidiMode, setMode] = useState(getSkibidiMode());
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [isSkibidiVisible, setIsSkibidiVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [skibidiPosition, setSkibidiPosition] = useState({ top: '50%', left: '50%' });
  const [stolenElements, setStolenElements] = useState([]);  
  const [showStealAnimation, setShowStealAnimation] = useState(false); 
  const [animationFinished, setAnimationFinished] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [clicksRequired, setClicksRequired] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [showToggle, setShowToggle] = useState(false);
  const [theftCount, setTheftCount] = useState(0);  
  
  const timeoutRef = useRef(null);
  const cooldownRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const elementBackupRef = useRef(new Map());
  const reappearTimeoutRef = useRef(null);
  const continuousTheftRef = useRef(null);
  const debugModeRef = useRef(false); 

  useEffect(() => {
    
    if (skibidiMode >= SKIBIDI_MODES.FULL) {
      scheduleNextAttack();
    } else {
      
      cleanupActiveAttack();
    }

    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowToggle(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    
    const handleDebugKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        debugModeRef.current = !debugModeRef.current;
        console.log("Skibidi debug mode:", debugModeRef.current);
        setShowStealAnimation(debugModeRef.current); 
      }
    };
    
    window.addEventListener('keydown', handleDebugKeyDown);
    
    return () => {
      cleanupTimeouts();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleDebugKeyDown);
    };
  }, [skibidiMode]);

  const scheduleNextAttack = () => {
    cleanupTimeouts(); 
    
    
    const initialDelay = process.env.NODE_ENV === 'development' ? 10000 : (Math.random() * 10000 + 30000); 
    timeoutRef.current = setTimeout(() => {
      initiateAttack();
    }, initialDelay);
  };

  const cleanupTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (reappearTimeoutRef.current) clearTimeout(reappearTimeoutRef.current);
    if (continuousTheftRef.current) clearInterval(continuousTheftRef.current);
  };

  const cleanupActiveAttack = () => {
    
    stolenElements.forEach(stolen => {
      if (stolen && stolen.element) {
        const element = stolen.element;
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.transform = 'scale(1) rotate(0)';
        
        delete element.dataset.skibidiStolen;
      }
    });
    
    
    setIsAttackActive(false);
    setIsSkibidiVisible(false);
    setShowNotification(false);
    setAnimationFinished(false);
    setStolenElements([]);
    setTheftCount(0);
    
    
    cleanupTimeouts();
  };

  const toggleSkibidiMode = () => {
    
    const newMode = (skibidiMode + 2) % 3 - 1;
    setMode(newMode);
    setSkibidiMode(newMode);
    
    
    window.dispatchEvent(new CustomEvent('show-error', { 
      detail: { 
        message: newMode === SKIBIDI_MODES.FULL ? 'Скибиди режим: ПОЛНЫЙ' :
                newMode === SKIBIDI_MODES.ATTACKS_ONLY ? 'Скибиди режим: ТОЛЬКО АТАКИ' : 
                'Скибиди режим: ВЫКЛЮЧЕН',
        shortMessage: `Режим: ${newMode === SKIBIDI_MODES.FULL ? 'Полный' :
                      newMode === SKIBIDI_MODES.ATTACKS_ONLY ? 'Атаки' : 'Выкл'}`,
        notificationType: "info",
        animationType: "pill"
      } 
    }));
    
    if (newMode >= SKIBIDI_MODES.FULL) {
      
      scheduleNextAttack();
    } else {
      
      cleanupActiveAttack();
    }
  };

  
  const stealElement = (forcedPosition = null) => {
    
    const stealTarget = findStealableElement();
    
    if (stealTarget && stealTarget.element) {
      const elementToSteal = stealTarget.element;
      
      
      if (elementToSteal.dataset.skibidiStolen === 'true') {
        return false;
      }
      
      
      const rect = elementToSteal.getBoundingClientRect();
      const position = {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      };
      
      
      const originalStyles = {
        visibility: elementToSteal.style.visibility,
        opacity: elementToSteal.style.opacity,
        transform: elementToSteal.style.transform,
        position: elementToSteal.style.position,
        zIndex: elementToSteal.style.zIndex
      };
      
      const uniqueId = Date.now().toString() + '-' + theftCount;
      elementBackupRef.current.set(uniqueId, {
        element: elementToSteal,
        styles: originalStyles,
        id: uniqueId,
        type: stealTarget.type
      });
      
      
      setStolenElements(prev => [
        ...prev, 
        {
          element: elementToSteal,
          type: stealTarget.type,
          id: uniqueId,
          position: position
        }
      ]);
      
      
      elementToSteal.dataset.skibidiStolen = 'true';
      
      
      elementToSteal.style.transition = 'all 0.5s ease';
      elementToSteal.style.opacity = '0';
      elementToSteal.style.transform = 'scale(0.8) rotate(-5deg)';
      
      setTimeout(() => {
        elementToSteal.style.visibility = 'hidden';
      }, 500);
      
      
      setTheftCount(prevCount => prevCount + 1);
      
      
      if (Math.random() < 0.7) { 
        window.dispatchEvent(new CustomEvent('show-error', { 
          detail: { 
            message: stealTarget.type.message || 'Скибиди украл элемент интерфейса!',
            shortMessage: 'Скибиди атака!',
            notificationType: "warning",
            animationType: "bounce"
          } 
        }));
      }
      
      return true;
    }
    
    return false;
  };
  
  
  const startContinuousTheft = () => {
    if (!isAttackActive) return;
    
    
    scheduleSkibidiReappear(true);
    
    
    continuousTheftRef.current = setInterval(() => {
      if (isAttackActive && stolenElements.length < 10) { 
        stealElement();
        
        
        if (!isSkibidiVisible) {
          scheduleSkibidiReappear(true);
        }
      } else {
        
        if (continuousTheftRef.current) {
          clearInterval(continuousTheftRef.current);
        }
      }
    }, Math.random() * 5000 + 5000); 
  };
  
  const scheduleSkibidiReappear = (immediate = false) => {
    if (!isAttackActive || skibidiMode < SKIBIDI_MODES.FULL) return;
    
    if (reappearTimeoutRef.current) {
      clearTimeout(reappearTimeoutRef.current);
    }
    
    
    const reappearDelay = immediate ? 100 : Math.random() * 3000 + 2000; 
    
    reappearTimeoutRef.current = setTimeout(() => {
      
      const randomX = Math.random() * 80 + 10;
      const randomY = Math.random() * 80 + 10;
      
      setSkibidiPosition({
        top: `${randomY}%`,
        left: `${randomX}%`
      });
      
      
      setIsSkibidiVisible(true);
      
      
      const minVisibleTime = 2000;
      
      
      const visibleDuration = Math.random() * 5000 + 5000;
      reappearTimeoutRef.current = setTimeout(() => {
        if (isAttackActive) {
          
          scheduleSkibidiReappear();
        }
      }, visibleDuration);
      
    }, reappearDelay);
  };

  const initiateAttack = () => {
    if (cooldownActive || skibidiMode < SKIBIDI_MODES.FULL) return;
    
    
    setTheftCount(0);
    setStolenElements([]);
    
    
    const requiredClicks = skibidiMode === SKIBIDI_MODES.FULL ? 
      Math.floor(Math.random() * 3) + 2 : 1; 
      
    setClicksRequired(requiredClicks);
    setClicksCount(0);
    
    
    const randomX = Math.random() * 80 + 10; 
    const randomY = Math.random() * 80 + 10; 
    
    setSkibidiPosition({
      top: `${randomY}%`,
      left: `${randomX}%`
    });
    
    
    setShowNotification(true);
    setIsAttackActive(true);
    setIsSkibidiVisible(true);
    
    
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    
    
    const success = stealElement();
    
    if (success) {
      
      setTimeout(() => {
        setAnimationFinished(true);
        
        
        startContinuousTheft();
        
      }, 1000);
    } else {
      
      timeoutRef.current = setTimeout(initiateAttack, 5000);
    }
  };

  const handleSkibidiClick = () => {
    
    const newClickCount = clicksCount + 1;
    setClicksCount(newClickCount);
    
    
    setIsSkibidiVisible(false);
    
    
    if (newClickCount >= clicksRequired) {
      
      setIsAttackActive(false);
      setAnimationFinished(false);
      
      
      if (continuousTheftRef.current) {
        clearInterval(continuousTheftRef.current);
      }
      
      
      stolenElements.forEach(stolen => {
        if (stolen && stolen.element) {
          const originalElement = stolen.element;
          
          
          originalElement.style.visibility = 'visible';
          originalElement.style.opacity = '0';
          originalElement.style.transform = 'scale(1.2) rotate(5deg)';
          
          
          delete originalElement.dataset.skibidiStolen;
          
          setTimeout(() => {
            originalElement.style.opacity = '1';
            originalElement.style.transform = 'scale(1) rotate(0)';
          }, 50);
        }
      });
      
      
      setStolenElements([]);
      
      
      window.dispatchEvent(new CustomEvent('show-error', { 
        detail: { 
          message: `Вы победили скибиди! Освобождено ${stolenElements.length} элементов!`,
          shortMessage: 'Скибиди побежден!',
          notificationType: "success",
          animationType: "pill"
        } 
      }));
      
      
      setCooldownActive(true);
      cooldownRef.current = setTimeout(() => {
        setCooldownActive(false);
        
        
        const nextDelay = process.env.NODE_ENV === 'development' ? 20000 : (Math.random() * 60000 + 60000); 
        timeoutRef.current = setTimeout(initiateAttack, nextDelay);
      }, process.env.NODE_ENV === 'development' ? 20000 : 120000); 
    } else if (skibidiMode === SKIBIDI_MODES.FULL) {
      
      window.dispatchEvent(new CustomEvent('show-error', { 
        detail: { 
          message: `Скибиди ослаблен! Нужно ещё ${clicksRequired - newClickCount} попаданий, похищено ${stolenElements.length} элементов`,
          shortMessage: `Ещё ${clicksRequired - newClickCount} попаданий`,
          notificationType: "info",
          animationType: "pulse"
        } 
      }));
      
      
      scheduleSkibidiReappear(true);
      
      
      if (Math.random() < 0.25) {
        stealElement();
      }
    }
  };

  if ((!isAttackActive && !showNotification && !showToggle) || skibidiMode < SKIBIDI_MODES.FULL) {
    
    return showToggle ? (
      <ModeToggle onClick={toggleSkibidiMode}>
        Скибиди режим: {
          skibidiMode === SKIBIDI_MODES.FULL ? 'ПОЛНЫЙ (0)' :
          skibidiMode === SKIBIDI_MODES.ATTACKS_ONLY ? 'АТАКИ (1)' : 
          'ВЫКЛ (-1)'
        }
      </ModeToggle>
    ) : null;
  }

  return (
    <>
      {/* Mode toggle button */}
      {showToggle && (
        <ModeToggle onClick={toggleSkibidiMode}>
          Скибиди режим: {
            skibidiMode === SKIBIDI_MODES.FULL ? 'ПОЛНЫЙ (0)' :
            skibidiMode === SKIBIDI_MODES.ATTACKS_ONLY ? 'АТАКИ (1)' : 
            'ВЫКЛ (-1)'
          }
        </ModeToggle>
      )}
    
      {/* Attack notification */}
      {showNotification && (
        <AttackNotification>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            СКИБИДИ АТАКУЮТ!
          </Typography>
          <Typography variant="body1">
            БЕЙ ПО СКИБИДИ!
          </Typography>
        </AttackNotification>
      )}
    
      {/* The animation showing where the element was stolen from - только в режиме отладки */}
      {showStealAnimation && stolenElements.length > 0 && (
        <>
          {stolenElements.map(item => (
            <StealAnimation 
              key={item.id}
              active={isAttackActive} 
              finished={animationFinished} 
              stolenElementPosition={item.position}
            />
          ))}
        </>
      )}
      
      {/* The skibidi character */}
      {isSkibidiVisible && (
        <StyledSkibidi
          component="img"
          src={skibidiGif}
          alt="Скибиди атака!"
          onClick={handleSkibidiClick}
          position={skibidiPosition}
          sx={{
            width: '150px',
            height: '150px',
            animation: 'skibidi-entrance 0.5s ease-out, skibidi-float 3s ease-in-out infinite',
            '@keyframes skibidi-float': {
              '0%, 100%': {
                transform: 'translateY(0) rotate(0deg)'
              },
              '50%': {
                transform: 'translateY(-15px) rotate(5deg)'
              }
            }
          }}
        />
      )}
    </>
  );
};

export default SkibidiAttack; 