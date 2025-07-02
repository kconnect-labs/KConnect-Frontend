import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Cookie as CookieIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(4),
  marginTop: '20px'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const CookiePage = () => {
  const theme = useTheme();

  return (
    <PageContainer maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CookieIcon color="primary" />
            Использование Cookie в K-Connect
          </Typography>
          <Typography variant="body1" paragraph>
            K-Connect использует cookie-файлы для обеспечения безопасности, сохранения пользовательских настроек и улучшения пользовательского опыта. На этой странице мы объясняем, как и для чего используются cookie в нашем приложении.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <SectionTitle variant="h5">
            <SecurityIcon />
            Безопасность и аутентификация
          </SectionTitle>
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Сессионные cookie"
                secondary="Используются для поддержания сессии пользователя и обеспечения безопасного доступа к защищенным ресурсам. Эти cookie являются HTTP-only и не могут быть прочитаны JavaScript."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Сессионные ключи"
                secondary="Хранятся в защищенных HTTP-only cookie для безопасной аутентификации пользователей. Сессия автоматически продлевается при активном использовании приложения."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <SectionTitle variant="h5">
            <SettingsIcon />
            Пользовательские настройки
          </SectionTitle>
          <List>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Настройки темы"
                secondary="Cookie используются для сохранения выбранной пользователем темы оформления (светлая/темная/контрастная)."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Пользовательские предпочтения"
                secondary="Сохраняют настройки интерфейса, выбранные пользователем для улучшения пользовательского опыта."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <SectionTitle variant="h5">
            <StorageIcon />
            Хранение данных
          </SectionTitle>
          <List>
            <ListItem>
              <ListItemIcon>
                <StorageIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Локальное хранение"
                secondary="Некоторые данные дублируются в localStorage для быстрого доступа и улучшения производительности."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StorageIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Синхронизация данных"
                secondary="Данные синхронизируются между cookie, localStorage и sessionStorage для обеспечения надежности."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <SectionTitle variant="h5">
            <InfoIcon />
            Важная информация
          </SectionTitle>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Безопасность"
                secondary="Все cookie, связанные с аутентификацией, защищены флагами HttpOnly и SameSite для предотвращения XSS-атак."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Срок действия"
                secondary="Сессионные cookie действительны до закрытия браузера или при отсутствии активности в течение определенного времени. Настройки пользователя хранятся до 365 дней."
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default CookiePage; 