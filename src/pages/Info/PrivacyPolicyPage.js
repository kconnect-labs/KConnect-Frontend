import React from 'react';
import { Typography, Container, Paper, Divider, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import RuleIcon from '@mui/icons-material/Rule';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
  },
}));

const RuleCard = styled(Paper)(({ theme }) => ({
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

const PrivacyPolicyPage = () => {
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
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(208, 188, 255, 0.1) 100%)',
          border: '1px solid rgba(208, 188, 255, 0.2)'
        }}
      >
        <Box 
          component={RouterLink} 
          to="/rules"
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
            color: 'primary.main',
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

      <RuleCard>
        <RuleCardHeader>
          <SecurityIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
          <SectionTitle variant="h5">Политика конфиденциальности К-Коннект</SectionTitle>
        </RuleCardHeader>
        
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Последнее обновление: {new Date().toLocaleDateString()}
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" paragraph>
            К-Коннект уважает вашу конфиденциальность и стремится защитить ваши персональные данные. 
            Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу информацию.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            1. Собираемая информация
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы собираем следующие типы информации:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Информация, которую вы предоставляете при регистрации (имя, email, дата рождения).
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Контент, который вы публикуете на платформе.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Информация об использовании сервиса (время активности, предпочтения).
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Техническая информация (IP-адрес, тип устройства, браузер).
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            2. Использование информации
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы используем собранную информацию для:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Предоставления и улучшения наших услуг.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Персонализации вашего опыта использования платформы.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Обеспечения безопасности и предотвращения мошенничества.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Коммуникации с вами по вопросам сервиса.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            3. Защита информации
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы принимаем следующие меры для защиты вашей информации:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Шифрование данных при передаче и хранении.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Регулярное обновление систем безопасности.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Ограничение доступа к персональным данным.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Мониторинг и предотвращение несанкционированного доступа.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            4. Обмен информацией
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы не продаем ваши персональные данные третьим лицам. Мы можем делиться информацией только в следующих случаях:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                С вашего явного согласия.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Для выполнения юридических обязательств.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Для защиты наших прав и безопасности.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            5. Ваши права
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы имеете право:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Получить доступ к своим персональным данным.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Исправить неточные данные.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Запросить удаление своих данных.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Отозвать согласие на обработку данных.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            6. Cookies и отслеживание
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы используем cookies и аналогичные технологии для:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Сохранения ваших предпочтений.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Анализа использования сервиса.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Улучшения безопасности.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            7. Изменения в политике
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы можем обновлять эту политику конфиденциальности время от времени. Мы уведомим вас о существенных изменениях через сервис К-Коннект.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            8. Контакты
          </Typography>
          
          <Typography variant="body1" paragraph>
            Если у вас есть вопросы о нашей политике конфиденциальности, пожалуйста, свяжитесь с нами через форму обратной связи в приложении или напишите на support@k-connect.ru.
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic' }}>
            Используя К-Коннект, вы соглашаетесь с условиями этой политики конфиденциальности.
          </Typography>
        </Box>
      </RuleCard>
    </PageContainer>
  );
};

export default PrivacyPolicyPage; 