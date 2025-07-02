import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

// Стилизованный компонент для выпадающих списков
export const StyledSelect = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '31px !important',
  },
  '& .MuiMenu-paper': {
    background: 'rgba(255, 255, 255, 0.03) !important',
    backdropFilter: 'blur(10px) !important',
    border: '1px solid rgba(255, 255, 255, 0.1) !important',
    '& .MuiMenuItem-root': {
      height: '20px !important',
      fontSize: '0.75rem !important',
      padding: '2px 8px !important',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1) !important',
      },
    },
  },
}));

export const PostInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.2)'
      : 'rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
    fontSize: '0.95rem',
    padding: theme.spacing(1, 1.5),
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: 'rgba(208, 188, 255, 0.3)',
      background: theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.25)'
        : 'rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      borderColor: 'rgba(208, 188, 255, 0.5)',
      boxShadow: '0 0 0 2px rgba(208, 188, 255, 0.1)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  width: '100%'
}));

export const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0, 0),
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  marginTop: theme.spacing(1.5)
}));

export const PublishButton = styled(Button)(({ theme }) => ({
  borderRadius: '18px',
  textTransform: 'none',
  fontSize: '0.6rem',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(124, 77, 255, 0.25)',
  padding: theme.spacing(0.4, 1.5),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, rgb(180 163 220) 0%, rgb(177 161 216) 100%)'
    : 'linear-gradient(90deg, rgb(124 77 255) 0%, rgb(148 108 255) 100%)',
  color: theme.palette.mode === 'dark' ? '#000' : '#fff',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.35)',
  },
  '&.Mui-disabled': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
    color: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)'
  }
})); 