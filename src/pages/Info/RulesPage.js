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

const NumberedRuleItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
}));

const RuleNumber = styled(Typography)(({ theme }) => ({
  minWidth: '40px',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

const SubRuleNumber = styled(Typography)(({ theme }) => ({
  minWidth: '50px',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

const SubRuleItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginLeft: theme.spacing(4),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
      
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, rgba(156, 39, 176, 0.15), rgba(103, 58, 183, 0.1))',
          border: '1px solid rgba(156, 39, 176, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '4px', 
            background: 'linear-gradient(to right, #9c27b0, #673ab7)' 
          }} 
        />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <UpdateIcon color="secondary" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Временное ограничение контента
            </Typography>
            <Typography variant="body2">
              В настоящее время правила в отношении публикуемого контента могут быть строже, так как умная лента отключена и работает общая лента для всех пользователей. После включения умной ленты и достижения достаточного количества пользователей, правила будут смягчены, поскольку у каждого будет формироваться персонализированная лента по интересам.
            </Typography>
          </Box>
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
                <NumberedRuleItem>
                  <RuleNumber>1.1</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Уважение к другим пользователям</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Общайтесь с уважением, воздерживайтесь от оскорблений, дискриминации, угроз или травли.
                      Конструктивная критика и дискуссии приветствуются, но должны оставаться в рамках уважительного общения.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>1.1.1</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещены любые формы унижения достоинства, высказывания, направленные на создание конфликтных ситуаций.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>1.1.2</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещено целенаправленное преследование пользователей на платформе с целью причинения морального вреда.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>1.2</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Законопослушность</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Запрещен контент, нарушающий законодательство Российской Федерации или страны проживания пользователя, 
                      включая, но не ограничиваясь: призывы к насилию, экстремизму, терроризму, наркотикам.
                    </Typography>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>1.3</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Безопасность и приватность</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Запрещено распространение личных данных других людей без их согласия (доксинг), угрозы или принуждения к действиям.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>1.3.1</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещено публиковать любые персональные данные без согласия их владельца: номера телефонов, адреса проживания, паспортные данные и т.д.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>1.3.2</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещены угрозы физической расправы, нанесения ущерба имуществу или репутации.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>1.4</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Конфиденциальность и безопасность аккаунтов</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Запрещены попытки взлома аккаунтов, распространение вредоносного ПО, спама или фишинговых ссылок. 
                      Каждый пользователь несёт ответственность за безопасность своего аккаунта.
                    </Typography>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>1.5</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Интеллектуальная собственность</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Уважайте авторские права. При использовании чужих материалов указывайте источник.
                      Запрещено распространение пиратского контента, нелегальных копий программного обеспечения.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>1.5.1</SubRuleNumber>
                        <Typography variant="body2">
                          При публикации чужого контента необходимо указывать автора или источник.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>1.5.2</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещено выдавать чужие работы за свои или публиковать их без разрешения автора.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
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
                
                <NumberedRuleItem>
                  <RuleNumber>2.1</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Насилие и опасные действия</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>2.1.1</SubRuleNumber>
                        <Typography variant="body2">
                          Реалистичные сцены насилия, жестокости, инструкции по причинению вреда себе или другим.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.1.2</SubRuleNumber>
                        <Typography variant="body2">
                          Пропаганда суицида, терроризма, экстремизма.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.1.3</SubRuleNumber>
                        <Typography variant="body2">
                          Видео, изображения или текстовые описания пыток, увечий, убийств.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.1.4</SubRuleNumber>
                        <Typography variant="body2">
                          Инструкции по изготовлению оружия, взрывчатых веществ или других опасных предметов.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>2.2</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Порнография и сексуализированный контент</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>2.2.1</SubRuleNumber>
                        <Typography variant="body2">
                          Изображения/видео сексуального характера с участием несовершеннолетних.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.2.2</SubRuleNumber>
                        <Typography variant="body2">
                          Порнографический контент, включая изображения и видео интимного характера без согласия участников.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.2.3</SubRuleNumber>
                        <Typography variant="body2">
                          Материалы, изображающие сексуальное насилие или нарушение сексуального согласия.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.2.4</SubRuleNumber>
                        <Typography variant="body2">
                          Излишняя сексуализация, не соответствующая общим стандартам платформы.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>2.3</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Мошенничество и спам</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>2.3.1</SubRuleNumber>
                        <Typography variant="body2">
                          Фишинговые ссылки, финансовые пирамиды, обманные схемы заработка.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.3.2</SubRuleNumber>
                        <Typography variant="body2">
                          Массовая рассылка рекламы, спам, создание ботов и фейковых аккаунтов для манипуляций.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.3.3</SubRuleNumber>
                        <Typography variant="body2">
                          Схемы мошенничества, обещающие быстрый или нереалистичный доход.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.3.4</SubRuleNumber>
                        <Typography variant="body2">
                          Нецелевая реклама, не относящаяся к тематике обсуждения или сообщества.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>2.4</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Дезинформация и ложные сведения</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>2.4.1</SubRuleNumber>
                        <Typography variant="body2">
                          Заведомо ложные новости, направленные на введение в заблуждение (например, о выборах, здоровье, стихийных бедствиях).
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.4.2</SubRuleNumber>
                        <Typography variant="body2">
                          Манипулирование фактами, искажение информации для провокации паники или беспорядков.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.4.3</SubRuleNumber>
                        <Typography variant="body2">
                          Распространение опасных медицинских мифов, способных нанести вред здоровью людей.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.4.4</SubRuleNumber>
                        <Typography variant="body2">
                          Клевета, распространение заведомо ложных обвинений в адрес конкретных лиц или организаций.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>2.5</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Контент, связанный с наркотиками</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>2.5.1</SubRuleNumber>
                        <Typography variant="body2">
                          Продажа, покупка или передача наркотических веществ или препаратов.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.5.2</SubRuleNumber>
                        <Typography variant="body2">
                          Пропаганда употребления наркотиков, инструкции по их изготовлению или использованию.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>2.5.3</SubRuleNumber>
                        <Typography variant="body2">
                          Романтизация наркотической зависимости или наркотического образа жизни.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
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
                  <Box sx={{ width: '100%' }}>
                    <NumberedRuleItem>
                      <RuleNumber>3.1</RuleNumber>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">Возрастное ограничение</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Регистрация разрешена с 12 лет (или 16 лет, в зависимости от законодательства вашей страны).
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <SubRuleItem>
                            <SubRuleNumber>3.1.1</SubRuleNumber>
                            <Typography variant="body2">
                              Пользователям младше 18 лет запрещен доступ к контенту с маркировкой 18+.
                            </Typography>
                          </SubRuleItem>
                          <SubRuleItem>
                            <SubRuleNumber>3.1.2</SubRuleNumber>
                            <Typography variant="body2">
                              При обнаружении аккаунта пользователя младше минимального возраста, аккаунт будет заблокирован до достижения пользователем соответствующего возраста.
                            </Typography>
                          </SubRuleItem>
                        </Box>
                      </Box>
                    </NumberedRuleItem>
                    
                    <NumberedRuleItem>
                      <RuleNumber>3.2</RuleNumber>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">Фейковые аккаунты и имперсонация</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Запрещено создавать аккаунты от имени других лиц или организаций.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <SubRuleItem>
                            <SubRuleNumber>3.2.1</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено выдавать себя за публичных лиц, знаменитостей, брендов или организаций.
                            </Typography>
                          </SubRuleItem>
                          <SubRuleItem>
                            <SubRuleNumber>3.2.2</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено использовать чужие фотографии в качестве аватара без разрешения.
                            </Typography>
                          </SubRuleItem>
                          <SubRuleItem>
                            <SubRuleNumber>3.2.3</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено создание аккаунтов для подмены личности и введения других пользователей в заблуждение.
                            </Typography>
                          </SubRuleItem>
                        </Box>
                      </Box>
                    </NumberedRuleItem>
                    
                    <NumberedRuleItem>
                      <RuleNumber>3.3</RuleNumber>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">Мини-игры и честная игра</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Запрещено использовать сторонние программы, скрипты или любые методы для обхода механик игры, искусственного повышения результатов или получения нечестного преимущества перед другими игроками.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <SubRuleItem>
                            <SubRuleNumber>3.3.1</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено использование автокликеров, ботов и других автоматизированных средств.
                            </Typography>
                          </SubRuleItem>
                          <SubRuleItem>
                            <SubRuleNumber>3.3.2</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено использование уязвимостей и багов в мини-играх. При обнаружении таковых необходимо сообщить администрации.
                            </Typography>
                          </SubRuleItem>
                          <SubRuleItem>
                            <SubRuleNumber>3.3.3</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещена передача аккаунтов другим лицам для накрутки результатов или создание множественных аккаунтов для этой цели.
                            </Typography>
                          </SubRuleItem>
                        </Box>
                      </Box>
                    </NumberedRuleItem>
                    
                    <NumberedRuleItem>
                      <RuleNumber>3.4</RuleNumber>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">Многоаккаунтность</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Запрещено создавать множество аккаунтов в обход ограничений или для манипуляций системой.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <SubRuleItem>
                            <SubRuleNumber>3.4.1</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено использовать дополнительные аккаунты для обхода блокировок или ограничений.
                            </Typography>
                          </SubRuleItem>
                          <SubRuleItem>
                            <SubRuleNumber>3.4.2</SubRuleNumber>
                            <Typography variant="body2">
                              Запрещено использование множественных аккаунтов для искусственного увеличения рейтингов, голосований или статистики.
                            </Typography>
                          </SubRuleItem>
                        </Box>
                      </Box>
                    </NumberedRuleItem>
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
                <NumberedRuleItem>
                  <RuleNumber>4.1</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Модерация контента</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Контент проверяется вручную. Администрация оставляет за собой право удалять материалы, нарушающие правила сообщества без предварительного уведомления.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>4.1.1</SubRuleNumber>
                        <Typography variant="body2">
                          Администрация может удалять контент, не соответствующий правилам, без предварительного уведомления пользователя.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.1.2</SubRuleNumber>
                        <Typography variant="body2">
                          При многократных нарушениях на контент может быть наложено требование предварительной модерации перед публикацией.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>4.2</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Санкции за нарушения</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>4.2.1</SubRuleNumber>
                        <Typography variant="body2">
                          Первое нарушение: предупреждение с разъяснением нарушенного правила.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.2.2</SubRuleNumber>
                        <Typography variant="body2">
                          Повторное нарушение: временная блокировка аккаунта на срок от 24 часов до 30 дней в зависимости от тяжести нарушения.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.2.3</SubRuleNumber>
                        <Typography variant="body2">
                          Третье нарушение или серьезное нарушение: более длительная блокировка (от 30 до 90 дней) или ограничение возможностей аккаунта.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.2.4</SubRuleNumber>
                        <Typography variant="body2">
                          Систематические или особо тяжкие нарушения: пожизненная блокировка аккаунта без возможности восстановления.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>4.3</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Система баллов и экономика</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ваш баланс баллов может изменяться (уменьшаться или увеличиваться) в зависимости от ситуации. Администрация отслеживает подозрительную активность.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>4.3.1</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещена искусственная накрутка баллов с использованием ботов, скриптов или мультиаккаунтов.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.3.2</SubRuleNumber>
                        <Typography variant="body2">
                          Если администрация выявит накрутку или странное поведение в переводах, баллы будут аннулированы, а аккаунт может быть заблокирован.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.3.3</SubRuleNumber>
                        <Typography variant="body2">
                          Администрация оставляет за собой право корректировать баланс пользователя в случае технических сбоев или нарушений.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>4.4</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Обжалование решений</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Если вы не согласны с удалением контента или блокировкой, напишите в поддержку в течение 7 дней.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>4.4.1</SubRuleNumber>
                        <Typography variant="body2">
                          Обращение должно содержать чёткое объяснение вашей позиции и аргументы в пользу отмены решения модератора.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.4.2</SubRuleNumber>
                        <Typography variant="body2">
                          Все апелляции рассматриваются в индивидуальном порядке. Администрация оставляет за собой право отказать в восстановлении контента или разблокировке аккаунта.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>4.4.3</SubRuleNumber>
                        <Typography variant="body2">
                          По истечении 7 дней решение модерации считается финальным и не подлежит пересмотру.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
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
                <NumberedRuleItem>
                  <RuleNumber>5.1</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Ответственность за контент</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Вы несёте ответственность за весь контент, который публикуете, комментируете, лайкаете, репостите.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>5.1.1</SubRuleNumber>
                        <Typography variant="body2">
                          Пользователь несет полную ответственность за последствия публикации незаконного или неприемлемого контента.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>5.1.2</SubRuleNumber>
                        <Typography variant="body2">
                          Репост, лайк или положительный комментарий контента, нарушающего правила, также может расцениваться как нарушение.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>5.2</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Сообщения о нарушениях</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Сообщайте о нарушениях, чтобы помочь нам улучшить платформу и обеспечить комфортную среду для всех пользователей.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>5.2.1</SubRuleNumber>
                        <Typography variant="body2">
                          При обнаружении контента, нарушающего правила, используйте функцию "Пожаловаться" для информирования модерации.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>5.2.2</SubRuleNumber>
                        <Typography variant="body2">
                          Ложные жалобы и массовые необоснованные жалобы могут привести к ограничению возможности подачи жалоб в будущем.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>5.3</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Сохранение доступа к аккаунту</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Вы несёте ответственность за безопасность своего аккаунта и его доступность.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>5.3.1</SubRuleNumber>
                        <Typography variant="body2">
                          Используйте надежный пароль
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>5.3.2</SubRuleNumber>
                        <Typography variant="body2">
                          Не передавайте данные для входа в аккаунт третьим лицам. Действия, совершенные с вашего аккаунта, считаются совершенными вами.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
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
                
                <NumberedRuleItem>
                  <RuleNumber>6.1</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Оригинальность контента</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Все бейджики должны быть оригинальными работами. Запрещено копирование, имитация или незначительная модификация существующих бейджиков.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>6.1.1</SubRuleNumber>
                        <Typography variant="body2">
                          Каждый бейджик должен представлять собой уникальную авторскую работу.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>6.1.2</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещено копирование существующих бейджиков с незначительными изменениями (цвет, размер и т.д.).
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>6.2</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Качество изображения</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Бейджики должны быть высокого качества, с четким изображением и хорошим разрешением. Размытые, пиксельные или визуально некачественные бейджики будут отклонены.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>6.2.1</SubRuleNumber>
                        <Typography variant="body2">
                          Используйте только форматы SVG для создания бейджиков для обеспечения высокого качества при любом размере отображения.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>6.2.2</SubRuleNumber>
                        <Typography variant="body2">
                          Изображение должно быть четким, с хорошо различимыми деталями и без артефактов сжатия.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>6.3</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Запрет на дублирование</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Нельзя создавать множество похожих бейджиков с незначительными отличиями. Каждый бейджик должен иметь уникальную концепцию и дизайн.
                    </Typography>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>6.4</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Нарушения авторских прав</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>6.4.1</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещено использовать в бейджиках материалы, защищенные авторским правом, без соответствующего разрешения.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>6.4.2</SubRuleNumber>
                        <Typography variant="body2">
                          Бейджики не должны нарушать права интеллектуальной собственности третьих лиц, включая логотипы и товарные знаки без должной авторизации.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>6.5</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Модерация бейджиков</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>6.5.1</SubRuleNumber>
                        <Typography variant="body2">
                          Все бейджики проходят модерацию перед публикацией.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>6.5.2</SubRuleNumber>
                        <Typography variant="body2">
                          Администрация оставляет за собой право отклонять бейджики, не соответствующие стандартам качества или нарушающие правила платформы.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>6.5.3</SubRuleNumber>
                        <Typography variant="body2">
                          В случае обнаружения нарушений после публикации, бейджик может быть удален без предупреждения.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
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
                
                <NumberedRuleItem>
                  <RuleNumber>7.1</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Запрет на шокирующий контент</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Запрещено публиковать изображения или видео с кровью, насилием, увечьями и другими шокирующими материалами.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>7.1.1</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещены материалы, демонстрирующие реальное насилие, издевательства, травмы и раны.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.1.2</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещены видеоролики и изображения казней, убийств, пыток и других аналогичных действий.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>7.2</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Ограничение экстремального контента</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Контент, который может вызвать сильную негативную реакцию или психологический дискомфорт у пользователей (травмирующие аудио, видео и изображения), запрещен.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>7.2.1</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещен контент с неожиданными громкими звуками, мигающими изображениями или другими эффектами, способными нанести вред или причинить дискомфорт.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.2.2</SubRuleNumber>
                        <Typography variant="body2">
                          Запрещены материалы, которые могут спровоцировать психологические расстройства или паническое состояние.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>7.3</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Свобода творчества</Typography>
                    <Typography variant="body2" color="text.secondary">
                      За исключением указанных выше ограничений, каналы имеют свободу публиковать разнообразный контент, включая развлекательный, образовательный, дискуссионный и творческий материал.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>7.3.1</SubRuleNumber>
                        <Typography variant="body2">
                          Каналы могут самостоятельно определять тематическую направленность и стиль своего контента.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.3.2</SubRuleNumber>
                        <Typography variant="body2">
                          Поощряется оригинальность и авторский подход к созданию материалов, соблюдающих общие правила платформы.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>7.4</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Контентные ограничения</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>7.4.1</SubRuleNumber>
                        <Typography variant="body2">
                          Контент, пропагандирующий опасные действия или самоповреждение.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.4.2</SubRuleNumber>
                        <Typography variant="body2">
                          Контент, демонстрирующий жестокое обращение с людьми или животными.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.4.3</SubRuleNumber>
                        <Typography variant="body2">
                          Экстремистский контент или контент, разжигающий ненависть по признаку расы, национальности, религии и т.д.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.4.4</SubRuleNumber>
                        <Typography variant="body2">
                          Контент, нарушающий законодательство.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
                <NumberedRuleItem>
                  <RuleNumber>7.5</RuleNumber>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">Модерация каналов</Typography>
                    <Box sx={{ mt: 1 }}>
                      <SubRuleItem>
                        <SubRuleNumber>7.5.1</SubRuleNumber>
                        <Typography variant="body2">
                          Каналы несут полную ответственность за весь публикуемый контент.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.5.2</SubRuleNumber>
                        <Typography variant="body2">
                          При первом нарушении канал получает предупреждение, при повторных нарушениях может быть временно или постоянно заблокирован.
                        </Typography>
                      </SubRuleItem>
                      <SubRuleItem>
                        <SubRuleNumber>7.5.3</SubRuleNumber>
                        <Typography variant="body2">
                          Администрация имеет право без предупреждения удалять контент, нарушающий правила.
                        </Typography>
                      </SubRuleItem>
                    </Box>
                  </Box>
                </NumberedRuleItem>
                
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
                    Последнее обновление: 24 Мая 2025
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