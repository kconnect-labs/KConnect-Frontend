import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Divider,
  CircularProgress,
  Chip,
  Grid,
  Card,
  Link
} from '@mui/material';
import UpdateService from '../../services/UpdateService';
import UpdateInfo from '../../components/Updates/UpdateInfo';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import HistoryIcon from '@mui/icons-material/History';

/**
 * Страница с историей всех обновлений системы
 */
const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

    const allUpdates = UpdateService.getAllUpdates();
    setUpdates(allUpdates);
    setLoading(false);
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <HistoryIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="medium">
          История обновлений
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} color="primary" />
        </Box>
      ) : (
        <Box>
          {updates.map((update, index) => (
            <Box key={update.version} sx={{ mb: 4 }}>
              <UpdateInfo
                version={update.version}
                date={update.date}
                title={update.title}
                updates={update.updates}
                fixes={update.fixes}
              />
              
              {index < updates.length - 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  my: 3 
                }}>
                  <Box sx={{ 
                    width: 2, 
                    height: 40, 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4
                  }} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
      
      {/* Секция с дополнительной информацией */}
      <Paper sx={{ 
        mt: 6, 
        p: 3, 
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(208, 188, 255, 0.1)'
      }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
          Информация о версиях
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          K-Connect постоянно развивается и совершенствуется. Мы регулярно выпускаем обновления с новыми функциями и улучшениями существующих возможностей.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Если у вас есть идеи или предложения по улучшению сервиса, пожалуйста, свяжитесь с нами через форму обратной связи или напишите нам на почту 
          <Link href="mailto:support@k-connect.ru" sx={{ ml: 1 }}>
            support@k-connect.ru
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default UpdatesPage; 