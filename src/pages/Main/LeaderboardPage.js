import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Paper, 
  Avatar, 
  List, 
  ListItem, 
  Divider, 
  Button, 
  Tabs, 
  Tab, 
  Chip, 
  useTheme, 
  useMediaQuery,
  Badge,
  Tooltip,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import VerifiedIcon from '@mui/icons-material/Verified';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { motion } from 'framer-motion';
import axios from 'axios';
import VerificationBadge from '../../UIKIT/VerificationBadge';


const API_URL = '';


const LeaderboardContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const LeaderboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

// Функция для проверки является ли цвет светлым
const isLightColor = (color) => {
  // Если это не HEX цвет, возвращаем false
  if (!color || !color.startsWith('#')) {
    return false;
  }

  // Конвертируем HEX в RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Вычисляем яркость
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

const UserCard = styled(motion.div)(({ theme, position, decoration }) => {
  // Определяем тип фона (градиент, изображение или цвет)
  const isGradient = decoration?.background?.includes('linear-gradient');
  const isImage = decoration?.background?.includes('/');
  const isHexColor = decoration?.background?.startsWith('#');
  const isLightBackground = isHexColor && isLightColor(decoration?.background);

  return {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    marginBottom: '5px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    background: decoration?.background ? (
      isImage ? theme.palette.background.paper : decoration.background
    ) : theme.palette.background.paper,
    color: isLightBackground ? 'rgba(0, 0, 0, 0.87)' : theme.palette.text.primary,
    '& .MuiTypography-root': {
      color: isLightBackground ? 'rgba(0, 0, 0, 0.87)' : 'inherit',
    },
    '& .MuiTypography-colorTextSecondary': {
      color: isLightBackground ? 'rgba(0, 0, 0, 0.6)' : theme.palette.text.secondary,
    },
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: theme.shadows[6],
    },
    '&::before': isGradient ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: decoration.background,
      opacity: 0,
      zIndex: 0,
      borderRadius: '16px',
    } : isImage ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${API_URL}/${decoration.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.75,
      zIndex: 0,
      borderRadius: '16px',
    } : {},
  };
});

// Функция для парсинга настроек из строки пути
const parseItemSettings = (itemPath) => {
  if (!itemPath || !itemPath.includes(';')) {
    return {
      path: itemPath,
      styles: {}
    };
  }

  const [path, ...stylesParts] = itemPath.split(';');
  const stylesString = stylesParts.join(';');
  
  // Парсим CSS свойства
  const styles = {};
  stylesString.split(';').forEach(style => {
    const [property, value] = style.split(':').map(s => s.trim());
    if (property && value) {
      // Конвертируем property в camelCase для React
      const camelProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
      styles[camelProperty] = value;
    }
  });

  return {
    path: path,
    styles: styles
  };
};

// Обновляем компонент DecorationItem
const DecorationItem = styled('img')(({ customStyles }) => ({
  position: 'absolute',
  right: 0,
  height: 'max-content',
  maxHeight: 120,
  opacity: 1,
  pointerEvents: 'none',
  zIndex: 1,
  ...customStyles, // Применяем пользовательские стили
  transition: 'transform 0.35s cubic-bezier(.4,2,.3,1), z-index 0.2s',
}));

const ScoreDisplay = styled(Box)(({ theme, position, isLightBackground }) => ({
  minWidth: 50,
  maxWidth: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  fontSize: '0.875rem',
  fontWeight: 'bold',
  color: position <= 3 
    ? '#fff' 
    : (isLightBackground ? 'rgba(0, 0, 0, 0.87)' : theme.palette.text.primary),
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

const RankNumber = styled(Box)(({ theme, position }) => ({
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: theme.spacing(2),
  borderRadius: '50%',
  color: theme.palette.primary.contrastText,
  background: position === 1 
    ? 'linear-gradient(90deg, #FFFCA8 -0.05%, #FDB836 31.2%, #FDC966 75.92%, #F1DC83 100.02%)' 
    : position === 2 
    ? 'linear-gradient(90deg, #FFF8C1 -0.05%, #C2E8FD -0.04%, #919191 31.2%, #DDDDDD 75.92%, #E3E3E3 100.02%)' 
    : position === 3 
    ? 'linear-gradient(90.56deg, #9E8976 -0.5%, #7A5E50 -0.49%, #F6D0AB 31.04%, #9D774E 76.19%, #C99B70 100.51%)' 
    : theme.palette.grey[700],
  boxShadow: theme.shadows[3],
}));

const PositionIcon = ({ position }) => {
  if (position <= 3) return <EmojiEventsIcon sx={{ color: '#FFFFFF', fontSize: '1.3rem' }} />;
  return <Typography variant="body1">{position}</Typography>;
};

const UserAvatar = styled(Avatar)(({ theme, position }) => ({
  width: 50,
  height: 50,
  marginRight: theme.spacing(2),
  border: position === 1
    ? '3px solid #FDB836'
    : position === 2
    ? '3px solid #919191'
    : position === 3
    ? '3px solid #7A5E50'
    : `2px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[position <= 3 ? 4 : 1],
}));

const UserInfo = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});

const ScoreChip = styled(Chip)(({ theme, position }) => ({
  fontWeight: 'bold',
  backgroundColor: position === 1 
    ? '#FDB836'
    : position === 2 
    ? '#919191'
    : position === 3 
    ? '#7A5E50'
    : theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StatsChip = styled(Chip)(({ theme, isLightBackground }) => ({
  marginRight: theme.spacing(1),
  height: 24,
  backgroundColor: 'transparent',
  border: `1px solid ${isLightBackground ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'}`,
  '& .MuiChip-label': {
    color: isLightBackground ? 'rgba(0, 0, 0, 0.6)' : theme.palette.text.secondary,
    fontSize: '0.75rem',
    padding: '0 8px',
  },
}));

const DateRangeChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(1, 0, 2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(208, 188, 255, 0.15)' : 'rgba(140, 82, 255, 0.15)',
  border: 'none',
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  '& .MuiChip-icon': {
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  }
}));


const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Функция для сокращения чисел
const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number.toString();
  }
  const units = ['', 'K', 'M', 'B'];
  const order = Math.floor(Math.log10(Math.abs(number)) / 3);
  const unitName = units[order];
  const value = (number / Math.pow(1000, order)).toFixed(1);
  
  // Убираем .0 если число целое
  return value.replace('.0', '') + unitName;
};

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState('week');
  const [userPosition, setUserPosition] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/leaderboard?period=${timePeriod}`);
        if (response.data.success) {
          setLeaderboardData(response.data.leaderboard);
          setUserPosition(response.data.current_user.position);
          setUserScore(response.data.current_user.score);
          
          
          if (response.data.date_range) {
            setDateRange(response.data.date_range);
          } else {
            setDateRange(null);
          }
        } else {
          setError('Не удалось загрузить данные лидерборда');
        }
      } catch (err) {
        setError(`Ошибка: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timePeriod]);

  const handleTimePeriodChange = (event, newValue) => {
    setTimePeriod(newValue);
  };

  
  const getDateRangeText = () => {
    if (!dateRange) {
      if (timePeriod === 'all_time') {
        return 'За всё время';
      }
      return timePeriod === 'week' ? 'За текущую неделю' : 'За текущий месяц';
    }
    
    const startDate = formatDateForDisplay(dateRange.start);
    const endDate = formatDateForDisplay(dateRange.end);
    
    return `${startDate} — ${endDate}`;
  };

  
  const getDateRangeIcon = () => {
    return timePeriod === 'week' ? <DateRangeIcon /> : <CalendarMonthIcon />;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <LeaderboardContainer maxWidth="md">
      <LeaderboardHeader>
      <Box
        sx={{
          width: '100%',
          maxWidth: 750,
          minWidth: 320,
          mx: 'auto',
          mb: 1,
          p: { xs: 2, md: 3 },
          background: '#1c1c1c',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
          '::before': {
            content: '""',
            position: 'absolute',
            left: -80,
            top: '50%',
            transform: 'translateY(-50%) rotate(-12deg)',
            width: 180,
            height: 220,
            background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
            opacity: 0.25,
            filter: 'blur(18px)',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          },
          '::after': {
            content: '""',
            position: 'absolute',
            right: -80,
            top: '50%',
            transform: 'translateY(-50%) rotate(12deg)',
            width: 180,
            height: 220,
            background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
            opacity: 0.25,
            filter: 'blur(18px)',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          },
          zIndex: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
          Рейтинг ТОП лидеров
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          20 пользователей, получивших наибольшее количество очков сообщества K-Коннект за совокупность активности: созданных постов и историй, полученных лайков, комментариев, ответов, репостов, просмотров и реакций на истории.
        </Typography>
      </Box>
        <Paper sx={{
          borderRadius: '16px',
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.background.paper,
          backgroundImage: 'unset',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          mb: 1,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          maxWidth: 750,
          minWidth: 320,
          mx: 'auto',
          position: 'relative',
          '::before': {
            content: '""',
            position: 'absolute',
            left: -80,
            top: '50%',
            transform: 'translateY(-50%) rotate(-12deg)',
            width: 180,
            height: 220,
            background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
            opacity: 0.25,
            filter: 'blur(18px)',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          },
          '::after': {
            content: '""',
            position: 'absolute',
            right: -80,
            top: '50%',
            transform: 'translateY(-50%) rotate(12deg)',
            width: 180,
            height: 220,
            background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
            opacity: 0.25,
            filter: 'blur(18px)',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          },
          zIndex: 2,
        }}>
        <Tabs 
          value={timePeriod} 
          onChange={handleTimePeriodChange}
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                backgroundColor: '#1c1c1c',
              fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 0,
                minHeight: 48,
                transition: 'color 0.2s',
                '&.Mui-selected': {
                  color: theme => theme.palette.primary.main,
                  backgroundColor: '#1c1c1c',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#D0BCFF',
                height: 3,
                borderRadius: '3px',
                transition: 'all 0.2s',
              },
              minHeight: 48,
            }}
          >
            <Tab label="Неделя" value="week" />
            <Tab label="Месяц" value="month" />
          <Tab label="Всё время" value="all_time" />
        </Tabs>
        </Paper>

        {user && userPosition && (
          <Box
            sx={{ 
              borderRadius: '16px',
              background: '#1c1c1c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#D0BCFF',
              fontWeight: 700,
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 750,
              minWidth: 320,
              mb: 1,
              boxShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
              '::before': {
                content: '""',
                position: 'absolute',
                left: -80,
                top: '50%',
                transform: 'translateY(-50%) rotate(-12deg)',
                width: 180,
                height: 220,
                background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
                opacity: 0.25,
                filter: 'blur(18px)',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
              },
              '::after': {
                content: '""',
                position: 'absolute',
                right: -80,
                top: '50%',
                transform: 'translateY(-50%) rotate(12deg)',
                width: 180,
                height: 220,
                background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
                opacity: 0.25,
                filter: 'blur(18px)',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
              },
              zIndex: 2,
            }}
          >
              <Box display="flex" alignItems="center">
              <MilitaryTechIcon sx={{ mr: 1, fontSize: 28, color: '#D0BCFF' }} />
              <Typography variant="h6" sx={{ color: '#D0BCFF', fontWeight: 700 }}>
                Ваше место: {userPosition}
              </Typography>
              </Box>
              <Box>
              <Typography sx={{ color: '#D0BCFF', fontWeight: 700, fontSize: '1.1rem' }}>
                {formatCompactNumber(userScore)} очков
              </Typography>
            </Box>
          </Box>
        )}
      </LeaderboardHeader>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : (
        <List sx={{ width: '100%', p: 0, maxWidth: 750, minWidth: 320, mx: 'auto' }}>
          {leaderboardData.map((user, index) => {
            // Определяем hasBottom0 до UserCard
            let hasBottom0 = false;
            if (user.decoration?.item_path) {
              const { styles } = parseItemSettings(user.decoration.item_path);
              hasBottom0 = styles && styles.bottom === '0';
            }
            return (
            <UserCard
              key={user.id}
              position={index + 1}
              decoration={user.decoration}
              component={motion.div}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
                sx={{
                  overflow: hasBottom0 ? 'hidden' : 'hidden',
                  transition: 'overflow 0.2s',
                  ...(hasBottom0 && {
                    '&:hover': {
                      overflow: 'visible',
                    },
                    '&:hover .decoration-bottom0': {
                      transform: 'scale(1.18)',
                      transformOrigin: 'right bottom',
                      zIndex: 10,
                    },
                  }),
                }}
            >
              {user.decoration?.item_path && (() => {
                const { path, styles } = parseItemSettings(user.decoration.item_path);
                  const hasBottom0 = styles && styles.bottom === '0';
                return (
                  <DecorationItem 
                    src={`${API_URL}/${path}`}
                    alt="decoration"
                    customStyles={styles}
                      className={hasBottom0 ? 'decoration-bottom0' : undefined}
                  />
                );
              })()}
              <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
                <ScoreDisplay 
                  position={index + 1}
                  isLightBackground={user.decoration?.background?.startsWith('#') && isLightColor(user.decoration.background)}
                >
                  {formatCompactNumber(user.score)}
                </ScoreDisplay>

                <UserAvatar 
                  position={index + 1}
                  src={user.avatar_url ? `${API_URL}${user.avatar_url}` : null} 
                  alt={user.name}
                >
                  {user.name.charAt(0)}
                </UserAvatar>

                <UserInfo>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="subtitle1" 
                      component={Link} 
                      to={`/profile/${user.username}`}
                      sx={{ 
                        fontWeight: 'bold', 
                        textDecoration: 'none',
                        color: 'inherit',
                        maxWidth: 'calc(100% - 40px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: theme.palette.primary.main
                        }
                      }}
                    >
                      {user.name}
                    </Typography>
                    {user.verification && user.verification.status && (
                      <VerificationBadge status={user.verification.status} />
                    )}
                    {user.achievement && (
                      <Tooltip title={user.achievement.bage}>
                        <Box 
                          component="img"
                          src={`/static/images/bages/${user.achievement.image_path}`}
                          sx={{ 
                            width: 'auto',
                            height: 24,
                            objectFit: 'contain'
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </UserInfo>
              </Box>
            </UserCard>
            );
          })}
        </List>
      )}
      <Card 
        sx={{
          background: '#1c1c1c',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'none',
          mt: 4,
          '::before': {
            content: '""',
            position: 'absolute',
            left: -80,
            top: '50%',
            transform: 'translateY(-50%) rotate(-12deg)',
            width: 180,
            height: 220,
            background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
            opacity: 0.25,
            filter: 'blur(18px)',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          },
          '::after': {
            content: '""',
            position: 'absolute',
            right: -80,
            top: '50%',
            transform: 'translateY(-50%) rotate(12deg)',
            width: 180,
            height: 220,
            background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
            opacity: 0.25,
            filter: 'blur(18px)',
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          },
          zIndex: 2,
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Как начисляются очки?</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Очки начисляются за активность в социальной сети:
          </Typography>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2 
            }}
          >
            <Box>
              <Typography variant="subtitle2">• Создание поста: 5 очков</Typography>
              <Typography variant="subtitle2">• Лайк на ваш пост: 1 очков</Typography>
              <Typography variant="subtitle2">• Написание комментария: 5 очков</Typography>
              <Typography variant="subtitle2">• Лайк на ваш комментарий: 1 очков</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">• Ответ на комментарий: 3 очков</Typography>
              <Typography variant="subtitle2">• Лайк на ваш ответ: 1 очков</Typography>
              <Typography variant="subtitle2">• Репост: 4 очков</Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Очки обновляются раз в час. Если вы удалите пост или комментарий, или кто-то уберет лайк, соответствующие очки будут вычтены из вашего счета.
          </Typography>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(208, 188, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(208, 188, 255, 0.1)' }}>
            <Typography variant="subtitle2" color="primary.light" fontWeight="medium" gutterBottom>
              Периоды расчета очков:
            </Typography>
            <Typography variant="body2">
              • <strong>Неделя:</strong> с понедельника 00:00 до воскресенья 19:00
            </Typography>
            <Typography variant="body2">
              • <strong>Месяц:</strong> с 1-го числа 00:00 до последнего дня месяца 23:59
            </Typography>
            <Typography variant="body2">
              • <strong>Всё время:</strong> полная история активности
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage; 