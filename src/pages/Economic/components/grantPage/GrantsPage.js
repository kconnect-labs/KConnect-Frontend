import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Button,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Diamond as DiamondIcon,
  Star as StarIcon,
  MonetizationOn as MonetizationIcon,
  TrendingUp as TrendingIcon,
  Support as SupportIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Favorite as FavoriteIcon,
  EmojiEvents as TrophyIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  SportsEsports as GamingIcon,
  MusicNote as MusicIcon,
  Movie as MovieIcon,
  Restaurant as FoodIcon,
  FitnessCenter as FitnessIcon,
  School as EducationIcon,
  Science as ScienceIcon,
  TravelExplore as TravelIcon,
  Pets as PetsIcon,
  AutoAwesome as CreativeIcon,
  Forum as CommunityIcon,
  Send as SendIcon
} from '@mui/icons-material';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3),
  paddingBottom: '100px',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    paddingBottom: '100px',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  fontWeight: 700,
  background: 'linear-gradient(135deg, #D0BCFF 0%, #9C64F2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: '#D0BCFF',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(208, 188, 255, 0.2)',
  borderRadius: 16,
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(208, 188, 255, 0.4)',
  },
}));

const TopicChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(208, 188, 255, 0.1)',
  color: '#D0BCFF',
  border: '1px solid rgba(208, 188, 255, 0.3)',
  fontWeight: 500,
  margin: theme.spacing(0.5),
  '&:hover': {
    background: 'rgba(208, 188, 255, 0.2)',
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.2, 2.5),
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.common.white,
  background: 'linear-gradient(135deg, #D0BCFF 0%, #9C64F2 100%)',
  border: 'none',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(156, 100, 242, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #9C64F2 0%, #D0BCFF 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(156, 100, 242, 0.4)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const BonusCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.1) 0%, rgba(156, 100, 242, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(208, 188, 255, 0.3)',
  borderRadius: 16,
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.15) 0%, rgba(156, 100, 242, 0.15) 100%)',
    border: '1px solid rgba(208, 188, 255, 0.5)',
    transform: 'translateY(-2px)',
  },
}));

const HeaderBlock = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: -80,
    top: '50%',
    transform: 'translateY(-50%) rotate(-12deg)',
    width: 180,
    height: 220,
    background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
    opacity: 0.15,
    filter: 'blur(18px)',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: -80,
    top: '50%',
    transform: 'translateY(-50%) rotate(12deg)',
    width: 180,
    height: 220,
    background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
    opacity: 0.15,
    filter: 'blur(18px)',
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  },
}));

const GrantsPage = () => {
  const benefits = [
    {
      icon: <MonetizationIcon sx={{ color: '#D0BCFF' }} />,
      title: 'Ежемесячные бонусы',
      description: 'Регулярные выплаты за активность и качественный контент'
    },
    {
      icon: <TrendingIcon sx={{ color: '#D0BCFF' }} />,
      title: 'Дополнительный функционал',
      description: 'Расширенные возможности для создания уникального контента'
    },
    {
      icon: <PaletteIcon sx={{ color: '#D0BCFF' }} />,
      title: 'Уникальные паки канала',
      description: 'Эксклюзивные коллекции с получением дохода от продаж'
    },
    {
      icon: <SupportIcon sx={{ color: '#D0BCFF' }} />,
      title: 'Прямолинейная поддержка',
      description: 'Быстрая и эффективная помощь в любых вопросах'
    },
    {
      icon: <SecurityIcon sx={{ color: '#D0BCFF' }} />,
      title: 'Дополнительные фичи',
      description: 'Приоритетный доступ к новым функциям платформы'
    },
    {
      icon: <TrophyIcon sx={{ color: '#D0BCFF' }} />,
      title: 'Признание и награды',
      description: 'Особые достижения и репутация в сообществе'
    }
  ];

  const topics = [
    { icon: <BusinessIcon />, label: 'Бизнес и финансы' },
    { icon: <PsychologyIcon />, label: 'Психология и саморазвитие' },
    { icon: <GamingIcon />, label: 'Игры и киберспорт' },
    { icon: <MusicIcon />, label: 'Музыка и искусство' },
    { icon: <MovieIcon />, label: 'Кино и развлечения' },
    { icon: <FoodIcon />, label: 'Кулинария и рецепты' },
    { icon: <FitnessIcon />, label: 'Спорт и фитнес' },
    { icon: <EducationIcon />, label: 'Образование и наука' },
    { icon: <ScienceIcon />, label: 'Технологии и инновации' },
    { icon: <TravelIcon />, label: 'Путешествия и туризм' },
    { icon: <PetsIcon />, label: 'Животные и природа' },
    { icon: <CreativeIcon />, label: 'Творчество и DIY' },
    { icon: <CommunityIcon />, label: 'Сообщество и общение' }
  ];

  const requirements = [
    'Активность почти ежедневная (минимум один пост)',
    'Качественный и уникальный контент',
    'Соблюдение правил платформы',
    'Взаимодействие с аудиторией',
    'Регулярное обновление контента'
  ];

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderBlock>
          <Box sx={{ position: 'relative', zIndex: 3 }}>
            <PageTitle variant="h3" gutterBottom>
              <Box
                component="img"
                src="/static/icons/KBalls.svg"
                alt="KBalls"
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2, 
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }}
              />
              Гранты для каналов
            </PageTitle>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 0,
                fontWeight: 500,
                opacity: 0.8
              }}
            >
              Поддержка талантливых создателей контента
            </Typography>
          </Box>
        </HeaderBlock>
        
        {/* Основные преимущества */}
        <Box sx={{ mb: 6 }}>
          <SectionTitle variant="h5">
            <StarIcon sx={{ color: '#D0BCFF' }} />
            Что вы получаете
          </SectionTitle>
          
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BenefitCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {benefit.icon}
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                        {benefit.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </BenefitCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Требования */}
        <Box sx={{ mb: 6 }}>
          <SectionTitle variant="h5">
            <TrendingIcon sx={{ color: '#D0BCFF' }} />
            Требования к активности
          </SectionTitle>
          
          <StyledCard>
            <CardContent>
              <List>
                {requirements.map((requirement, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#D0BCFF',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={requirement}
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                    {index < requirements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Тематики */}
        <Box sx={{ mb: 6 }}>
          <SectionTitle variant="h5">
            <PaletteIcon sx={{ color: '#D0BCFF' }} />
            Популярные тематики
          </SectionTitle>
          
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TopicChip
                      icon={topic.icon}
                      label={topic.label}
                      variant="outlined"
                    />
                  </motion.div>
                ))}
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 3, 
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: '#D0BCFF',
                  fontWeight: 500
                }}
              >
                Можно любую тематику, главное что вам по душе ✨
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Призыв к действию */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <StyledCard>
            <CardContent sx={{ py: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Мы хотим видеть всё
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                От щитпоста до шедевра — каждый пост важен для нас
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <FavoriteIcon sx={{ fontSize: 40, color: '#e74c3c' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Мы любим вас
                </Typography>
                <FavoriteIcon sx={{ fontSize: 40, color: '#e74c3c' }} />
              </Box>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Бонус за активность */}
        <Box sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <BonusCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src="/static/icons/KBalls.svg"
                  alt="KBalls"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#D0BCFF' }}>
                  500.000
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Баллов за активность!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Каналы в течение месячной активности с грантом получат 500.000 баллов
              </Typography>
            </BonusCard>
          </motion.div>
        </Box>

        {/* Контактная информация */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Готовы начать? Свяжитесь с нами
          </Typography>
          <ApplyButton
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={() => window.open('https://t.me/kconnectsup_bot', '_blank')}
          >
            Подать заявку на грант
          </ApplyButton>
        </Box>
      </motion.div>
    </StyledContainer>
  );
};

export default GrantsPage; 