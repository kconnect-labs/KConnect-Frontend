import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { useLanguage } from '@/context/LanguageContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
  InputAdornment,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { alpha } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(12, 12, 14, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    borderRadius: props => props.fullScreen ? 0 : 12,
    overflow: 'hidden',
    maxWidth: 500,
  }
}));

const DialogHeader = styled(Box)(() => ({
  background: 'linear-gradient(45deg, #d079f3, #5e1c876b)',
  padding: '20px',
  position: 'relative',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const DialogAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  width: 46,
  height: 46,
  fontSize: 20,
  marginBottom: 12,
  '& svg': {
    fontSize: 24
  }
}));

const InputContainer = styled(Box)(() => ({
  marginBottom: 24
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
    backdropFilter: 'blur(5px)',
    borderRadius: 8,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#555555',
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
    '&.Mui-focused': {
      color: '#999999',
    }
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff'
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 2,
    marginTop: 8
  }
}));

const SuggestionsContainer = styled(Box)(() => ({
  backgroundColor: 'rgba(20, 20, 20, 0.4)',
  backdropFilter: 'blur(5px)',
  borderRadius: 8,
  marginBottom: 24,
  maxHeight: 200,
  overflow: 'auto',
}));

const SuggestionItem = styled(Box)(() => ({
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(40, 40, 40, 0.4)'
  }
}));

const UserAvatar = styled(Avatar)(() => ({
  width: 32,
  height: 32,
  fontSize: 14,
  marginRight: 12,
  backgroundColor: '#444444'
}));

const ButtonContainer = styled(Box)(() => ({
  padding: 24, 
  display: 'flex', 
  justifyContent: 'space-between',
  borderTop: '1px solid rgba(54, 54, 54, 0.68)',
  background: 'rgba(10, 10, 10, 0.8)'
}));

const CancelButton = styled(Button)(() => ({
  color: 'rgba(255,255,255,0.7)',
  '&:hover': {
    backgroundColor: 'rgba(40, 40, 40, 0.4)'
  }
}));

const GradientButton = styled(Button)(() => ({
  backgroundImage: 'linear-gradient(90deg, #6b5d97, #827095)',
  color: 'white',
  padding: '8px 24px',
  '&:hover': {
    opacity: 0.9,
  },
  '&:disabled': {
    color: 'rgba(255,255,255,0.5)',
    backgroundImage: 'none',
    backgroundColor: 'rgba(40, 40, 40, 0.4)'
  }
}));

// Функция для определения светлого/темного фона
const isLightColor = (color) => {
  if (!color || !color.startsWith('#')) {
    return false;
  }
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

const UserCard = styled(Box)(({ theme, decoration }) => {
  // Определяем тип фона (градиент, изображение или цвет)
  const isGradient = decoration?.background?.includes('linear-gradient');
  const isImage = decoration?.background?.includes('/');
  const isHexColor = decoration?.background?.startsWith('#');
  const isLightBackground = isHexColor && isLightColor(decoration?.background);

  return {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    background: decoration?.background ? (
      isImage ? `url(${decoration.background})` : decoration.background
    ) : theme.palette.background.paper,
    backgroundSize: isImage ? 'cover' : 'auto',
    backgroundPosition: isImage ? 'center' : 'auto',
    color: isLightBackground ? 'rgba(0, 0, 0, 0.87)' : theme.palette.text.primary,
    '& .MuiTypography-root': {
      color: isLightBackground ? 'rgba(0, 0, 0, 0.87)' : 'inherit',
    },
    '& .MuiTypography-colorTextSecondary': {
      color: isLightBackground ? 'rgba(0, 0, 0, 0.6)' : theme.palette.text.secondary,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      cursor: 'pointer',
    },
    '&::before': isGradient ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: decoration.background,
      opacity: 0.15,
      zIndex: 0,
    } : {},
  };
});

const DecorationItem = styled('img')({
  position: 'absolute',
  right: 0,
  height: 'max-content',
  maxHeight: 60,
  opacity: 1,
  pointerEvents: 'none',
  zIndex: 1,
});

const TransferMenu = ({ open, onClose, userPoints, onSuccess }) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [transferData, setTransferData] = useState({ username: '', amount: '', message: '', recipient_id: null });
  const [transferErrors, setTransferErrors] = useState({});
  const [userSearch, setUserSearch] = useState({ loading: false, exists: false, suggestions: [] });
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferReceipt, setTransferReceipt] = useState(null);
  
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    
    if (!open) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
  }, [open]);

  const searchUser = (query) => {
    setUserSearch(prev => ({...prev, loading: true}));
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      const url = `/api/search/recipients?query=${encodeURIComponent(query)}`;
      
      axios.get(url)
        .then(response => {
          if (response.data && response.data.users && response.data.users.length > 0) {
            const exactMatch = response.data.users.find(u => 
              u.username.toLowerCase() === query.toLowerCase()
            );
            
            if (exactMatch) {
              setTransferData(prev => ({...prev, recipient_id: exactMatch.id}));
            } else {
              setTransferData(prev => ({...prev, recipient_id: null}));
            }
            
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: !!exactMatch,
              suggestions: response.data.users.slice(0, 3),
            }));
          } else {
            setUserSearch(prev => ({
              ...prev,
              loading: false,
              exists: false,
              suggestions: [],
            }));
            setTransferData(prev => ({...prev, recipient_id: null}));
          }
        })
        .catch(error => {
          console.error('Error searching for user:', error);
          setUserSearch(prev => ({
            ...prev,
            loading: false,
            exists: false,
            suggestions: [],
          }));
          setTransferData(prev => ({...prev, recipient_id: null}));
        });
    }, 300); 
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setTransferData(prev => ({...prev, username}));
    
    if (username.trim()) {
      searchUser(username.trim());
    } else {
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setUserSearch(prev => ({
        ...prev,
        loading: false,
        exists: false,
        suggestions: [],
      }));
      setTransferData(prev => ({...prev, recipient_id: null}));
    }
  };

  const selectSuggestion = (username, userId) => {
    setTransferData(prev => ({...prev, username, recipient_id: userId}));
    setUserSearch(prev => ({
      ...prev,
      loading: false,
      exists: true,
      suggestions: []
    }));
  };

  // Calculate commission and total amount
  const calculateCommission = (amount) => {
    if (!amount || isNaN(amount)) return { commission: 0, total: 0, recipientAmount: 0 };
    const numAmount = parseInt(amount);
    const commission = Math.floor(numAmount * 0.1); // 10% commission
    return {
      commission,
      total: numAmount,
      recipientAmount: numAmount - commission
    };
  };

  const handleTransferPoints = async () => {
    const errors = {};
    if (!transferData.username) errors.username = t('balance.transfer.errors.enter_username');
    if (!transferData.recipient_id) errors.username = t('balance.transfer.errors.user_not_found');
    if (!transferData.amount) {
      errors.amount = t('balance.transfer.errors.enter_amount');
    } else if (isNaN(transferData.amount) || parseInt(transferData.amount) <= 0) {
      errors.amount = t('balance.transfer.errors.positive_amount');
    } else {
      const { total } = calculateCommission(transferData.amount);
      if (total > userPoints) {
        errors.amount = t('balance.transfer.errors.insufficient_points');
      }
    }

    if (Object.keys(errors).length > 0) {
      setTransferErrors(errors);
      return;
    }

    if (isTransferring) return;

    setTransferErrors({});
    setIsTransferring(true);
    
    const transferAmount = parseInt(transferData.amount);
    const { commission, total, recipientAmount } = calculateCommission(transferAmount);
    const newBalance = userPoints - total;
    
    try {
      const response = await axios.post(`/api/user/transfer-points`, {
        recipient_username: transferData.username,
        recipient_id: transferData.recipient_id,
        amount: transferAmount,
        message: transferData.message
      });
      
      try {
        const now = new Date();
        const transactionId = `TR-${Date.now().toString().slice(-8)}`;
        
        const receiptResponse = await axios.post(`/api/user/generate-receipt`, {
          transaction_data: {
            transactionId: transactionId,
            amount: transferAmount,
            commission: commission,
            total: total,
            recipientAmount: recipientAmount,
            recipientUsername: transferData.username,
            senderUsername: response.data.sender_username || 'Вы', 
            date: now.toISOString()
          }
        });
        
        if (receiptResponse.data && receiptResponse.data.success) {
          setTransferReceipt({
            dataUrl: `data:application/pdf;base64,${receiptResponse.data.pdf_data}`,
            filePath: receiptResponse.data.file_path,
            amount: transferAmount,
            commission: commission,
            total: total,
            recipientAmount: recipientAmount,
            recipient: transferData.username,
            previousBalance: userPoints,
            newBalance: newBalance
          });
          
          setTransferSuccess(true);
          
          if (onSuccess) {
            onSuccess({
              newBalance: newBalance,
              previousBalance: userPoints,
              amount: transferAmount,
              commission: commission,
              total: total,
              recipientAmount: recipientAmount
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при создании чека:', error);
        
        setTransferSuccess(true);
        if (onSuccess) {
          onSuccess({
            newBalance: newBalance,
            previousBalance: userPoints,
            amount: transferAmount,
            commission: commission,
            total: total,
            recipientAmount: recipientAmount
          });
        }
      }
      
      setTransferData({ username: '', amount: '', message: '', recipient_id: null });
      setIsTransferring(false);
      
    } catch (error) {
      console.error('Ошибка при переводе баллов:', error);
      setTransferErrors({ general: error.response?.data?.error || 'Ошибка при переводе баллов' });
      setIsTransferring(false);
    }
  };

  const handleClearUsername = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setTransferData(prev => ({...prev, username: '', recipient_id: null}));
    setUserSearch(prev => ({ ...prev, loading: false, exists: false, suggestions: [] }));
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={() => {
        if (!isTransferring) {
          if (transferSuccess) {
            setTransferSuccess(false);
          }
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      {!transferSuccess ? (
        <>
          <DialogHeader>
            <DialogAvatar>
              <SendIcon />
            </DialogAvatar>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              {t('balance.transfer_menu.title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '80%' }}>
              {t('balance.transfer_menu.subtitle')}
            </Typography>
          </DialogHeader>
          
          <DialogContent sx={{ p: 3, bgcolor: 'rgba(10, 10, 10, 0.8)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('balance.transfer_menu.available')}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#AAAAAA' }}>
                {userPoints} {t('balance.transfer_menu.points_suffix')}
              </Typography>
            </Box>

            <InputContainer>
              <StyledTextField
                label={t('balance.transfer_menu.recipient.label')}
                fullWidth
                variant="outlined"
                value={transferData.username}
                onChange={handleUsernameChange}
                error={!!transferErrors.username}
                helperText={transferErrors.username}
                placeholder={t('balance.transfer_menu.recipient.placeholder')}
                InputProps={{
                  endAdornment: (
                    <React.Fragment>
                      {userSearch.loading && <CircularProgress size={20} color="inherit" />}
                      {userSearch.exists && !userSearch.loading && 
                        <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                      }
                      {transferData.username && !userSearch.loading && (
                        <InputAdornment position="end">
                          <IconButton 
                            edge="end"
                            onClick={handleClearUsername}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )}
                    </React.Fragment>
                  )
                }}
              />
            </InputContainer>
            
            {userSearch.suggestions.length > 0 && !userSearch.exists && (
              <SuggestionsContainer>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    {t('balance.transfer_menu.recipient.similar_users')}
                  </Typography>
                </Box>
                {userSearch.suggestions.map((user) => (
                  <UserCard
                    key={user.id}
                    decoration={user.decoration}
                    onClick={() => selectSuggestion(user.username, user.id)}
                  >
                    {user.decoration?.item_path && (() => {
                      const [path, ...styles] = user.decoration.item_path.split(';');
                      const styleObj = styles.reduce((acc, style) => {
                        const [key, value] = style.split(':').map(s => s.trim());
                        if (key === 'height') {
                          const size = parseInt(value);
                          return { ...acc, [key]: `${size / 2}px` };
                        }
                        return { ...acc, [key]: value };
                      }, {});

                      return (
                        <DecorationItem 
                          src={path}
                          alt={t('balance.transfer_menu.recipient.decoration_alt')}
                          style={styleObj}
                        />
                      );
                    })()}
                    <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
                      <UserAvatar 
                        src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
                        alt={user.username}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          {user.verification_status === 'verified' && (
                            <VerifiedIcon 
                              sx={{ 
                                fontSize: 16, 
                                ml: 0.5, 
                                color: '#D0BCFF' 
                              }} 
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </UserCard>
                ))}
              </SuggestionsContainer>
            )}
            
            {userSearch.exists && transferData.recipient_id && (
              <Box sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: 'rgba(40, 40, 40, 0.4)', 
                backdropFilter: 'blur(5px)',
                borderRadius: 2,
                border: '1px solid rgba(60, 60, 60, 0.4)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                <Typography variant="body2">
                  {t('balance.transfer_menu.recipient.confirmed')} <strong>{transferData.username}</strong>
                </Typography>
              </Box>
            )}
            
            <InputContainer>
              <StyledTextField
                label={t('balance.transfer_menu.amount.label')}
                fullWidth
                variant="outlined"
                type="number"
                value={transferData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setTransferData(prev => ({...prev, amount: value}));
                    setTransferErrors(prev => ({...prev, amount: ''}));
                  }
                }}
                error={!!transferErrors.amount}
                helperText={transferErrors.amount}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t('balance.transfer_menu.points_suffix')}</InputAdornment>
                }}
              />
              {transferData.amount && !transferErrors.amount && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('balance.transfer_menu.amount.details')}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('balance.transfer_menu.amount.transfer_amount')}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {transferData.amount} {t('balance.transfer_menu.points_suffix')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('balance.transfer_menu.amount.commission')}
                    </Typography>
                    <Typography variant="body2" color="error">
                      -{calculateCommission(transferData.amount).commission} {t('balance.transfer_menu.points_suffix')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('balance.transfer_menu.amount.recipient_gets')}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {calculateCommission(transferData.amount).recipientAmount} {t('balance.transfer_menu.points_suffix')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('balance.transfer_menu.amount.your_balance')}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {userPoints - calculateCommission(transferData.amount).total} {t('balance.transfer_menu.points_suffix')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </InputContainer>
            
            <InputContainer>
              <StyledTextField
                label={t('balance.transfer_menu.message.label')}
                fullWidth
                variant="outlined"
                value={transferData.message}
                onChange={(e) => setTransferData(prev => ({ ...prev, message: e.target.value }))}
                placeholder={t('balance.transfer_menu.message.placeholder')}
                multiline
                rows={2}
              />
            </InputContainer>
            
            {transferErrors.general && (
              <Box sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'rgba(50, 20, 20, 0.4)', 
                backdropFilter: 'blur(5px)',
                borderRadius: 2,
                border: '1px solid rgba(70, 20, 20, 0.4)',
              }}>
                <Typography variant="body2" color="error">
                  {transferErrors.general}
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <ButtonContainer>
            <CancelButton 
              onClick={onClose}
              disabled={isTransferring}
            >
              {t('balance.transfer_menu.buttons.cancel')}
            </CancelButton>
            <GradientButton 
              onClick={handleTransferPoints} 
              disabled={!userSearch.exists || !transferData.recipient_id || userSearch.loading || !transferData.amount || isTransferring}
              startIcon={isTransferring ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {isTransferring ? t('balance.transfer_menu.buttons.processing') : t('balance.transfer_menu.buttons.transfer')}
            </GradientButton>
          </ButtonContainer>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogAvatar sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', width: 60, height: 60 }}>
              <CheckCircleIcon sx={{ fontSize: 32 }} />
            </DialogAvatar>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              {t('balance.transfer_menu.success.title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '80%' }}>
              {t('balance.transfer_menu.success.subtitle', { recipient: transferReceipt?.recipient })}
            </Typography>
          </DialogHeader>
          
          <DialogContent sx={{ p: 3, bgcolor: 'rgba(10, 10, 10, 0.8)' }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(40, 40, 40, 0.4)', 
              borderRadius: 2,
              mb: 3,
              border: '1px solid rgba(60, 60, 60, 0.4)',
            }}>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                {t('balance.transfer_menu.success.details.title')}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('balance.transfer_menu.success.details.amount')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {transferReceipt?.amount} {t('balance.transfer_menu.points_suffix')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('balance.transfer_menu.success.details.recipient')}
                </Typography>
                <Typography variant="body1">
                  {transferReceipt?.recipient}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 4, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#4CAF50', mb: 2 }}>
                  {t('balance.transfer_menu.success.details.balance.title')}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t('balance.transfer_menu.success.details.balance.before')}
                    </Typography>
                    <Typography variant="h6">
                      {transferReceipt?.previousBalance}
                    </Typography>
                  </Box>
                  
                  <ArrowRightAltIcon sx={{ color: 'rgba(255,255,255,0.3)', mx: 2 }} />
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t('balance.transfer_menu.success.details.balance.after')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#AAAAAA' }}>
                      {transferReceipt?.newBalance}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            {transferReceipt?.dataUrl && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Button 
                  component="a"
                  href={transferReceipt.dataUrl}
                  download={`receipt-${Date.now()}.pdf`}
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                >
                  {t('balance.transfer_menu.success.receipt.download')}
                </Button>
              </Box>
            )}
          </DialogContent>
          
          <ButtonContainer>
            <GradientButton 
              onClick={() => {
                setTransferSuccess(false);
                onClose();
              }}
              fullWidth
            >
              {t('balance.transfer_menu.buttons.close')}
            </GradientButton>
          </ButtonContainer>
        </>
      )}
    </StyledDialog>
  );
};

export default TransferMenu; 