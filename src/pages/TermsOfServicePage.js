import React from 'react';
import { Box, Typography, Container, Paper, Divider, useTheme } from '@mui/material';
import Header from '../components/Layout/Header';
import SEO from '../components/SEO';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TermsOfServicePage = () => {
  const theme = useTheme();
  
  return (
    <>
      <SEO 
        title="Условия использования | К-Коннект" 
        description="Условия использования К-Коннект - правила и условия для пользователей нашей платформы"
      />
      <Header title="Условия использования" backButton />
      
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
            component="a" 
            href="/terms-of-service"
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
            Условия использования К-Коннект
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Последнее обновление: {new Date().toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            Добро пожаловать в К-Коннект. Пожалуйста, внимательно прочитайте эти условия использования перед 
            регистрацией аккаунта и использованием нашего сервиса. Регистрируясь или используя К-Коннект, 
            вы соглашаетесь соблюдать эти условия.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            1. Принятие условий
          </Typography>
          
          <Typography variant="body1" paragraph>
            Используя К-Коннект, вы соглашаетесь с настоящими Условиями использования, нашей Политикой конфиденциальности, Правилами сообщества и другими политиками, которые могут быть опубликованы на платформе. Если вы не согласны с любым из этих условий, пожалуйста, не используйте наш сервис.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            2. Регистрация и безопасность аккаунта
          </Typography>
          
          <Typography variant="body1" paragraph>
            Для использования всех функций К-Коннект вам нужно создать аккаунт. Вы соглашаетесь:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Предоставлять точную и актуальную информацию во время регистрации.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Сохранять конфиденциальность своего пароля и немедленно уведомлять нас о любом несанкционированном использовании вашего аккаунта.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Нести ответственность за все действия, происходящие под вашим аккаунтом.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Не создавать несколько аккаунтов без явного разрешения администрации.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            3. Правила контента
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы несете полную ответственность за контент, который публикуете на К-Коннект. Вы обязуетесь не публиковать и не распространять:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Контент, нарушающий чьи-либо права, включая права интеллектуальной собственности.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Незаконный, вводящий в заблуждение, порочащий, непристойный, оскорбительный или нарушающий права третьих лиц контент.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Материалы, содержащие вирусы или другой вредоносный код.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Спам, массовые сообщения или другие виды нежелательных материалов.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Контент, содержащий насилие, порнографию, дискриминацию, разжигающий ненависть.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            4. Лицензия на контент
          </Typography>
          
          <Typography variant="body1" paragraph>
            Публикуя контент на К-Коннект, вы предоставляете нам неисключительную, безвозмездную, передаваемую лицензию на использование, воспроизведение, распространение, создание производных работ и отображение этого контента в связи с предоставлением наших услуг.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            5. Использование сервиса
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы соглашаетесь:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Использовать сервис только для законных целей и в соответствии с действующим законодательством.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Не вмешиваться и не нарушать работу сервиса или серверов.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Не собирать данные пользователей без их согласия.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Не использовать автоматические средства для доступа к сервису без нашего разрешения.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            6. Ограничение ответственности
          </Typography>
          
          <Typography variant="body1" paragraph>
            К-Коннект предоставляется "как есть" без каких-либо гарантий. Мы не несем ответственности за:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Любые прямые, косвенные, случайные, специальные или последующие убытки, возникшие в результате использования или невозможности использования сервиса.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Любые действия или контент, опубликованный третьими лицами.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Перебои в работе сервиса или потерю данных.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            7. Прекращение использования
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы имеем право:
          </Typography>
          
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">
                Приостановить или удалить ваш аккаунт, если вы нарушаете наши условия.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Удалить любой контент, нарушающий наши правила.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Прекратить предоставление сервиса или его частей по нашему усмотрению с предварительным уведомлением.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            8. Изменения условий
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы можем изменять эти условия время от времени. Мы уведомим вас о существенных изменениях через сервис К-Коннект. Продолжая использовать сервис после таких изменений, вы соглашаетесь с новыми условиями.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            9. Применимое право
          </Typography>
          
          <Typography variant="body1" paragraph>
            Настоящие условия регулируются и толкуются в соответствии с законодательством Российской Федерации, без учета принципов коллизионного права.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            10. Контактная информация
          </Typography>
          
          <Typography variant="body1" paragraph>
            Если у вас есть вопросы или предложения относительно наших Условий использования, пожалуйста, свяжитесь с нами через форму обратной связи в приложении или отправьте сообщение через раздел "Баг-репорты".
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic' }}>
            Используя К-Коннект, вы подтверждаете, что прочитали, поняли и соглашаетесь с этими Условиями использования.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default TermsOfServicePage;