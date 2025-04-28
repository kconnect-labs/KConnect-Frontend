import React, { useContext } from 'react';
import { Box, Typography, Paper, Container, Button } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
const BanPage = () => {
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1A1A1A 0%, #121212 100%)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <Box 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <BlockIcon 
              color="error" 
              sx={{ 
                fontSize: 80,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.7 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.7 }
                }
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'error.main',
              mb: 2
            }}
          >
            Аккаунт заблокирован
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            sx={{ mb: 4 }}
          >
            Ваш аккаунт был заблокирован модератором из-за нарушения правил сообщества. 
            Если вы считаете, что это произошло по ошибке, пожалуйста, обратитесь к администрации сайта.
          </Typography>
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: 'rgba(244, 67, 54, 0.05)', 
              borderRadius: '8px',
              mb: 4,
              border: '1px solid rgba(244, 67, 54, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GavelIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" sx={{ color: 'error.main' }}>
                Возможные причины блокировки:
              </Typography>
            </Box>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Нарушение правил сообщества
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Публикация запрещенного контента
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Спам или недопустимое поведение
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Многократное нарушение правил платформы
                </Typography>
              </li>
            </ul>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              component={Link}
              to="/rules"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              Правила сообщества
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              to="/bugs"
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Обратиться в поддержку
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.05)',
                  borderColor: 'error.dark'
                }
              }}
            >
              Выйти
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};
export default BanPage; 