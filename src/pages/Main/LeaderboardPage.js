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

// Define API_URL for relative paths (empty string)
const API_URL = '';

// Styled components
const LeaderboardContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
  },
}));

const LeaderboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const UserCard = styled(motion.div)(({ theme, position }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  background: position <= 3 
    ? `linear-gradient(to right, ${theme.palette.background.paper}, ${
        position === 1 ? 'rgba(255, 215, 0, 0.15)' : 
        position === 2 ? 'rgba(192, 192, 192, 0.15)' : 
        'rgba(205, 127, 50, 0.15)'
      })`
    : theme.palette.background.paper,
  boxShadow: position <= 3 
    ? `0 4px 12px rgba(0, 0, 0, 0.1)` 
    : '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
  },
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
  color: position <= 3 ? '#fff' : theme.palette.text.primary,
  background: position === 1 
    ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
    : position === 2 
    ? 'linear-gradient(135deg, #C0C0C0, #A9A9A9)' 
    : position === 3 
    ? 'linear-gradient(135deg, #CD7F32, #A0522D)' 
    : theme.palette.action.hover,
  boxShadow: position <= 3 ? '0 3px 6px rgba(0, 0, 0, 0.3)' : 'none',
}));

const PositionIcon = ({ position }) => {
  if (position === 1) return <EmojiEventsIcon sx={{ color: '#FFFFFF', filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', fontSize: '1.3rem' }} />;
  if (position === 2) return <EmojiEventsIcon sx={{ color: '#FFFFFF', filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', fontSize: '1.3rem' }} />;
  if (position === 3) return <EmojiEventsIcon sx={{ color: '#FFFFFF', filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))', fontSize: '1.3rem' }} />;
  return <Typography variant="body1">{position}</Typography>;
};

const UserAvatar = styled(Avatar)(({ theme, position }) => ({
  width: 50,
  height: 50,
  marginRight: theme.spacing(2),
  border: position <= 3 
    ? `2px solid ${
        position === 1 ? '#FFD700' : 
        position === 2 ? '#C0C0C0' : 
        '#CD7F32'
      }` 
    : 'none',
  boxShadow: position <= 3 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
}));

const UserInfo = styled(Box)({
  flex: 1,
  overflow: 'hidden',
});

const ScoreChip = styled(Chip)(({ theme, position }) => ({
  fontWeight: 'bold',
  background: position <= 3 
    ? `linear-gradient(135deg, ${
        position === 1 ? '#FFD700, #FFA500' : 
        position === 2 ? '#C0C0C0, #A9A9A9' : 
        '#CD7F32, #A0522D'
      })` 
    : theme.palette.primary.main,
  color: position <= 3 ? '#fff' : theme.palette.primary.contrastText,
}));

const StatsChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.background.default,
}));

const DateRangeChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(1, 0, 2),
  backgroundColor: 'rgba(208, 188, 255, 0.1)',
  border: '1px solid rgba(208, 188, 255, 0.3)',
  color: theme.palette.primary.light,
  '& .MuiChip-icon': {
    color: theme.palette.primary.light,
  }
}));

// Helper function to format date
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
          
          // Set date range if available
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

  // Helper to format score
  const formatScore = (score) => {
    return new Intl.NumberFormat('ru-RU').format(score);
  };

  // Get date range display text based on time period
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

  // Get date range icon based on time period
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
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" 
          sx={{
            background: 'linear-gradient(45deg, #D0BCFF, #9747FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
          Доска лидеров
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 600 }}>
          Соревнуйтесь за первое место в рейтинге активных пользователей K-Connect. 
          Публикуйте посты, получайте лайки и комментарии, чтобы заработать больше очков!
        </Typography>
        
        <Tabs 
          value={timePeriod} 
          onChange={handleTimePeriodChange}
          variant="fullWidth"
          sx={{ 
            mb: 1,
            width: '100%',
            maxWidth: 400,
            '& .MuiTab-root': {
              fontWeight: 'bold',
            }
          }}
        >
          <Tab 
            label="Неделя" 
            value="week" 
            icon={<DateRangeIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab 
            label="Месяц" 
            value="month" 
            icon={<CalendarMonthIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab label="Всё время" value="all_time" />
        </Tabs>
        
        {dateRange && (
          <DateRangeChip 
            label={getDateRangeText()} 
            icon={getDateRangeIcon()}
          />
        )}

        {user && userPosition && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              width: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(to right, #1A1A2E, #16213E)' 
                : 'linear-gradient(to right, #F4F6F8, #E3F2FD)'
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" alignItems="center">
                <MilitaryTechIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6">Ваше место: {userPosition}</Typography>
              </Box>
              <Box>
                <ScoreChip 
                  label={`${formatScore(userScore)} очков`} 
                  position={userPosition}
                />
              </Box>
            </Box>
          </Paper>
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
        <List sx={{ width: '100%', p: 0 }}>
          {leaderboardData.map((user, index) => (
            <UserCard
              key={user.id}
              position={index + 1}
              component={motion.div}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <RankNumber position={index + 1}>
                <PositionIcon position={index + 1} />
              </RankNumber>

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
                      '&:hover': {
                        textDecoration: 'underline',
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {user.name}
                  </Typography>
                  {user.verification && user.verification.status >= 1 && (
                    <Tooltip title="Верифицированный пользователь">
                      <VerifiedIcon 
                        sx={{ 
                          ml: 0.5, 
                          fontSize: 16, 
                          color: theme.palette.primary.main 
                        }} 
                      />
                    </Tooltip>
                  )}
                </Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  @{user.username}
                </Typography>
                
                {!isMobile && (
                  <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                    <StatsChip 
                      size="small" 
                      label={`${user.stats.posts_count} постов`} 
                      variant="outlined"
                    />
                    <StatsChip 
                      size="small" 
                      label={`${user.stats.followers_count} подписчиков`} 
                      variant="outlined"
                    />
                  </Box>
                )}
              </UserInfo>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {user.achievement && (
                  <Tooltip title={user.achievement.bage}>
                    <Box 
                      component="img"
                      src={`/static/images/bages/${user.achievement.image_path}`}
                      sx={{ 
                        width: 'auto', 
                        height: 32, 
                        mr: 2,
                        display: { xs: 'none', sm: 'block' }
                      }}
                    />
                  </Tooltip>
                )}
                <ScoreChip 
                  label={formatScore(user.score)} 
                  position={index + 1}
                />
              </Box>
            </UserCard>
          ))}
        </List>
      )}

      <Card sx={{ mt: 4, borderRadius: 2 }}>
        <CardContent>
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
              <Typography variant="subtitle2">• Создание поста: 10 очков</Typography>
              <Typography variant="subtitle2">• Лайк на ваш пост: 2 очка</Typography>
              <Typography variant="subtitle2">• Написание комментария: 5 очков</Typography>
              <Typography variant="subtitle2">• Лайк на ваш комментарий: 1 очко</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">• Ответ на комментарий: 3 очка</Typography>
              <Typography variant="subtitle2">• Лайк на ваш ответ: 1 очко</Typography>
              <Typography variant="subtitle2">• Репост: 7 очков</Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Очки обновляются в реальном времени. Если вы удалите пост или комментарий, или кто-то уберет лайк, соответствующие очки будут вычтены из вашего счета.
          </Typography>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(208, 188, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(208, 188, 255, 0.1)' }}>
            <Typography variant="subtitle2" color="primary.light" fontWeight="medium" gutterBottom>
              Периоды расчета очков:
            </Typography>
            <Typography variant="body2">
              • <strong>Неделя:</strong> с понедельника 00:00 до воскресенья 23:50
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