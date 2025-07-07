import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  useTheme
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';

const LinkPreview = ({ url, isCurrentUser = false }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/utils/link-preview', { url });
        if (response.data) {
          setPreview(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  if (error) {
    return null;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getDomainName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  // Цветовая схема в зависимости от отправителя
  const colors = isCurrentUser ? {
    background: 'rgba(158, 119, 237, 0.12)',
    border: 'rgba(158, 119, 237, 0.2)',
    accent: '#9E77ED',
    hover: 'rgba(158, 119, 237, 0.18)'
  } : {
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.15)',
    accent: '#9E77ED',
    hover: 'rgba(255, 255, 255, 0.12)'
  };

  return (
    <Paper
      elevation={0}
      onClick={handleClick}
      sx={{
        mt: 1,
        mb: 0.5,
        overflow: 'hidden',
        borderRadius: '12px',
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        maxHeight: '80px',
        maxWidth: '320px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        '&:hover': {
          backgroundColor: colors.hover,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '3px',
          backgroundColor: colors.accent,
          borderRadius: '2px',
        }
      }}
    >
      {loading ? (
        <Box sx={{ p: 1.2, width: '100%', display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.5 }} />
        </Box>
      ) : (
        <>
          {preview?.image && (
            <Box
              sx={{
                width: 80,
                height: 80,
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src={preview.image}
                alt={preview.title || "Ссылка"}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          <Box sx={{ 
            p: 1.2, 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderLeft: preview?.image ? `1px solid ${colors.border}` : 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                margin: 0,
                fontWeight: 500,
                fontSize: '0.8rem',
                lineHeight: 1.3,
                color: theme.palette.text.primary,
                mb: 0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {(preview?.title || getDomainName(url)).length > 30 
                ? `${(preview?.title || getDomainName(url)).substring(0, 30)}...` 
                : (preview?.title || getDomainName(url))}
            </Typography>
            {preview?.description && (
              <Typography
                variant="caption"
                sx={{
                  margin: 0,
                  color: theme.palette.text.secondary,
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  mb: 0.3
                }}
              >
                {preview.description.length > 45 
                  ? `${preview.description.substring(0, 45)}...` 
                  : preview.description}
              </Typography>
            )}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: colors.accent + '15',
              py: 0.2,
              px: 0.6,
              borderRadius: '6px',
              width: 'fit-content',
              maxWidth: '100%'
            }}>
              <LinkIcon fontSize="small" sx={{ color: colors.accent, mr: 0.4, fontSize: '0.7rem' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  margin: 0,
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }} 
                noWrap
              >
                {getDomainName(url)}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default LinkPreview; 