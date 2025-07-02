import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Button, 
  Divider,
  useTheme,
  Card,
  CardContent,
  alpha,
  useMediaQuery,
  Link,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';


import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GitHubIcon from '@mui/icons-material/GitHub';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MouseIcon from '@mui/icons-material/Mouse';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwipeIcon from '@mui/icons-material/Swipe';
import TelegramIcon from '@mui/icons-material/Telegram';
import BugReportIcon from '@mui/icons-material/BugReport';
import ShareIcon from '@mui/icons-material/Share';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import ChatIcon from '@mui/icons-material/Chat';
import BoxIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionGrid = motion(Grid);

const FeatureCard = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        elevation={0}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.13)',
            borderColor: alpha(theme.palette.primary.main, 0.3),
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                p: 1.5, 
                borderRadius: 2,
                color: theme.palette.primary.main,
                mr: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TeamMember = ({ name, role, avatar, delay, description, username }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          }
        }}
      >
        <Avatar 
          src={avatar} 
          alt={name}
          sx={{ 
            width: 120, 
            height: 120, 
            mb: 2,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            border: `3px solid ${alpha(theme.palette.primary.main, 0.7)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
            }
          }}
        />
        <Typography variant="h6" component="h3" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
          {role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {username && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mt: 1,
              opacity: 0.8,
              '&:hover': {
                opacity: 1,
                color: theme.palette.primary.main,
              }
            }}
          >
            {username}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};


const BenefitCard = ({ icon, title, description, index }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'flex-start',
          mb: 4,
          p: 3,
          borderRadius: 4,
          transition: 'all 0.3s ease',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.6)}, ${alpha(theme.palette.background.paper, 0.3)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 20px ${alpha(theme.palette.common.black, 0.1)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
          }
        }}
      >
        <Box 
          sx={{ 
            color: theme.palette.primary.main,
            mr: 3,
            p: 1.5,
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

const KConnectIllustration = () => (
  <svg width="204" height="212" viewBox="0 0 204 212" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M78.6142 192.304L89.3052 204.105C95.2179 210.632 104.79 210.632 110.688 204.105L121.379 192.304C109.569 179.269 90.4244 179.269 78.6142 192.304ZM35.8491 145.101L57.2316 168.703C80.8068 142.665 119.186 142.665 142.777 168.703L164.159 145.101C128.728 105.977 71.2799 105.977 35.8491 145.101ZM195.567 110.417L185.542 121.484C138.301 69.3405 61.7078 69.3405 14.4516 121.484L4.42589 110.417C-1.98582 103.34 -1.33575 91.6251 5.75646 85.366C60.7399 36.878 139.268 36.878 194.252 85.366C201.344 91.6251 201.979 103.34 195.567 110.417Z" fill="url(#paint0_linear_1076_51)"/>
    <path d="M171.5 159L163.152 177.152L145 185.5L163.152 193.781L171.5 212L179.781 193.781L198 185.5L179.781 177.152" fill="url(#paint1_linear_1076_51)"/>
    <path d="M24.5 0L16.8438 16.8438L0 24.5L16.8438 32.1562L24.5 49L32.1562 32.1562L49 24.5L32.1562 16.8438" fill="url(#paint2_linear_1076_51)"/>
    <path d="M187.5 20L182.344 31.3438L171 36.5L182.344 41.6562L187.5 53L192.656 41.6562L204 36.5L192.656 31.3438" fill="url(#paint3_linear_1076_51)"/>
    <defs>
      <linearGradient id="paint0_linear_1076_51" x1="100" y1="49" x2="100" y2="209" gradientUnits="userSpaceOnUse">
        <stop stop-color="#D0BCFF"/>
        <stop offset="1" stop-color="#9365FF"/>
      </linearGradient>
      <linearGradient id="paint1_linear_1076_51" x1="171.5" y1="159" x2="171.5" y2="212" gradientUnits="userSpaceOnUse">
        <stop stop-color="#D0BCFF"/>
        <stop offset="1" stop-color="#9365FF"/>
      </linearGradient>
      <linearGradient id="paint2_linear_1076_51" x1="24.5" y1="0" x2="24.5" y2="49" gradientUnits="userSpaceOnUse">
        <stop stop-color="#D0BCFF"/>
        <stop offset="1" stop-color="#9365FF"/>
      </linearGradient>
      <linearGradient id="paint3_linear_1076_51" x1="187.5" y1="20" x2="187.5" y2="53" gradientUnits="userSpaceOnUse">
        <stop stop-color="#D0BCFF"/>
        <stop offset="1" stop-color="#9365FF"/>
      </linearGradient>
    </defs>
  </svg>
);

// Добавляем определения вариантов анимации
const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5 
    }
  }
};

const TeamSection = ({ title, members }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 8 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          mb: 4,
          textAlign: 'center',
          fontSize: { xs: '1.8rem', md: '2.2rem' }
        }}
      >
        {title}
      </Typography>
      
      <MotionGrid 
        container 
        spacing={4}
        justifyContent="center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true }}
      >
        {members.map((member, index) => (
          <MotionGrid item xs={12} sm={6} md={4} key={index} variants={itemVariants}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 * index }}
              viewport={{ once: true }}
              style={{ height: '100%' }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: `rgba(255,255,255,0.13)`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.10)}`,
                  transition: 'all 0.35s cubic-bezier(.4,2,.3,1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.025)',
                    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.13)',
                    borderColor: alpha(theme.palette.primary.main, 0.22),
                  }
                }}
                elevation={0}
              >
                <Box 
                  sx={{ 
                    p: 4, 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      borderRadius: '50%',
                      boxShadow: '0 2px 12px 0 rgba(80,40,180,0.10)',
                      transition: 'box-shadow 0.3s',
                    }}
                  >
                    <Avatar 
                      src={member.avatar} 
                      alt={member.name}
                      sx={{ 
                        width: 110, 
                        height: 110, 
                        border: `3px solid ${alpha(theme.palette.primary.main, 0.7)}`,
                        boxShadow: `0 2px 16px ${alpha(theme.palette.primary.main, 0.18)}`,
                        background: '#fff',
                      }} 
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        fontSize: 14,
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.10),
                        borderRadius: '8px',
                        letterSpacing: 0.2,
                        boxShadow: '0 1px 4px 0 rgba(120,80,255,0.06)',
                      }}
                    >
                      {member.role}
                    </Box>
                  </Box>
                  {member.telegram && (
                    <Button
                      component="a"
                      href={member.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<TelegramIcon />}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        mt: 1,
                        color: theme.palette.primary.main,
                        borderColor: alpha(theme.palette.primary.main, 0.25),
                        fontWeight: 500,
                        borderRadius: '8px',
                        px: 2,
                        textTransform: 'none',
                        background: 'rgba(255,255,255,0.10)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                        }
                      }}
                    >
                      Telegram
                    </Button>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontSize: 16, fontWeight: 400 }}>
                    {member.description}
                  </Typography>
                  {member.username && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        color: theme.palette.text.secondary
                      }}
                    >
                      {member.username}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </MotionGrid>
        ))}
      </MotionGrid>
    </Box>
  );
};

// Слайдер для презентации сайта
const previewImages = [
  {
    src: 'https://k-connect.ru/static/preview/Feed.png',
    alt: 'Лента',
  },
  {
    src: 'https://k-connect.ru/static/preview/Profile.png',
    alt: 'Профиль',
  },
  {
    src: 'https://k-connect.ru/static/preview/Messenger.png',
    alt: 'Мессенджер',
  },
  {
    src: 'https://k-connect.ru/static/preview/BadgeShop.png',
    alt: 'Магазин бейджей',
  },
  {
    src: 'https://k-connect.ru/static/preview/Items.png',
    alt: 'Айтемы',
  },
  {
    src: 'https://k-connect.ru/static/preview/Friends.png',
    alt: 'Друзья',
  },
  {
    src: 'https://k-connect.ru/static/preview/Balance.png',
    alt: 'Баланс',
  },
];

const HeroSlider = () => {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);
  const theme = useTheme();

  const nextSlide = React.useCallback(() => {
    setIndex((prev) => (prev + 1) % previewImages.length);
  }, []);
  const prevSlide = React.useCallback(() => {
    setIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length);
  }, []);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [index, nextSlide]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100%', sm: 500, md: 700 },
        height: { xs: 220, sm: 320, md: 400 },
        mx: 'auto',
        my: 4,
        borderRadius: '12px',
        overflow: 'visible',
        boxShadow: '0 8px 40px 0 rgba(80,40,180,0.18)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.background.paper, 0.7)})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.img
        key={previewImages[index].src}
        src={previewImages[index].src}
        alt={previewImages[index].alt}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '12px',
          boxShadow: '0 4px 32px rgba(80,40,180,0.10)',
        }}
      />
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: { xs: -18, sm: -38, md: -48 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          boxShadow: '0 0 16px 4px rgba(120,80,255,0.18)',
          border: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
          width: 56,
          height: 56,
          zIndex: 2,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.18),
            boxShadow: '0 0 32px 8px rgba(120,80,255,0.28)',
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-50%) scale(1.08)',
          },
        }}
        size="large"
      >
        <ChevronLeftIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: { xs: -18, sm: -38, md: -48 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          boxShadow: '0 0 16px 4px rgba(120,80,255,0.18)',
          border: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
          width: 56,
          height: 56,
          zIndex: 2,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.18),
            boxShadow: '0 0 32px 8px rgba(120,80,255,0.28)',
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-50%) scale(1.08)',
          },
        }}
        size="large"
      >
        <ChevronRightIcon fontSize="large" />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {previewImages.map((img, i) => (
          <Box
            key={img.src}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: i === index ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.25),
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: i === index ? `2px solid ${theme.palette.background.paper}` : 'none',
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </Box>
      <motion.div
        key={previewImages[index].alt}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: -38,
          left: 'calc(50% + 120px)',
          transform: 'translateX(-50%)',
          background: alpha(theme.palette.background.paper, 0.85),
          color: theme.palette.primary.main,
          borderRadius: 12,
          padding: '6px 18px',
          fontWeight: 600,
          fontSize: 18,
          boxShadow: '0 2px 12px rgba(120,80,255,0.10)',
          letterSpacing: 0.2,
        }}
      >
        {previewImages[index].alt}
      </motion.div>
    </Box>
  );
};

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  
  const featuresRef = React.useRef(null);
  const teamRef = React.useRef(null);
  
  const scrollToNextSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const features = [
    {
      title: "Лента контента",
      description: "Увлекательная лента постов от пользователей, на которых вы подписаны, с интеллектуальными алгоритмами рекомендаций",
      icon: <RssFeedIcon fontSize="large" />
    },
    {
      title: "Профили пользователей",
      description: "Настраиваемые профили для демонстрации вашей индивидуальности и контента",
      icon: <PeopleIcon fontSize="large" />
    },
    {
      title: "Каналы",
      description: "Создавайте свои каналы для публикации тематического контента и общения с аудиторией",
      icon: <GroupIcon fontSize="large" />,
    },
    {
      title: "Система верификации",
      description: "Подтвердите свою личность или бренд и получите статус верифицированного пользователя",
      icon: <ShieldIcon fontSize="large" />,
    },
    {
      title: "Интеграция музыки",
      description: "Делитесь и находите музыку прямо на платформе с интегрированным музыкальным плеером",
      icon: <MusicNoteIcon fontSize="large" />
    },
    {
      title: "Система достижений",
      description: "Зарабатывайте значки и награды за активность и вклад в сообщество",
      icon: <EmojiEventsIcon fontSize="large" />
    },
    {
      title: "Экономическая система",
      description: "Зарабатывайте баллы за социальную активность и используйте их для покупок и переводов",
      icon: <MonetizationOnIcon fontSize="large" />,
    },
    {
      title: "Маркетплейс баллов",
      description: "Покупайте бейджики, уникальные имена пользователей и другие цифровые товары за заработанные баллы",
      icon: <AccountBalanceWalletIcon fontSize="large" />,
    },
    {
      title: "Еженедельные награды",
      description: "Автоматическое получение баллов каждое воскресенье на основе вашей активности на платформе",
      icon: <LocalAtmIcon fontSize="large" />,
    },
    // {
    //   title: "Мини-игры",
    //   description: "Делайте перерыв и наслаждайтесь развлекательными мини-играми, не покидая платформу",
    //   icon: <SportsEsportsIcon fontSize="large" />
    // },
    {
      title: "Удобный баг-репортер",
      description: "Сообщайте о найденных проблемах через встроенную систему для быстрого улучшения платформы",
      icon: <BugReportIcon fontSize="large" />
    },
    {
      title: "Доступ к API",
      description: "Удобный для разработчиков API для интеграции с К-Коннект и создания приложений",
      icon: <CodeIcon fontSize="large" />
    },
    {
      title: "Популярный контент",
      description: "Узнавайте, что популярно и в тренде на платформе",
      icon: <WhatshotIcon fontSize="large" />
    },
    {
      title: "Тёмная тема",
      description: "Комфортный тёмный режим для снижения нагрузки на глаза при использовании ночью",
      icon: <DarkModeIcon fontSize="large" />
    },
    {
      title: "Система репостов",
      description: "Делитесь интересными постами с вашими подписчиками, сохраняя связь с оригинальным контентом",
      icon: <ShareIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Удобные чеки",
      description: "Создавайте и отправляйте чеки для быстрых и безопасных переводов между пользователями",
      icon: <ReceiptIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Подписки",
      description: "Получайте дополнительные возможности и привилегии с системой подписок",
      icon: <StarIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Мессенджер",
      description: "Современный мессенджер с поддержкой медиа, стикеров и групповых чатов",
      icon: <ChatIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Пачки",
      description: "Коллекционные пачки с уникальными предметами разных редкостей для пополнения вашего инвентаря",
      icon: <BoxIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Инвентарь",
      description: "Коллекция предметов, полученных из паков. Передавайте, дарите друзьям или продавайте на маркетплейсе!",
      icon: <BoxIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Маркетплейс",
      description: "Покупайте и продавайте предметы из паков на маркетплейсе",
      icon: <StoreIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Айтемы",
      description: "Уникальные предметы разных редкостей, которые можно получить из паков и использовать для кастомизации",
      icon: <AutoAwesomeIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Гранты",
      description: "Система поддержки талантливых создателей контента с ежемесячными бонусами и уникальными возможностями",
      icon: <StarIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Большая кастомизация профиля",
      description: "Расширенные возможности настройки внешнего вида и функциональности вашего профиля",
      icon: <ColorLensIcon fontSize="large" />,
      highlight: true
    },
    {
      title: "Дополнительные вещи для профилей",
      description: "Новые элементы и функции для персонализации и улучшения вашего профиля",
      icon: <AutoAwesomeIcon fontSize="large" />,
      highlight: true
    }
  ];
  
  
  const teamData = {
    authors: [
      {
        name: "амир",
        role: "Основатель и разработчик",
        avatar: "https://k-connect.ru/static/uploads/avatar/3/bo4hc37yKu.jpg",
        description: "Создал К-Коннект как современную социальную сеть, ориентированную на объединение людей через творческий контент.",
        username: "@qsoul"
      }
    ],
    designers: [
      {
        name: "алинк",
        role: "Дизайнер",
        avatar: "https://k-connect.ru/static/uploads/avatar/9/9tGEbQE29B.jpeg",
        description: "Отвечает за визуальную эстетику и пользовательский опыт К-Коннект.",
        username: "@yalinks"
      },
      {
        name: "Rutrai 36",
        role: "Друг Проекта",
        avatar: "/static/moderators/rutrai.jpg",
        description: "И огромное спасибо RUTRAI за то, что дал использовать свой концепт в рамках проекта.",
        telegram: "https://t.me/Rutrai36"
      }
    ],
    moderators: [
      {
        name: "ʙʟxꜱꜱxᴅ ₁₈₆",
        role: "Модератор",
        avatar: "/static/moderators/bxx.jpg"
      },
      {
        name: "арбуз",
        role: "Модератор",
        avatar: "/static/moderators/arb.jpg"
      },
      {
        name: "Liquides",
        role: "Модератор",
        avatar: "/static/moderators/lix.jpg"
      },
      {
        name: "IMarandici",
        role: "Модератор",
        avatar: "/static/moderators/lmar.jpg"
      },
      // {
      //   name: "Morozik",
      //   role: "Поддержка",
      //   avatar: "/static/moderators/morozik.jpeg"
      // },
      {
        name: "rev/x",
        role: "Модератор",
        avatar: "/static/moderators/rev.jpg"
      },
      {
        name: "Ронин",
        role: "Модератор",
        avatar: "/static/moderators/ronin.jpeg"
      }
    ]
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      
      <Box 
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)`,
          animation: 'gradientBG 12s ease-in-out infinite',
          color: '#fff',
          textAlign: 'center',
          p: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 60% 40%, rgba(208, 188, 255, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }
        }}
      >
        <style>{`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <Container maxWidth="md">
          <MotionTypography
            variant="h1"
            component="h1"
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              mb: 2,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            К-Коннект
          </MotionTypography>
          
          <MotionTypography
            variant="h4"
            sx={{ 
              fontWeight: 400, 
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Социальная платформа нового поколения 🚀
          </MotionTypography>
          
          {/* Слайдер с превью */}
          <HeroSlider />
          
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button 
              variant="outlined"
              size="large"
              sx={{
                fontSize: '1.08rem',
                py: 1.2,
                px: 4,
                borderRadius: '32px',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.35)',
                fontWeight: 500,
                letterSpacing: 0.2,
                boxShadow: 'none',
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(255,255,255,0.18)',
                  borderColor: '#fff',
                  color: '#fff',
                  boxShadow: '0 2px 12px 0 rgba(120,80,255,0.10)',
                  transform: 'translateY(-2px) scale(1.03)',
                },
              }}
              onClick={() => scrollToNextSection(featuresRef)}
            >
              Исследовать
            </Button>
          </MotionBox>
        </Container>
        
        <MotionBox
          sx={{
            position: 'absolute',
            bottom: 40,
            right: { xs: 16, sm: 40 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: 0.8,
            zIndex: 10,
            '&:hover': {
              opacity: 1,
            }
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          onClick={() => scrollToNextSection(featuresRef)}
          whileHover={{ scale: 1.1 }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {isMobile ? 'Свайп вниз' : 'Прокрути вниз'}
          </Typography>
          {isMobile ? (
            <MotionBox
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
            >
              <SwipeIcon sx={{ fontSize: '2rem' }} />
            </MotionBox>
          ) : (
            <MotionBox
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
            >
              <MouseIcon sx={{ fontSize: '2rem' }} />
              <KeyboardArrowDownIcon sx={{ fontSize: '1.5rem' }} />
            </MotionBox>
          )}
        </MotionBox>
      </Box>

      
      <Box ref={featuresRef} sx={{ py: 12, bgcolor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <MotionBox 
            sx={{ textAlign: 'center', mb: 8 }}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Возможности платформы
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: '800px',
                mx: 'auto' 
              }}
            >
              Узнайте, что делает К-Коннект уникальным социальным опытом
            </Typography>
          </MotionBox>
          
          <MotionGrid 
            container 
            spacing={4}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionPaper
                  variants={itemVariants}
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: feature.highlight 
                      ? `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                      : '0 4px 12px rgba(0,0,0,0.05)',
                    ...(feature.highlight && {
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                    })
                  }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: feature.highlight 
                      ? `0 15px 30px ${alpha(theme.palette.primary.main, 0.3)}`
                      : '0 12px 24px rgba(0,0,0,0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.highlight && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        borderRadius: '12px',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Новое
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    color: feature.highlight ? theme.palette.primary.main : theme.palette.text.secondary
                  }}>
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {feature.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </MotionGrid>
          
          
          <MotionBox
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 8,
              cursor: 'pointer'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onClick={() => scrollToNextSection(teamRef)}
            whileHover={{ scale: 1.1 }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              borderRadius: '20px',
              bgcolor: alpha(theme.palette.background.default, 0.5)
            }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Продолжить
              </Typography>
              <ArrowDownwardIcon sx={{ fontSize: '1.5rem', opacity: 0.7 }} />
            </Box>
          </MotionBox>
        </Container>
      </Box>

      
      <Box ref={teamRef} sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <MotionBox 
            sx={{ textAlign: 'center', mb: 8 }}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Наша команда
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: '800px',
                mx: 'auto' 
              }}
            >
              Люди, стоящие за К-Коннект
            </Typography>
          </MotionBox>

          <TeamSection title="Авторы" members={teamData.authors} />
          <TeamSection title="Дизайнеры" members={teamData.designers} />
        </Container>
      </Box>
      
      {/* Moderators section with simpler cards */}
      <Box sx={{ py: 12, bgcolor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <MotionBox 
            sx={{ textAlign: 'center', mb: 8 }}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Модераторы
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: '800px',
                mx: 'auto' 
              }}
            >
              Команда, которая помогает поддерживать порядок и развивать сообщество
            </Typography>
          </MotionBox>
          
          <MotionGrid 
            container 
            spacing={4}
            justifyContent="center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true }}
          >
            {teamData.moderators.map((moderator, index) => (
              <MotionGrid item xs={6} sm={4} md={3} key={index} variants={itemVariants}>
                <MotionBox
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar 
                    src={moderator.avatar} 
                    alt={moderator.name}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mb: 2,
                      border: '3px solid',
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {moderator.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary, 
                      mt: 0.5 
                    }}
                  >
                    Модератор
                  </Typography>
                </MotionBox>
              </MotionGrid>
            ))}
          </MotionGrid>
        </Container>
      </Box>
      
      
      <Box 
        sx={{ 
          py: 10, 
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}
      >
        <Container maxWidth="md">
          <MotionBox 
            sx={{ textAlign: 'center' }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <MotionTypography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
              variants={itemVariants}
            >
              Присоединяйтесь к сообществу К-Коннект
            </MotionTypography>
            
            <MotionTypography 
              variant="h6" 
              sx={{ 
                fontWeight: 400, 
                mb: 4,
                maxWidth: '800px',
                mx: 'auto'
              }}
              variants={itemVariants}
            >
              Станьте частью нашей растущей платформы и найдите единомышленников со всего мира
            </MotionTypography>
            
            <MotionBox variants={itemVariants}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <Button 
                  component={Link}
                  href="https://k-connect.ru"
                  variant="contained" 
                  size="large"
                  sx={{ 
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    bgcolor: theme.palette.background.paper,
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      bgcolor: theme.palette.background.default,
                    }
                  }}
                >
                  Создать аккаунт
                </Button>
                
                <Button 
                  component={Link}
                  href="https://github.com/kconnect-labs/kconnect-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    width: { xs: '100%', sm: 'auto' },
                    borderColor: theme.palette.background.paper,
                    color: theme.palette.background.paper,
                    '&:hover': {
                      borderColor: theme.palette.background.default,
                      color: theme.palette.background.default,
                      bgcolor: 'transparent'
                    }
                  }}
                  startIcon={<GitHubIcon />}
                >
                  GitHub
                </Button>
              </Box>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
      
      
      <Box sx={{ py: 6, bgcolor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                К-Коннект
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Современная социальная сеть, объединяющая людей через творческий контент.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  component={Link}
                  href="https://github.com/kconnect-labs/kconnect-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ссылки
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link 
                    href="https://k-connect.ru" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.primary.main }
                    }}
                  >
                    Основной сайт
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link 
                    href="https://k-connect.ru/rules" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.primary.main }
                    }}
                  >
                    Правила сообщества
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link 
                    href="https://k-connect.ru/privacy-policy" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.primary.main }
                    }}
                  >
                    Политика конфиденциальности
                  </Link>
                </Box>
                <Box component="li">
                  <Link 
                    href="https://k-connect.ru/terms-of-service" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.primary.main }
                    }}
                  >
                    Условия использования
                  </Link>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Контакты
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Есть вопросы или отзывы?
              </Typography>
              <Link 
                href="mailto:verif@k-connect.ru" 
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  display: 'block',
                  mb: 1,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                verif@k-connect.ru
              </Link>
              <Link 
                href="https://t.me/KConnectSUP_bot" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <TelegramIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Telegram поддержка
              </Link>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="body2" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
            © {new Date().getFullYear()} К-Коннект
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 