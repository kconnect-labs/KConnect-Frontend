import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  FactCheck as FactCheckIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const FactModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  onDelete, 
  loading, 
  error, 
  existingFact, 
  postId 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    who_provided: '',
    explanation_text: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Заполняем форму данными существующего факта при открытии модалки
  useEffect(() => {
    if (open) {
      if (existingFact) {
        setFormData({
          who_provided: existingFact.who_provided || '',
          explanation_text: existingFact.explanation_text || ''
        });
      } else {
        setFormData({
          who_provided: '',
          explanation_text: ''
        });
      }
      setShowDeleteConfirm(false);
    }
  }, [open, existingFact]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    if (!formData.who_provided.trim() || !formData.explanation_text.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const isFormValid = formData.who_provided.trim() && formData.explanation_text.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? false : "md"}
      fullWidth={!isMobile}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobile ? 0 : '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          height: isMobile ? '100vh' : 'auto',
          margin: isMobile ? 0 : 'auto',
          maxHeight: isMobile ? '100vh' : '90vh',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(20, 20, 20, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: isMobile ? 0 : '16px',
            zIndex: -1
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          pt: isMobile ? 2 : 'auto',
          px: isMobile ? 2 : 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: isMobile ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
          borderRadius: isMobile ? 0 : '16px 16px 0 0',
          position: isMobile ? 'sticky' : 'static',
          top: 0,
          zIndex: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FactCheckIcon sx={{ color: '#6e5a9d', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {existingFact ? 'Редактировать факт' : 'Добавить факт'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        pt: 3, 
        pb: 2,
        px: isMobile ? 2 : 3,
        flex: isMobile ? 1 : 'none',
        overflow: isMobile ? 'auto' : 'visible'
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: '#f44336'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3, 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}
        >
          {existingFact 
            ? 'Отредактируйте информацию о проверке фактов для этого поста.'
            : 'Добавьте официальное разъяснение к этому посту для проверки фактов.'
          }
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2.5 : 3 }}>
          <TextField
            label="Кто предоставил разъяснение"
            value={formData.who_provided}
            onChange={handleInputChange('who_provided')}
            fullWidth
            placeholder="например: Министерство здравоохранения РФ"
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                fontSize: isMobile ? '16px' : '14px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6e5a9d',
                  borderWidth: '2px'
                },
                '& input': {
                  color: 'white',
                  fontSize: isMobile ? '16px' : '14px'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: isMobile ? '16px' : '14px',
                '&.Mui-focused': {
                  color: '#6e5a9d'
                }
              }
            }}
          />

          <TextField
            label="Текст разъяснения"
            value={formData.explanation_text}
            onChange={handleInputChange('explanation_text')}
            fullWidth
            multiline
            rows={isMobile ? 6 : 4}
            placeholder="Введите подробное разъяснение или опровержение..."
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6e5a9d',
                  borderWidth: '2px'
                },
                '& textarea': {
                  color: 'white',
                  fontSize: isMobile ? '16px' : '14px'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: isMobile ? '16px' : '14px',
                '&.Mui-focused': {
                  color: '#6e5a9d'
                }
              }
            }}
          />
        </Box>

        {existingFact && (
          <>
            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: '12px',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#f44336', 
                  mb: 1,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <DeleteIcon fontSize="small" />
                Удаление факта
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 2,
                  fontSize: '0.85rem'
                }}
              >
                {showDeleteConfirm 
                  ? 'Вы уверены, что хотите удалить этот факт? Это действие нельзя отменить.'
                  : 'Удалить факт и все связанные с ним данные из этого поста.'
                }
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={loading}
                startIcon={showDeleteConfirm ? <DeleteIcon /> : <DeleteIcon />}
                sx={{
                  borderRadius: '8px',
                  borderColor: showDeleteConfirm ? '#f44336' : 'rgba(244, 67, 54, 0.5)',
                  color: showDeleteConfirm ? '#f44336' : 'rgba(244, 67, 54, 0.8)',
                  '&:hover': {
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    color: '#f44336'
                  }
                }}
              >
                {showDeleteConfirm ? 'Подтвердить удаление' : 'Удалить факт'}
              </Button>
              {showDeleteConfirm && (
                <Button
                  variant="text"
                  onClick={() => setShowDeleteConfirm(false)}
                  sx={{ 
                    ml: 1,
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Отмена
                </Button>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: isMobile ? 2 : 3, 
          pt: 1,
          px: isMobile ? 2 : 3,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: isMobile ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
          borderRadius: isMobile ? 0 : '0 0 16px 16px',
          position: isMobile ? 'sticky' : 'static',
          bottom: 0,
          zIndex: 1,
          gap: isMobile ? 1 : 0
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          fullWidth={isMobile}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '10px',
            px: 3,
            flex: isMobile ? 1 : 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            }
          }}
        >
          Отмена
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          variant="contained"
          fullWidth={isMobile}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : (existingFact ? <EditIcon /> : <AddIcon />)}
          sx={{
            backgroundColor: '#6e5a9d',
            borderRadius: '10px',
            px: 3,
            fontWeight: 600,
            flex: isMobile ? 1 : 'none',
            '&:hover': {
              backgroundColor: '#5d4a85'
            },
            '&:disabled': {
              backgroundColor: 'rgba(110, 90, 157, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          {loading 
            ? (existingFact ? 'Сохранение...' : 'Создание...') 
            : (existingFact ? 'Сохранить изменения' : 'Создать факт')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FactModal; 