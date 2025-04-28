import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Avatar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import BlockIcon from '@mui/icons-material/Block';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RuleIcon from '@mui/icons-material/Rule';
import DiamondIcon from '@mui/icons-material/Diamond';
import ShieldIcon from '@mui/icons-material/Shield';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import { motion } from 'framer-motion';

// Styled components
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
  },
}));

const RuleCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const RuleCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(208, 188, 255, 0.1)',
}));

const RuleCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const RuleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '100%',
    height: 3,
    background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
    borderRadius: 4,
  },
}));

const RuleListItem = styled(ListItem)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
}));

const RuleAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  marginBottom: theme.spacing(1.5),
  borderRadius: `${theme.spacing(1.5)}px !important`,
  overflow: 'hidden',
}));

const AccordionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'medium',
  fontSize: '1rem',
}));

const AnimatedIconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  boxShadow: `0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23), 
               inset 0 -5px 10px ${theme.palette.primary.light},
               inset 0 5px 10px rgba(0, 0, 0, 0.2)`,
  width: 100,
  height: 100,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    transform: 'rotate(45deg)',
  },
}));

const WarningIconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
  boxShadow: `0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23), 
               inset 0 -5px 10px ${theme.palette.warning.light},
               inset 0 5px 10px rgba(0, 0, 0, 0.2)`,
  width: 120,
  height: 120,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    transform: 'rotate(45deg)',
  },
}));

const SecurityIconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(45deg, #9747FF, #D0BCFF)`,
  boxShadow: `0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23), 
               inset 0 -5px 10px rgba(255, 255, 255, 0.3),
               inset 0 5px 10px rgba(0, 0, 0, 0.2)`,
  width: 120,
  height: 120,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    transform: 'rotate(45deg)',
  },
}));

const RulesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Animation variants for motion components
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const iconAnimation = {
    initial: { scale: 0.8, rotate: -10 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        duration: 0.8 
      }
    },
    whileHover: { 
      scale: 1.1,
      rotate: 5,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const diamondAnimation = {
    initial: { scale: 0.8, rotate: -15 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10,
        duration: 1.2
      }
    },
    whileHover: { 
      scale: 1.1,
      rotate: 15,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const shieldAnimation = {
    initial: { scale: 0.8, y: 20 },
    animate: { 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10,
        duration: 1 
      }
    },
    whileHover: { 
      scale: 1.1,
      y: -5,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <PageContainer maxWidth="lg">
      
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(208, 188, 255, 0.1) 100%)`,
          border: '1px solid rgba(208, 188, 255, 0.2)'
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          Юридические документы:
        </Typography>
        
        <Box 
          component={RouterLink} 
          to="/rules"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: theme.palette.primary.main,
            fontWeight: 'medium',
            py: 0.5,
            px: 1.5,
            borderRadius: 1,
            backgroundColor: 'rgba(208, 188, 255, 0.15)',
            '&:hover': { 
              backgroundColor: 'rgba(208, 188, 255, 0.25)',
            }
          }}
        >
          <RuleIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">Правила сообщества</Typography>
        </Box>
        
        <Box 
          component={RouterLink} 
          to="/privacy-policy"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 'medium',
            py: 0.5,
            px: 1.5,
            borderRadius: 1,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">Политика конфиденциальности</Typography>
        </Box>
        
        <Box 
          component={RouterLink} 
          to="/terms-of-service"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 'medium',
            py: 0.5,
            px: 1.5,
            borderRadius: 1,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">Условия использования</Typography>
        </Box>
      </Paper>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 4 
          }}>
            <Fade in={true}>
              <Box sx={{ 
                width: { xs: 150, sm: 200 }, 
                height: { xs: 150, sm: 200 },
                mr: { xs: 0, sm: 4 },
                mb: { xs: 2, sm: 0 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  whileHover="whileHover"
                  variants={iconAnimation}
                >
                  <AnimatedIconWrapper>
                    <GavelIcon 
                      sx={{ 
                        fontSize: 60, 
                        color: '#fff',
                        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))'
                      }} 
                    />
                  </AnimatedIconWrapper>
                </motion.div>
              </Box>
            </Fade>
            
            <Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem' },
                background: 'linear-gradient(45deg, #D0BCFF, #9747FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}>
                Правила К-Коннект
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                maxWidth: 600,
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                Для обеспечения комфорта всех пользователей, пожалуйста, придерживайтесь следующих правил. 
                Их нарушение может привести к ограничениям доступа или другим санкциям.
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 4 }} />

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <GavelIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">I. Основные принципы</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <List>
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Уважение к другим" 
                      secondary="Пожалуйста, воздерживайтесь от оскорблений, дискриминации, угроз или травли. Конструктивная критика и дискуссии приветствуются."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Законопослушность" 
                      secondary="Не публикуйте контент, нарушающий законы вашей страны (призывы к насилию, экстремизм и т.д.)."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Безопасность" 
                      secondary="Не распространяйте личные данные других людей без их согласия, не угрожайте и не принуждайте к действиям."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Конфиденциальность" 
                      secondary="Запрещено взламывать аккаунты, распространять спам или вредоносные ссылки."
                    />
                  </RuleListItem>
                </List>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <BlockIcon color="error" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">II. Запрещённый контент</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <Typography variant="body1" paragraph>
                  Администрация удалит ваш контент (посты, комментарии, фото, видео, аватар, username), если он содержит:
                </Typography>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Насилие и опасные действия</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Реалистичные сцены насилия, жестокости, инструкции по причинению вреда себе или другим."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Пропаганда суицида, терроризма, экстремизма."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Порнография и сексуализированный контент</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Изображения/видео сексуального характера с участием несовершеннолетних или без согласия участников."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Контент, эксплуатирующий сексуальность в агрессивной форме."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Мошенничество и спам</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Фишинговые ссылки, финансовые пирамиды, обманные схемы."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Массовая рассылка рекламы, ботов, фейковых аккаунтов."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Дезинформация</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Фейковые новости, вводящие в заблуждение (например, о выборах, здоровье, стихийных бедствиях)."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <Fade in={true}>
                  <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: 'center',
                    width: '100%',
                    height: 150
                  }}>
                    <motion.div
                      initial="initial"
                      animate="animate"
                      whileHover="whileHover"
                      variants={diamondAnimation}
                    >
                      <WarningIconWrapper>
                        <DiamondIcon 
                          sx={{ 
                            fontSize: 70, 
                            color: '#fff',
                            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))'
                          }} 
                        />
                      </WarningIconWrapper>
                    </motion.div>
                  </Box>
                </Fade>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <SecurityIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">III. Дополнительные ограничения</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box>
                    <List>
                      <RuleListItem>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Возрастное ограничение"
                          secondary="Регистрация разрешена с 12 лет (или 16 лет, в зависимости от законодательства вашей страны)."
                        />
                      </RuleListItem>
                      
                      <RuleListItem>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Фейковые аккаунты"
                          secondary="Запрещено создавать аккаунты от имени других лиц или организаций."
                        />
                      </RuleListItem>
                      
                      <RuleListItem>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Мини-игры и читерство"
                          secondary="Запрещено использовать сторонние программы, скрипты или любые методы для обхода механик игры, искусственного повышения результатов или получения нечестного преимущества перед другими игроками."
                        />
                      </RuleListItem>
                    </List>
                  </Box>
                  
                  <Fade in={true}>
                    <Box sx={{ 
                      width: { xs: 150, sm: 200 }, 
                      height: { xs: 150, sm: 200 },
                      ml: { xs: 0, sm: 4 },
                      mt: { xs: 2, sm: 0 },
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <motion.div
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        variants={shieldAnimation}
                      >
                        <SecurityIconWrapper>
                          <ShieldIcon 
                            sx={{ 
                              fontSize: 70, 
                              color: '#fff',
                              filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))'
                            }} 
                          />
                        </SecurityIconWrapper>
                      </motion.div>
                    </Box>
                  </Fade>
                </Box>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <AddModeratorIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">IV. Действия администрации</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <List>
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Модерация" 
                      secondary="Контент проверяется вручную. Администрация оставляет за собой право удалять материалы, нарушающие правила сообщества."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Санкции за нарушения"
                    />
                  </RuleListItem>
                  <Box sx={{ pl: 7, mt: -1 }}>
                    <List dense>
                      <ListItem>
                        <ListItemText secondary="Первое нарушение: предупреждение." />
                      </ListItem>
                      <ListItem>
                        <ListItemText secondary="Повторное: временная блокировка аккаунта." />
                      </ListItem>
                      <ListItem>
                        <ListItemText secondary="Систематические нарушения: пожизненный бан." />
                      </ListItem>
                    </List>
                  </Box>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Баланс баллов" 
                      secondary="Ваш баланс баллов может изменяться (уменьшаться или увеличиваться) в зависимости от ситуации. Если администрация заметит накрутку или странное поведение в переводах, баллы будут аннулированы."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Обжалование" 
                      secondary="Если вы не согласны с удалением контента, напишите в поддержку в течение 7 дней."
                    />
                  </RuleListItem>
                </List>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <AssignmentIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">V. Ваши обязательства</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <List>
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ответственность за контент" 
                      secondary="Вы несёте ответственность за весь контент, который публикуете, комментируете, лайкаете, репостите."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Сообщения о нарушениях" 
                      secondary="Сообщайте о нарушениях, чтобы помочь нам улучшить платформу."
                    />
                  </RuleListItem>
                </List>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <DiamondIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">VI. Правила для бейджиков</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <Typography variant="body1" paragraph>
                  Бейджики в К-Коннект — это способ самовыражения и уникальной идентификации. Чтобы сохранить 
                  их ценность и уникальность, пожалуйста, соблюдайте следующие правила:
                </Typography>
                
                <List>
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Оригинальность контента" 
                      secondary="Все бейджики должны быть оригинальными работами. Запрещено копирование, имитация или незначительная модификация существующих бейджиков."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Качество изображения" 
                      secondary="Бейджики должны быть высокого качества, с четким изображением и хорошим разрешением. Размытые, пиксельные или визуально некачественные бейджики будут отклонены."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Запрет на дублирование" 
                      secondary="Нельзя создавать множество похожих бейджиков с незначительными отличиями. Каждый бейджик должен иметь уникальную концепцию и дизайн."
                    />
                  </RuleListItem>
                </List>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Нарушения авторских прав</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Запрещено использовать в бейджиках материалы, защищенные авторским правом, без соответствующего разрешения."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Бейджики не должны нарушать права интеллектуальной собственности третьих лиц, включая логотипы и товарные знаки без должной авторизации."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Модерация бейджиков</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Все бейджики проходят модерацию перед публикацией."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Администрация оставляет за собой право отклонять бейджики, не соответствующие стандартам качества или нарушающие правила платформы."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="В случае обнаружения нарушений после публикации, бейджик может быть удален без предупреждения."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <Fade in={true}>
                  <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: 'center',
                    width: '100%',
                    height: 150
                  }}>
                    <motion.div
                      initial="initial"
                      animate="animate"
                      whileHover="whileHover"
                      variants={diamondAnimation}
                    >
                      <WarningIconWrapper>
                        <DiamondIcon 
                          sx={{ 
                            fontSize: 70, 
                            color: '#fff',
                            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))'
                          }} 
                        />
                      </WarningIconWrapper>
                    </motion.div>
                  </Box>
                </Fade>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <RuleCard>
              <RuleCardHeader>
                <GroupIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <SectionTitle variant="h5">VII. Правила ведения групп/каналов</SectionTitle>
              </RuleCardHeader>
              
              <RuleCardContent>
                <Typography variant="body1" paragraph>
                  Аккаунты с типом "channel" имеют более свободные возможности для публикации контента, 
                  однако следующие правила должны соблюдаться всеми каналами на платформе:
                </Typography>
                
                <List>
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Запрет на шокирующий контент" 
                      secondary="Запрещено публиковать изображения или видео с кровью, насилием, увечьями и другими шокирующими материалами."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ограничение экстремального контента" 
                      secondary="Контент, который может вызвать сильную негативную реакцию или психологический дискомфорт у пользователей (травмирующие аудио, видео и изображения), запрещен."
                    />
                  </RuleListItem>
                  
                  <RuleListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Свобода творчества" 
                      secondary="За исключением указанных выше ограничений, каналы имеют свободу публиковать разнообразный контент, включая развлекательный, образовательный, дискуссионный и творческий материал."
                    />
                  </RuleListItem>
                </List>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Контентные ограничения</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Контент, пропагандирующий опасные действия или самоповреждение."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Контент, демонстрирующий жестокое обращение с людьми или животными."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Экстремистский контент или контент, разжигающий ненависть по признаку расы, национальности, религии и т.д."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Контент, нарушающий законодательство."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <RuleAccordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReportProblemIcon color="warning" sx={{ mr: 1.5 }} />
                      <AccordionTitle>Модерация каналов</AccordionTitle>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Каналы несут полную ответственность за весь публикуемый контент."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="При первом нарушении канал получает предупреждение, при повторных нарушениях может быть временно или постоянно заблокирован."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Администрация имеет право без предупреждения удалять контент, нарушающий правила."
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </RuleAccordion>
                
                <Fade in={true}>
                  <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: 'center',
                    width: '100%',
                    height: 150
                  }}>
                    <motion.div
                      initial="initial"
                      animate="animate"
                      whileHover="whileHover"
                      variants={shieldAnimation}
                    >
                      <SecurityIconWrapper>
                        <GroupsIcon 
                          sx={{ 
                            fontSize: 70, 
                            color: '#fff',
                            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))'
                          }} 
                        />
                      </SecurityIconWrapper>
                    </motion.div>
                  </Box>
                </Fade>
              </RuleCardContent>
            </RuleCard>
          </RuleSection>
        </motion.div>

        
        <motion.div variants={itemVariants}>
          <RuleSection>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <RuleCard sx={{ flex: 1 }}>
                <RuleCardHeader>
                  <UpdateIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                  <SectionTitle variant="h5">Изменения в правилах</SectionTitle>
                </RuleCardHeader>
                
                <RuleCardContent>
                  <Typography variant="body1">
                    Администрация может обновлять эти правила. О значимых изменениях вы узнаете через уведомление в телеграм канале.
                  </Typography>
                  
                  <Typography 
                    component="a" 
                    href="https://t.me/kcon_news" 
                    target="_blank"
                    variant="body2"
                    color="primary"
                    sx={{ 
                      display: 'block',
                      mt: 2,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    https://t.me/kcon_news
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Последнее обновление: 24 Апреля 2025
                  </Typography>
                </RuleCardContent>
              </RuleCard>
              
              <RuleCard sx={{ flex: 1 }}>
                <RuleCardHeader>
                  <SupportAgentIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                  <SectionTitle variant="h5">Контакты</SectionTitle>
                </RuleCardHeader>
                
                <RuleCardContent>
                  <Typography variant="body1">
                    Тех-поддержка
                  </Typography>
                  
                  <Typography 
                    component="a" 
                    href="https://t.me/KConnectSUP_bot" 
                    target="_blank"
                    variant="body2"
                    color="primary"
                    sx={{ 
                      display: 'block',
                      mt: 1,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    @KConnectSUP_bot
                  </Typography>
                </RuleCardContent>
              </RuleCard>
            </Box>
          </RuleSection>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default RulesPage; 