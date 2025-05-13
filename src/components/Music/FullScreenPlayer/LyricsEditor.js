import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box, Alert, CircularProgress, Menu, MenuItem } from '@mui/material';
import { Save, Schedule, Warning, Upload, Download } from '@mui/icons-material';
import styles from './LyricsEditor.module.scss';

const LyricsEditor = ({ 
  lyricsData, 
  currentTrack, 
  onCancel, 
  dominantColor, 
  onShowLyrics,
  onShowSnackbar,
  onOpenTimestampEditor
}) => {
  const [lyricsText, setLyricsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (lyricsData?.has_lyrics && lyricsData.lyrics) {
      setLyricsText(lyricsData.lyrics);
    }
  }, [lyricsData]);

  const handleLyricsChange = (e) => {
    setLyricsText(e.target.value);
  };

  const handleSaveLyrics = async () => {
    if (!currentTrack?.id) {
      setError('Трек не выбран');
      return;
    }
    
    if (!lyricsText.trim()) {
      setError('Текст песни не может быть пустым');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      const response = await fetch(`/api/music/${currentTrack.id}/lyrics/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: lyricsText,
          source_url: 'manually_added'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onShowSnackbar('Текст успешно сохранен', 'success');
        onShowLyrics();
      } else {
        setError(data.error || 'Не удалось сохранить текст');
        
        if (data.warning) {
          onShowSnackbar(data.warning, 'warning');
        }
      }
    } catch (error) {
      console.error('Error saving lyrics:', error);
      setError('Ошибка при сохранении текста. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const getActiveColor = () => {
    if (dominantColor) {
      return `rgb(${dominantColor})`;
    }
    return '#ff2d55';
  };
  
  const getButtonBackgroundColor = () => {
    if (dominantColor) {
      return `rgba(${dominantColor}, 0.15)`;
    }
    return 'rgba(255, 45, 85, 0.15)';
  };
  
  const getButtonHoverColor = () => {
    if (dominantColor) {
      return `rgba(${dominantColor}, 0.25)`;
    }
    return 'rgba(255, 45, 85, 0.25)';
  };


  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleDownloadLyricsForSync = () => {
    if (!currentTrack?.id || !lyricsText.trim()) {
      setError('Нет доступного текста для скачивания');
      return;
    }

    try {
      const lines = lyricsText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      

      let lrcContent = "[ti:" + (currentTrack.title || "Unknown Title") + "]\n";
      lrcContent += "[ar:" + (currentTrack.artist || "Unknown Artist") + "]\n";
      lrcContent += "[al:" + (currentTrack.album || "Unknown Album") + "]\n";
      lrcContent += "[by:К-Коннект Авто-Генерация LRC]\n\n";
      
      lines.forEach(line => {
        lrcContent += "[00:00.00]" + line + "\n";
      });
      

      const lrcBlob = new Blob([lrcContent], { type: 'text/plain' });
      const lrcUrl = URL.createObjectURL(lrcBlob);
      const lrcLink = document.createElement('a');
      lrcLink.href = lrcUrl;
      lrcLink.download = `${currentTrack.artist} - ${currentTrack.title}.lrc`;
      

      onShowSnackbar('Скачивание шаблона LRC для синхронизации', 'info');
      
      lrcLink.click();
      

      setTimeout(() => {
        URL.revokeObjectURL(lrcUrl);
      }, 2000);
      
      handleCloseMenu();
    } catch (error) {
      console.error("Error generating download template:", error);
      setError('Ошибка при создании шаблона для синхронизации');
    }
  };

  const handleOpenFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    handleCloseMenu();
  };

  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    uploadSyncFile(file);
  };

  const uploadSyncFile = async (file) => {
    if (!file || !currentTrack?.id) {
      setError('Нет файла для загрузки или трек не выбран');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/music/${currentTrack.id}/lyrics/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось загрузить файл синхронизации');
      }
      
      const result = await response.json();
      
      onShowSnackbar('Синхронизация успешно загружена', 'success');
      onShowLyrics();
      
    } catch (error) {
      console.error("Error uploading sync file:", error);
      setError(`Ошибка при загрузке файла: ${error.message}`);
      
      onShowSnackbar(`Ошибка при загрузке синхронизации: ${error.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography className={styles.title}>
          Редактирование текста
        </Typography>
      </div>

      {error && (
        <Alert 
          severity="error" 
          variant="filled"
          className={styles.alert}
        >
          {error}
        </Alert>
      )}
      
      <Alert 
        severity="info" 
        icon={<Warning />}
        variant="outlined"
        className={styles.infoAlert}
      >
        Вы можете найти тексты песен на Genius или других сервисах. 
        Пожалуйста, соблюдайте авторские права при добавлении текстов.
      </Alert>
      
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={lyricsText}
        onChange={handleLyricsChange}
        placeholder="Введите текст песни здесь..."
        className={styles.textField}
        InputProps={{
          classes: {
            root: styles.inputRoot,
            focused: styles.inputFocused
          }
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.15)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.3)',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${getActiveColor()} !important`,
            borderWidth: '1px',
          }
        }}
      />
      
      <div className={styles.actions}>
        <Button
          variant="outlined"
          onClick={handleOpenMenu}
          startIcon={<Schedule />}
          className={styles.secondaryButton}
          style={{
            borderColor: getButtonBackgroundColor(),
            color: getActiveColor(),
            backgroundColor: 'transparent'
          }}
        >
          Синхронизация
        </Button>
        
        <div>
          <Button
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Отмена
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSaveLyrics}
            disabled={isSaving || uploading}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save />}
            className={styles.saveButton}
            style={{ 
              backgroundColor: getActiveColor(),
              boxShadow: dominantColor ? `0 4px 12px rgba(${dominantColor}, 0.3)` : undefined
            }}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* LRC File handling menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(25, 25, 25, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            color: 'white',
            minWidth: '250px'
          }
        }}
      >
        <MenuItem 
          onClick={handleDownloadLyricsForSync}
          style={{
            padding: '12px',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
          }}
        >
          <Download style={{ marginRight: '12px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="body2">Скачать LRC шаблон для синхронизации</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={handleOpenFileSelector}
          style={{
            padding: '12px',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
          }}
        >
          <Upload style={{ marginRight: '12px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="body2">Загрузить синхронизацию (LRC/JSON)</Typography>
        </MenuItem>
      </Menu>
      
      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".lrc,.json"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default LyricsEditor; 