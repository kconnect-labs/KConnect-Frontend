import React from 'react';
import { Box, Typography, Container, Paper, Divider, useTheme } from '@mui/material';
import Header from '../../components/Layout/Header';
import SEO from '../../components/SEO';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';

const PrivacyPolicyPage = () => {
  const theme = useTheme();
  
  return (
    <>
      <SEO 
        title="Политика конфиденциальности | К-Коннект" 
        description="Политика конфиденциальности К-Коннект - узнайте, как мы обрабатываем ваши данные и защищаем вашу приватность"
      />
      <Header title="Политика конфиденциальности" backButton />
      
      {}
      <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            p: 2,
            mb: 2,
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
            component="a" 
            href="/rules"
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
            <GavelIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">Правила сообщества</Typography>
          </Box>
          
          <Box 
            component="a" 
            href="/privacy-policy"
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
            <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">Политика конфиденциальности</Typography>
          </Box>
          
          <Box 
            component="a" 
            href="/terms-of-service"
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
      </Container>
      
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Политика конфиденциальности К-Коннект
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Последнее обновление: {new Date().toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            Мы, команда К-Коннект, серьезно относимся к безопасности ваших личных данных. Эта политика конфиденциальности 
            описывает, какую информацию мы собираем и как мы ее используем.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            1. Какую информацию мы собираем
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы собираем следующие типы информации:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                <strong>Информация аккаунта:</strong> имя, имя пользователя (username), адрес электронной почты, фотография профиля, информация о себе.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                <strong>Данные профиля:</strong> интересы, социальные ссылки, данные, которые вы решите указать в вашем профиле.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                <strong>Контент:</strong> посты, комментарии, лайки, музыка и медиа, которые вы публикуете.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                <strong>Технические данные:</strong> IP-адрес, данные браузера, время доступа, данные устройства.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                <strong>Данные взаимодействия:</strong> подписки, взаимодействия с другими пользователями, настройки уведомлений.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            2. Как мы используем вашу информацию
          </Typography>
          
          <Typography variant="body1" paragraph>
            Ваша информация используется для:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Обеспечения функционирования платформы и предоставления вам доступа к ее функциям.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Улучшения, персонализации и развития нашего сервиса.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Коммуникации с вами, включая отправку уведомлений, обновлений и технической информации.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Обеспечения безопасности и защиты сервиса от мошенничества и злоупотреблений.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            3. Как мы делимся вашей информацией
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы не продаем ваши данные третьим лицам. Мы можем делиться информацией в следующих случаях:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                С вашего явного согласия.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Для выполнения требований законодательства.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                С поставщиками услуг, которые помогают нам управлять сервисом (хостинг, аналитика и т.д.).
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            4. Безопасность ваших данных
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы внедряем необходимые технические и организационные меры для защиты ваших данных, включая:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Шифрование передаваемых данных.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Хранение паролей в защищенной форме.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Регулярные обновления безопасности системы.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            5. Ваши права
          </Typography>
          
          <Typography variant="body1" paragraph>
            В зависимости от вашего местоположения, вы можете иметь следующие права:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Доступ к вашим персональным данным.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Исправление неточной или неполной информации.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Удаление ваших персональных данных.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Ограничение обработки ваших данных.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Получение ваших данных в структурированном, машиночитаемом формате.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            6. Файлы Cookie и подобные технологии
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы используем файлы cookie и подобные технологии для улучшения работы сервиса, анализа использования и персонализации. Вы можете управлять настройками файлов cookie через ваш браузер.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            7. Изменения в политике конфиденциальности
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы можем обновлять нашу политику конфиденциальности время от времени. Мы уведомим вас о любых существенных изменениях через сервис К-Коннект или по электронной почте.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            8. Контактная информация
          </Typography>
          
          <Typography variant="body1" paragraph>
            Если у вас есть вопросы, связанные с этой политикой или с обработкой ваших данных, пожалуйста, свяжитесь с нами через форму обратной связи в приложении или отправьте сообщение через раздел "Баг-репорты".
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default PrivacyPolicyPage; 