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

const TermsOfServicePage = () => {
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
          <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">Условия использования</Typography>
        </Box>
      </Paper>

      <RuleCard>
        <RuleCardHeader>
          <AssignmentIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
          <SectionTitle variant="h5">Условия использования К-Коннект</SectionTitle>
        </RuleCardHeader>
        
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Последнее обновление: 07.06.2025
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" paragraph>
            Добро пожаловать в К-Коннект. Пожалуйста, внимательно прочитайте эти условия использования перед 
            регистрацией аккаунта и использованием нашего сервиса. Регистрируясь или используя К-Коннект, 
            вы соглашаетесь соблюдать эти условия.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            1. Принятие условий
          </Typography>
          
          <Typography variant="body1" paragraph>
            Используя К-Коннект, вы соглашаетесь с настоящими Условиями использования, нашей Политикой конфиденциальности, Правилами сообщества и другими политиками, которые могут быть опубликованы на платформе. Если вы не согласны с любым из этих условий, пожалуйста, не используйте наш сервис.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            2. Регистрация и безопасность аккаунта
          </Typography>
          
          <Typography variant="body1" paragraph>
            Для использования всех функций К-Коннект вам нужно создать аккаунт. Вы соглашаетесь:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Предоставлять точную и актуальную информацию во время регистрации.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Сохранять конфиденциальность своего пароля и немедленно уведомлять нас о любом несанкционированном использовании вашего аккаунта.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Нести ответственность за все действия, происходящие под вашим аккаунтом.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Не создавать несколько аккаунтов без явного разрешения администрации.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            3. Правила контента
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы несете полную ответственность за контент, который публикуете на К-Коннект. Вы обязуетесь не публиковать и не распространять:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Контент, нарушающий чьи-либо права, включая права интеллектуальной собственности.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Незаконный, оскорбительный, дискриминационный, угрожающий или враждебный контент.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Спам, фишинг, вредоносное ПО и другие формы нежелательного контента.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Личную информацию других лиц без их согласия.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            4. Интеллектуальная собственность
          </Typography>
          
          <Typography variant="body1" paragraph>
            К-Коннект и весь контент, представленный на платформе, защищены авторским правом и другими законами об интеллектуальной собственности. Публикуя контент, вы сохраняете все права на него, но предоставляете К-Коннект неисключительную, бесплатную лицензию на использование, воспроизведение, модификацию и отображение этого контента в связи с нашими услугами.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            5. Использование сервиса
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы соглашаетесь:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Использовать сервис только для законных целей и в соответствии с действующим законодательством.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Не пытаться получить несанкционированный доступ к любой части сервиса.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Не использовать автоматизированные скрипты или боты без нашего разрешения.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Не нарушать работу сервиса или сетей, связанных с сервисом.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            6. Отказ от ответственности
          </Typography>
          
          <Typography variant="body1" paragraph>
            К-Коннект не несет ответственности за:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Любые прямые, косвенные, случайные или штрафные убытки.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Любые действия или контент, опубликованный третьими лицами.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Перебои в работе сервиса или потерю данных.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            7. Прекращение использования
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы имеем право:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Приостановить или удалить ваш аккаунт, если вы нарушаете наши условия.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Удалить любой контент, нарушающий наши правила.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1">
                Прекратить предоставление сервиса или его частей по нашему усмотрению с предварительным уведомлением.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            8. Изменения условий
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы можем изменять эти условия время от времени. Мы уведомим вас о существенных изменениях через сервис К-Коннект. Продолжая использовать сервис после таких изменений, вы соглашаетесь с новыми условиями.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            9. Применимое право
          </Typography>
          
          <Typography variant="body1" paragraph>
            Настоящие условия регулируются и толкуются в соответствии с законодательством Российской Федерации, без учета принципов коллизионного права.
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic' }}>
            Используя К-Коннект, вы подтверждаете, что прочитали, поняли и соглашаетесь с этими Условиями использования.
          </Typography>
        </Box>
      </RuleCard>
    </PageContainer>
  );
};

export default TermsOfServicePage;