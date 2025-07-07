import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Tooltip,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  List,
  ListItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Folder as FolderIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
  EmojiEmotions as EmojiIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO';
import { useMessenger } from '../../contexts/MessengerContext';
import Lottie from 'lottie-react';
import pako from 'pako';
import StickerPackModal from '../../components/Messenger/StickerPackModal';

// API URL для мессенджера
const API_URL = 'https://k-connect.ru/apiMes';

// Функция для определения типа стикера
const getStickerType = (sticker) => {
  if (!sticker.url) return 'unknown';
  
  // Сначала проверяем данные стикера, если есть
  if (sticker.mime_type) {
    if (sticker.mime_type === 'application/x-tgsticker') return 'tgs';
    if (sticker.mime_type === 'video/webm') return 'webm';
    return 'static';
  }
  
  // Если данных нет, проверяем URL (менее надежно)
  const url = sticker.url.toLowerCase();
  if (url.includes('.tgs') || url.includes('tgsticker')) return 'tgs';
  if (url.includes('.webm')) return 'webm';
  
  // Для API эндпоинтов делаем асинхронную проверку
  if (url.includes('/api/messenger/stickers/')) {
    return 'api_check_needed';
  }
  
  return 'static'; // webp, png, jpeg
};

// Компонент для TGS стикера
const TGSSticker = ({ src, style, onClick }) => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadTGS = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(src);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        
        // Проверяем, действительно ли это TGS файл
        if (contentType !== 'application/x-tgsticker') {
          console.log('Not a TGS file, falling back to image:', contentType);
          setError(true);
          return;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        let jsonData;
        
        try {
          // Пробуем распаковать как gzip
          const decompressed = pako.inflate(arrayBuffer);
          const textDecoder = new TextDecoder();
          jsonData = JSON.parse(textDecoder.decode(decompressed));
        } catch (gzipError) {
          // Если не gzip, пробуем как обычный JSON
          const textDecoder = new TextDecoder();
          jsonData = JSON.parse(textDecoder.decode(arrayBuffer));
        }
        
        setAnimationData(jsonData);
      } catch (error) {
        console.error('Error loading TGS:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadTGS();
    }
  }, [src]);

  if (loading) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={16} />
      </div>
    );
  }

  if (error || !animationData) {
    // Fallback to image if TGS loading failed
    return (
      <img
        src={src}
        style={style}
        onClick={onClick}
        alt="Стикер"
      />
    );
  }

  return (
    <div style={style} onClick={onClick}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

// Компонент для асинхронной проверки типа стикера
const AsyncStickerRenderer = ({ src, style, onClick }) => {
  const [stickerType, setStickerType] = useState('loading');
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    const checkStickerType = async () => {
      try {
        // Сначала пробуем загрузить как TGS
        const response = await fetch(src);
        
        if (!response.ok) {
          setStickerType('static');
          return;
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType === 'application/x-tgsticker') {
          // Это TGS файл, пробуем его загрузить
          try {
            const arrayBuffer = await response.arrayBuffer();
            let jsonData;
            
            try {
              // Пробуем распаковать как gzip
              const decompressed = pako.inflate(arrayBuffer);
              const textDecoder = new TextDecoder();
              jsonData = JSON.parse(textDecoder.decode(decompressed));
            } catch (gzipError) {
              // Если не gzip, пробуем как обычный JSON
              const textDecoder = new TextDecoder();
              jsonData = JSON.parse(textDecoder.decode(arrayBuffer));
            }
            
            setAnimationData(jsonData);
            setStickerType('tgs');
          } catch (error) {
            console.error('Error loading TGS data:', error);
            setStickerType('static');
          }
        } else if (contentType === 'video/webm') {
          setStickerType('webm');
        } else {
          setStickerType('static');
        }
      } catch (error) {
        console.error('Error checking sticker type:', error);
        setStickerType('static');
      }
    };
    
    checkStickerType();
  }, [src]);
  
  if (stickerType === 'loading') {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={16} />
      </div>
    );
  }
  
  if (stickerType === 'tgs' && animationData) {
    return (
      <div style={style} onClick={onClick}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  } else if (stickerType === 'webm') {
    return (
      <video
        src={src}
        style={style}
        onClick={onClick}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  } else {
    return (
      <img
        src={src}
        style={style}
        onClick={onClick}
        alt="Стикер"
      />
    );
  }
};

// Компонент для рендеринга стикера с автоопределением типа
const StickerRenderer = ({ sticker, style, onClick }) => {
  const stickerType = getStickerType(sticker);
  const commonStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    ...style
  };

  // Для API эндпоинтов используем асинхронную проверку
  if (stickerType === 'api_check_needed') {
    return (
      <AsyncStickerRenderer
        src={sticker.url}
        style={commonStyle}
        onClick={onClick}
      />
    );
  }

  // Для известных типов используем прямой рендеринг
  if (stickerType === 'tgs') {
    return (
      <TGSSticker
        src={sticker.url}
        style={commonStyle}
        onClick={onClick}
      />
    );
  } else if (stickerType === 'webm') {
    return (
      <video
        src={sticker.url}
        style={commonStyle}
        onClick={onClick}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  } else {
    // Статичные стикеры (webp, png, jpeg)
    return (
      <img
        src={sticker.url}
        alt={sticker.name}
        style={commonStyle}
        onClick={onClick}
      />
    );
  }
};

// Стили для компонентов
const cardStyles = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: 'inherit'
};

const buttonStyles = {
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  color: 'inherit',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  }
};

const StickerManagePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Используем MessengerContext для правильной авторизации
  const { sessionKey, isChannel, loading: messengerLoading, user } = useMessenger();
  
  // Логируем состояние для отладки
  useEffect(() => {
    console.log('StickerManagePage: MessengerContext state:', {
      hasSessionKey: !!sessionKey,
      sessionKeyLength: sessionKey?.length || 0,
      isChannel,
      messengerLoading
    });
  }, [sessionKey, isChannel, messengerLoading]);
  
  // Состояния
  const [ownedPacks, setOwnedPacks] = useState([]);
  const [installedPacks, setInstalledPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stickerDialogOpen, setStickerDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialized, setInitialized] = useState(false);
  
  // Состояние для управления вкладками в диалоге
  const [tabValue, setTabValue] = useState(0);
  
  // Состояние для диалога управления стикерами
  const [manageStickersOpen, setManageStickersOpen] = useState(false);
  
  // Состояния для публичных стикерпаков
  const [mainTab, setMainTab] = useState(0); // 0 - Мои, 1 - Добавленные, 2 - Публичные
  const [publicPacks, setPublicPacks] = useState([]);
  const [publicLoading, setPublicLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [installingPacks, setInstallingPacks] = useState(new Set());
  const [modalPackId, setModalPackId] = useState(null);
  
  // Формы
  const [packForm, setPackForm] = useState({
    name: '',
    description: '',
    is_public: false
  });
  
  const [stickerForm, setStickerForm] = useState({
    name: '',
    emoji: '',
    file: null,
    preview: null
  });

  // Новое состояние для мультизагрузки стикеров
  const [multiStickerForm, setMultiStickerForm] = useState({
    files: [],
    previews: [],
    uploading: false,
    uploadResults: null
  });

  // Проверяем доступность для каналов
  useEffect(() => {
    if (isChannel) {
      setError('Каналы не могут создавать стикерпаки');
      setLoading(false);
      return;
    }
  }, [isChannel]);

  // Функция для создания заголовков авторизации
  const getAuthHeaders = useCallback(() => {
    console.log('getAuthHeaders called, sessionKey:', sessionKey ? 'present' : 'missing');
    
    if (!sessionKey) {
      console.error('No session key available');
      return null;
    }
    
    const headers = {
      'Authorization': `Bearer ${sessionKey}`,
      'Content-Type': 'application/json'
    };
    
    console.log('Generated auth headers:', { 
      Authorization: `Bearer ${sessionKey.substring(0, 10)}...`,
      'Content-Type': 'application/json'
    });
    
    return headers;
  }, [sessionKey]);

  // Загрузка стикерпаков
  const loadPacks = useCallback(async () => {
    if (isChannel) {
      setLoading(false);
      return;
    }
    
    if (!sessionKey) {
      console.log('Waiting for session key...');
      setLoading(false); // Останавливаем загрузку если нет sessionKey
      setError('Необходима авторизация');
      return;
    }
    
    try {
      setLoading(true);
      setError(''); // Очищаем предыдущие ошибки
      
      const headers = getAuthHeaders();
      if (!headers) {
        setLoading(false);
        return;
      }

      console.log('Loading sticker packs with session key:', sessionKey ? 'present' : 'missing');
      
      const response = await axios.get(`${API_URL}/messenger/sticker-packs/my`, {
        headers
      });
      
      console.log('Sticker packs response:', response.data);
      
      if (response.data.success) {
        const all = response.data.packs || [];
        const owned = [];
        const installed = [];
        all.forEach(p => {
          if (user && p.creator_id === user.id) {
            owned.push(p);
          } else {
            installed.push(p);
          }
        });
        setOwnedPacks(owned);
        setInstalledPacks(installed);
      } else {
        setError(response.data.error || 'Ошибка загрузки стикерпаков');
      }
    } catch (error) {
      console.error('Error loading sticker packs:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка загрузки стикерпаков');
      }
    } finally {
      setLoading(false);
    }
  }, [isChannel, sessionKey, user]);

  // Инициализация - загружаем данные только когда есть sessionKey и пользователь не канал
  useEffect(() => {
    console.log('StickerManagePage useEffect triggered:', { 
      sessionKey: !!sessionKey, 
      isChannel, 
      initialized
    });
    
    // Предотвращаем повторную инициализацию
    if (initialized) {
      return;
    }
    
    if (isChannel) {
      setError('Каналы не могут создавать стикерпаки');
      setInitialized(true);
      return;
    }
    
    if (sessionKey) {
      console.log('Session key available, loading sticker packs...');
      setInitialized(true);
      loadPacks();
    } else {
      console.log('No session key available yet, waiting...');
      // Не устанавливаем initialized = true, ждем появления sessionKey
    }
  }, [sessionKey, isChannel, initialized]); // Используем initialized вместо messengerLoading

  // Создание стикерпака
  const handleCreatePack = async () => {
    if (isChannel) return;
    
    if (!packForm.name.trim()) {
      setError('Название стикерпака не может быть пустым');
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.post(`${API_URL}/messenger/sticker-packs`, packForm, {
        headers
      });

      if (response.data.success) {
        setSuccess('Стикерпак успешно создан');
        setCreateDialogOpen(false);
        setPackForm({ name: '', description: '', is_public: false });
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка создания стикерпака');
      }
    } catch (error) {
      console.error('Error creating pack:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка создания стикерпака');
      }
    }
  };

  // Редактирование стикерпака
  const handleEditPack = async () => {
    if (!selectedPack || isChannel) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.put(`${API_URL}/messenger/sticker-packs/${selectedPack.id}`, packForm, {
        headers
      });

      if (response.data.success) {
        setSuccess('Стикерпак успешно обновлен');
        setEditDialogOpen(false);
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка обновления стикерпака');
      }
    } catch (error) {
      console.error('Error updating pack:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка обновления стикерпака');
      }
    }
  };

  // Удаление стикерпака
  const handleDeletePack = async (packId) => {
    if (isChannel) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить стикерпак? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.delete(`${API_URL}/messenger/sticker-packs/${packId}`, {
        headers
      });

      if (response.data.success) {
        setSuccess('Стикерпак удален');
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка удаления стикерпака');
      }
    } catch (error) {
      console.error('Error deleting pack:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка удаления стикерпака');
      }
    }
  };

  // Добавление стикера
  const handleAddSticker = async () => {
    if (isChannel) return;
    
    if (!stickerForm.name.trim() || !stickerForm.file) {
      setError('Заполните название и выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('name', stickerForm.name);
    formData.append('emoji', stickerForm.emoji);
    formData.append('file', stickerForm.file);

    try {
      if (!sessionKey) {
        setError('Отсутствует токен авторизации');
        return;
      }

      const response = await axios.post(`${API_URL}/messenger/sticker-packs/${selectedPack.id}/stickers`, formData, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Стикер добавлен');
        setStickerDialogOpen(false);
        setStickerForm({ name: '', emoji: '', file: null, preview: null });
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка добавления стикера');
      }
    } catch (error) {
      console.error('Error adding sticker:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка добавления стикера');
      }
    }
  };

  // Удаление стикера
  const handleDeleteSticker = async (packId, stickerId) => {
    if (isChannel) return;
    
    if (!window.confirm('Удалить стикер?')) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.delete(`${API_URL}/messenger/sticker-packs/${packId}/stickers/${stickerId}`, {
        headers
      });

      if (response.data.success) {
        setSuccess('Стикер удален');
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка удаления стикера');
      }
    } catch (error) {
      console.error('Error deleting sticker:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка удаления стикера');
      }
    }
  };

  // Обработка файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка типа файла - добавляем поддержку TGS
    const allowedTypes = ['image/webp', 'video/webm', 'image/png', 'image/jpeg', 'application/x-tgsticker'];
    const isTGSFile = file.name.toLowerCase().endsWith('.tgs');
    
    if (!allowedTypes.includes(file.type) && !isTGSFile) {
      setError('Поддерживаются только файлы WEBP, WEBM, PNG, JPEG, TGS');
      return;
    }

    // Проверка размера
    if (file.size > 1024 * 1024) { // 1MB
      setError('Размер файла не должен превышать 1MB');
      return;
    }

    setStickerForm(prev => ({
      ...prev,
      file,
      preview: URL.createObjectURL(file)
    }));
  };

  // Обработка множественных файлов
  const handleMultiFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    if (files.length > 20) {
      setError('Можно выбрать максимум 20 файлов за раз');
      return;
    }

    const allowedTypes = ['image/webp', 'video/webm', 'image/png', 'image/jpeg', 'application/x-tgsticker'];
    const validFiles = [];
    const previews = [];
    let hasErrors = false;

    files.forEach(file => {
      const isTGSFile = file.name.toLowerCase().endsWith('.tgs');
      
      if (!allowedTypes.includes(file.type) && !isTGSFile) {
        setError(`Файл ${file.name} имеет неподдерживаемый тип`);
        hasErrors = true;
        return;
      }

      if (file.size > 1024 * 1024) {
        setError(`Файл ${file.name} превышает размер 1MB`);
        hasErrors = true;
        return;
      }

      validFiles.push(file);
      
      // Генерируем название из имени файла
      const baseName = file.name.replace(/\.[^/.]+$/, ""); // Убираем расширение
      const stickerName = baseName
        .replace(/[_-]/g, ' ') // Заменяем _ и - на пробелы
        .replace(/\s+/g, ' ') // Убираем лишние пробелы
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '); // Делаем Title Case
      
      previews.push({
        file: file,
        url: URL.createObjectURL(file),
        name: file.name,
        stickerName: stickerName.substring(0, 30), // Ограничиваем длину
        emoji: '',
        id: Date.now() + Math.random(), // Уникальный ID для каждого превью
        mime_type: file.type === 'application/x-tgsticker' || file.name.toLowerCase().endsWith('.tgs') ? 'application/x-tgsticker' : file.type
      });
    });

    if (!hasErrors && validFiles.length > 0) {
      setMultiStickerForm(prev => ({
        ...prev,
        files: validFiles,
        previews: previews,
        uploadResults: null
      }));
      setError('');
    }
  };

  // Удаление файла из превью
  const removeFileFromPreview = (index) => {
    setMultiStickerForm(prev => {
      // Освобождаем URL объект
      if (prev.previews[index]) {
        URL.revokeObjectURL(prev.previews[index].url);
      }
      
      return {
        ...prev,
        files: prev.files.filter((_, i) => i !== index),
        previews: prev.previews.filter((_, i) => i !== index),
        uploadResults: null
      };
    });
  };

  // Обновление названия стикера
  const updateStickerName = (index, newName) => {
    setMultiStickerForm(prev => ({
      ...prev,
      previews: prev.previews.map((preview, i) => 
        i === index ? { ...preview, stickerName: newName.substring(0, 30) } : preview
      )
    }));
  };

  // Обновление эмодзи стикера
  const updateStickerEmoji = (index, newEmoji) => {
    setMultiStickerForm(prev => ({
      ...prev,
      previews: prev.previews.map((preview, i) => 
        i === index ? { ...preview, emoji: newEmoji.substring(0, 10) } : preview
      )
    }));
  };

  // Массовая загрузка стикеров
  const handleBulkUpload = async () => {
    if (isChannel) return;
    
    if (!multiStickerForm.files.length) {
      setError('Выберите файлы для загрузки');
      return;
    }

    // Проверяем, что у всех стикеров есть названия
    const emptyNames = multiStickerForm.previews.filter(preview => !preview.stickerName.trim());
    if (emptyNames.length > 0) {
      setError('Все стикеры должны иметь название');
      return;
    }

    setMultiStickerForm(prev => ({ ...prev, uploading: true }));
    setError('');
    setSuccess('');

    try {
      if (!sessionKey) {
        setError('Отсутствует токен авторизации');
        return;
      }

      // Загружаем стикеры по одному с индивидуальными названиями
      const results = [];
      
      for (let i = 0; i < multiStickerForm.files.length; i++) {
        const file = multiStickerForm.files[i];
        const preview = multiStickerForm.previews[i];
        
        try {
          const formData = new FormData();
          formData.append('name', preview.stickerName.trim());
          formData.append('emoji', preview.emoji.trim());
          formData.append('file', file);

          const response = await axios.post(
            `${API_URL}/messenger/sticker-packs/${selectedPack.id}/stickers`, 
            formData, 
            {
              headers: {
                'Authorization': `Bearer ${sessionKey}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          if (response.data.success) {
            results.push({
              filename: file.name,
              success: true,
              sticker_id: response.data.sticker_id,
              name: preview.stickerName
            });
          } else {
            results.push({
              filename: file.name,
              success: false,
              error: response.data.error || 'Неизвестная ошибка'
            });
          }
        } catch (error) {
          results.push({
            filename: file.name,
            success: false,
            error: error.response?.data?.error || 'Ошибка загрузки'
          });
        }
      }
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      setMultiStickerForm(prev => ({
        ...prev,
        uploadResults: {
          success: true,
          successful_uploads: successful.length,
          failed_uploads: failed.length,
          total_files: results.length,
          successful_files: successful,
          failed_files: failed
        }
      }));
      
      if (failed.length === 0) {
        setSuccess(`Все ${successful.length} стикеров успешно загружены!`);
      } else {
        setSuccess(`Загружено ${successful.length} из ${results.length} стикеров`);
        if (failed.length > 0) {
          setError(`Не удалось загрузить ${failed.length} файлов`);
        }
      }
      
      // Обновляем список стикерпаков
      loadPacks();
      
      // Очищаем форму если все загружено успешно
      if (failed.length === 0) {
        setTimeout(() => {
          // Освобождаем URL объекты
          multiStickerForm.previews.forEach(preview => {
            URL.revokeObjectURL(preview.url);
          });
          
          setMultiStickerForm({
            files: [],
            previews: [],
            uploading: false,
            uploadResults: null
          });
          setStickerDialogOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error in bulk upload:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка массовой загрузки стикеров');
      }
    } finally {
      setMultiStickerForm(prev => ({ ...prev, uploading: false }));
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (pack) => {
    setSelectedPack(pack);
    setPackForm({
      name: pack.name,
      description: pack.description || '',
      is_public: pack.is_public || false
    });
    setEditDialogOpen(true);
    setMenuAnchor(null);
  };

  // Открытие диалога добавления стикера
  const openStickerDialog = (pack) => {
    setSelectedPack(pack);
    setStickerDialogOpen(true);
    setMenuAnchor(null);
  };

  // Закрытие диалога стикеров с очисткой состояния
  const closeStickerDialog = () => {
    // Освобождаем URL объекты
    multiStickerForm.previews.forEach(preview => {
      URL.revokeObjectURL(preview.url);
    });
    
    // Очищаем состояния
    setMultiStickerForm({
      files: [],
      previews: [],
      uploading: false,
      uploadResults: null
    });
    
    setStickerForm({
      name: '',
      emoji: '',
      file: null,
      preview: null
    });
    
    setStickerDialogOpen(false);
    setError('');
    setSuccess('');
  };

  // Открытие диалога управления стикерами
  const openManageStickers = (pack) => {
    setSelectedPack(pack);
    setManageStickersOpen(true);
    setMenuAnchor(null);
  };

  // Загрузка публичных стикерпаков
  const loadPublicPacks = useCallback(async () => {
    try {
      setPublicLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      const url = `${API_URL}/messenger/sticker-packs/public${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setPublicPacks(response.data.packs || []);
      } else {
        setError('Ошибка загрузки публичных стикерпаков');
      }
    } catch (error) {
      console.error('Error loading public packs:', error);
      setError('Ошибка загрузки публичных стикерпаков');
    } finally {
      setPublicLoading(false);
    }
  }, [searchQuery]);

  // Установка стикерпака
  const handleInstallPack = async (packId) => {
    if (isChannel) return;
    
    if (installingPacks.has(packId)) return; // Уже устанавливается
    
    try {
      setInstallingPacks(prev => new Set([...prev, packId]));
      
      const headers = getAuthHeaders();
      if (!headers) return;
      
      const response = await axios.post(`${API_URL}/messenger/sticker-packs/${packId}/install`, {}, {
        headers
      });
      
      if (response.data.success) {
        setSuccess('Стикерпак добавлен в вашу коллекцию');
        // Обновляем список ваших паков
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка установки стикерпака');
      }
    } catch (error) {
      console.error('Error installing pack:', error);
      if (error.response?.status === 401) {
        setError('Ошибка авторизации. Попробуйте войти в систему заново.');
      } else {
        setError('Ошибка установки стикерпака');
      }
    } finally {
      setInstallingPacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(packId);
        return newSet;
      });
    }
  };

  // Поиск публичных стикерпаков
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Загрузка публичных паков при смене вкладки или поиска
  useEffect(() => {
    if (mainTab === 2) { // Вкладка "Публичные"
      loadPublicPacks();
    }
  }, [mainTab, loadPublicPacks]);

  // Дебаунс для поиска
  useEffect(() => {
    if (mainTab === 2) { // Только для вкладки "Публичные"
      const debounceTimer = setTimeout(() => {
        loadPublicPacks();
      }, 500); // 500мс задержка

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, mainTab, loadPublicPacks]);

  // Удаление установленного стикерпака из коллекции
  const handleUninstallPack = async (packId) => {
    if (isChannel) return;
    if (!window.confirm('Убрать стикерпак из вашей коллекции?')) return;
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      const response = await axios.delete(`${API_URL}/messenger/sticker-packs/${packId}/uninstall`, { headers });
      if (response.data.success) {
        setSuccess('Стикерпак удалён');
        loadPacks();
      } else {
        setError(response.data.error || 'Ошибка удаления стикерпака');
      }
    } catch (error) {
      console.error('Error uninstalling pack:', error);
      setError('Ошибка удаления стикерпака');
    }
  };

  // Если инициализированы но нет sessionKey - пользователь не авторизован
  if (initialized && !sessionKey && !isChannel) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, mb: 10 }}>
        <Alert severity="warning" sx={cardStyles}>
          Необходима авторизация для управления стикерпаками. 
          <Button onClick={() => window.location.href = '/login'} sx={{ ml: 2 }}>
            Войти
          </Button>
        </Alert>
      </Box>
    );
  }
  
  if (!initialized && !isChannel) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Откройте сначала мессенджер и после вернитесь сюда...
        </Typography>
      </Box>
    );
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Загрузка стикерпаков...
        </Typography>
      </Box>
    );
  }

  const installedIds = new Set([...installedPacks.map(p=>p.id), ...ownedPacks.map(p=>p.id)]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, mb: 10 }}>
      <SEO 
        title="Управление стикерпаками - K-Connect"
        description="Создание и редактирование стикерпаков для мессенджера K-Connect"
      />

      {/* Заголовок */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={buttonStyles}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
            Управление стикерпаками
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Создавайте и редактируйте свои стикерпаки для мессенджера
          </Typography>
        </Box>
      </Box>

      {/* Алерты */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, ...cardStyles }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, ...cardStyles }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Главные вкладки */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={mainTab}
          onChange={(e, newValue) => setMainTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab label="Мои" />
          <Tab label="Добавленные" />
          <Tab label="Публичные" />
        </Tabs>
      </Box>

      {/* Поиск для публичных стикерпаков */}
      {mainTab === 2 && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Поиск публичных стикерпаков..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={cardStyles}
            InputProps={{
              style: { color: 'inherit' }
            }}
          />
        </Box>
      )}

      {/* Список стикерпаков */}
      {mainTab === 0 ? (
        // Вкладка "Мои стикерпаки"
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {ownedPacks.map((pack) => (
                <Grid item xs={6} sm={4} md={3} key={pack.id} sx={{ display: 'flex' }}>
                  <Card sx={{ ...cardStyles, width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {pack.name}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setSelectedPack(pack);
                            setMenuAnchor(e.currentTarget);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      {/* Кол-во стикеров */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          size="small"
                          label={`${pack.sticker_count || pack.total_stickers || pack.sticker_total || pack.stickers?.length || 0} стикеров`}
                          variant="outlined"
                        />
                      </Box>

                      {/* Большой превью первой наклейки */}
                      {pack.stickers && pack.stickers.length > 0 && (
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            ...cardStyles,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <StickerRenderer
                            sticker={pack.stickers[0]}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                      )}

                      {/* Действия */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => openStickerDialog(pack)}
                          sx={buttonStyles}
                        >
                          Добавить стикер
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {/* Карточка создания нового пака */}
              <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    ...cardStyles,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                    }
                  }}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 1 }}>
                    <FolderIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h6" gutterBottom>
                      Создать стикерпак
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Нажмите, чтобы создать новый стикерпак
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      ) : mainTab === 1 ? (
        /* Вкладка "Добавленные" */
        <>
          {installedPacks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1">У вас нет добавленных стикерпаков</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {installedPacks.map(pack => (
                <Grid item xs={6} sm={4} md={3} key={pack.id} sx={{ display: 'flex' }}>
                  <Card sx={{ ...cardStyles, width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }} onClick={() => setModalPackId(pack.id)}>
                    <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{pack.name}</Typography>
                      {/* Большой превью первой наклейки */}
                      {pack.stickers && pack.stickers.length > 0 && (
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            ...cardStyles,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <StickerRenderer
                            sticker={pack.stickers[0]}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                      )}
                      {/* Кол-во стикеров */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          size="small"
                          label={`${pack.sticker_count || pack.total_stickers || pack.sticker_total || pack.stickers?.length || 0} стикеров`}
                          variant="outlined"
                        />
                      </Box>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={(e) => { e.stopPropagation(); handleUninstallPack(pack.id); }}
                        sx={{ ...buttonStyles, mt: 'auto' }}
                      >
                        Убрать стикерпак
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        // Вкладка "Публичные стикерпаки"
        <>
          {publicLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {publicPacks.map((pack) => (
                <Grid item xs={6} sm={4} md={3} key={pack.id} sx={{ display: 'flex' }}>
                  <Card sx={{ ...cardStyles, width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }} onClick={() => setModalPackId(pack.id)}>
                    <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {pack.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Автор: {pack.owner_name}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Кол-во стикеров */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          size="small"
                          label={`${pack.sticker_count || pack.total_stickers || pack.sticker_total || pack.stickers?.length || 0} стикеров`}
                          variant="outlined"
                        />
                      </Box>

                      {/* Большой превью первой наклейки */}
                      {pack.stickers && pack.stickers.length > 0 && (
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            ...cardStyles,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <StickerRenderer
                            sticker={pack.stickers[0]}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                      )}

                      {/* Действия */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        <Button
                          size="small"
                          startIcon={installingPacks.has(pack.id) ? <CircularProgress size={16} /> : installedIds.has(pack.id) ? null : <AddIcon />}
                          onClick={(e)=>{e.stopPropagation(); if(!installedIds.has(pack.id)) handleInstallPack(pack.id);}}
                          disabled={installingPacks.has(pack.id) || isChannel || installedIds.has(pack.id)}
                          sx={buttonStyles}
                        >
                          {installingPacks.has(pack.id) ? 'Устанавливается...' : installedIds.has(pack.id) ? 'Уже добавлен' : 'Установить стикерпак'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {publicPacks.length === 0 && !publicLoading && (
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <EmojiIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Публичных стикерпаков не найдено
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'Попробуйте другой поисковый запрос' : 'Пока что никто не создал публичных стикерпаков'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </>
      )}

      {/* Меню действий */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: cardStyles }}
      >
        <MenuItem onClick={() => openEditDialog(selectedPack)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openStickerDialog(selectedPack)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Добавить стикер</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openManageStickers(selectedPack)}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Управлять стикерами</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeletePack(selectedPack?.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Удалить пак</ListItemText>
        </MenuItem>
      </Menu>

      {/* Диалог создания стикерпака */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: cardStyles }}
      >
        <DialogTitle>
          Создать новый стикерпак
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название стикерпака"
            fullWidth
            value={packForm.name}
            onChange={(e) => setPackForm(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Описание (необязательно)"
            fullWidth
            multiline
            rows={2}
            value={packForm.description}
            onChange={(e) => setPackForm(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={packForm.is_public}
                onChange={(e) => setPackForm(prev => ({ ...prev, is_public: e.target.checked }))}
              />
            }
            label="Публичный стикерпак"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleCreatePack} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования стикерпака */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: cardStyles }}
      >
        <DialogTitle>
          Редактировать стикерпак
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название стикерпака"
            fullWidth
            value={packForm.name}
            onChange={(e) => setPackForm(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Описание (необязательно)"
            fullWidth
            multiline
            rows={2}
            value={packForm.description}
            onChange={(e) => setPackForm(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={packForm.is_public}
                onChange={(e) => setPackForm(prev => ({ ...prev, is_public: e.target.checked }))}
              />
            }
            label="Публичный стикерпак"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleEditPack} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Новый диалог с мультизагрузкой */}
      <Dialog
        open={stickerDialogOpen}
        onClose={closeStickerDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: cardStyles }}
      >
        <DialogTitle>
          Добавить стикеры в "{selectedPack?.name}"
        </DialogTitle>
        <DialogContent>
          {/* Загрузка файлов */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={buttonStyles}
            >
              Выбрать файлы (WEBP, WEBM, PNG, JPEG, TGS)
              <input
                type="file"
                hidden
                accept=".webp,.webm,.png,.jpeg,.jpg,.tgs"
                multiple
                onChange={handleMultiFileChange}
              />
            </Button>
          </Box>

          {/* Превью выбранных файлов */}
          {multiStickerForm.previews.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Выбранные стикеры ({multiStickerForm.previews.length})
              </Typography>
              
              <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                {multiStickerForm.previews.map((preview, index) => (
                  <Card key={preview.id} sx={{ ...cardStyles, mb: 2, p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Превью изображения */}
                      <Grid item xs={12} sm={3} md={2}>
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            ...cardStyles,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <StickerRenderer sticker={preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          <IconButton
                            size="small"
                            onClick={() => removeFileFromPreview(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: 'white',
                              width: 24,
                              height: 24,
                              '&:hover': {
                                bgcolor: 'error.dark'
                              }
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Grid>
                      
                      {/* Поля ввода */}
                      <Grid item xs={12} sm={9} md={10}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                              Файл: {preview.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={8}>
                            <TextField
                              fullWidth
                              label="Название стикера"
                              value={preview.stickerName}
                              onChange={(e) => updateStickerName(index, e.target.value)}
                              variant="outlined"
                              size="small"
                              inputProps={{ maxLength: 30 }}
                              helperText={`${preview.stickerName.length}/30`}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  ...cardStyles
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Эмодзи (необязательно)"
                              value={preview.emoji}
                              onChange={(e) => updateStickerEmoji(index, e.target.value)}
                              variant="outlined"
                              size="small"
                              inputProps={{ maxLength: 10 }}
                              helperText={`${preview.emoji.length}/10`}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  ...cardStyles
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Результаты загрузки */}
          {multiStickerForm.uploadResults && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Результаты загрузки
              </Typography>
              
              {multiStickerForm.uploadResults.successful_files?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    ✅ Успешно загружено ({multiStickerForm.uploadResults.successful_files.length}):
                  </Typography>
                  <List dense>
                    {multiStickerForm.uploadResults.successful_files.map((file, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <Typography variant="body2" color="success.main">
                          • {file.name} → "{file.filename}"
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {multiStickerForm.uploadResults.failed_files?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="error.main" gutterBottom>
                    ❌ Ошибки загрузки ({multiStickerForm.uploadResults.failed_files.length}):
                  </Typography>
                  <List dense>
                    {multiStickerForm.uploadResults.failed_files.map((file, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <Typography variant="body2" color="error.main">
                          • {file.filename}: {file.error}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            Поддерживаемые форматы: WEBP, WEBM, PNG, JPEG, TGS. Максимальный размер: 1MB.
            PNG автоматически конвертируется в WEBP.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStickerDialog}>
            Отмена
          </Button>
          <Button 
            onClick={handleBulkUpload} 
            variant="contained"
            disabled={multiStickerForm.uploading || multiStickerForm.files.length === 0}
            startIcon={multiStickerForm.uploading ? <CircularProgress size={16} /> : <UploadIcon />}
          >
            {multiStickerForm.uploading ? 'Загружается...' : `Загрузить ${multiStickerForm.files.length} стикеров`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог управления стикерами */}
      <Dialog
        open={manageStickersOpen}
        onClose={() => setManageStickersOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: cardStyles }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Управление стикерами "{selectedPack?.name}"</span>
            <IconButton onClick={() => setManageStickersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPack?.stickers && selectedPack.stickers.length > 0 ? (
            <Grid container spacing={2}>
              {selectedPack.stickers.map((sticker) => (
                <Grid item xs={6} sm={4} md={3} key={sticker.id}>
                  <Card sx={{ ...cardStyles, position: 'relative' }}>
                    <Box
                      sx={{
                        height: 100,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <StickerRenderer 
                        sticker={sticker} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain' 
                        }} 
                      />
                    </Box>
                    <CardContent sx={{ p: 1, pb: '8px !important' }}>
                      <Typography variant="caption" noWrap title={sticker.name}>
                        {sticker.name}
                      </Typography>
                      {sticker.emoji && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {sticker.emoji}
                        </Typography>
                      )}
                    </CardContent>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSticker(selectedPack.id, sticker.id)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'error.dark'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                В этом стикерпаке пока нет стикеров
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Добавьте стикеры, чтобы начать их использовать в чатах
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setManageStickersOpen(false);
                  openStickerDialog(selectedPack);
                }}
              >
                Добавить стикеры
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setManageStickersOpen(false);
              openStickerDialog(selectedPack);
            }}
          >
            Добавить стикеры
          </Button>
          <Button onClick={() => setManageStickersOpen(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модалка просмотра стикерпака */}
      <StickerPackModal
        open={Boolean(modalPackId)}
        packId={modalPackId}
        onClose={() => setModalPackId(null)}
      />
    </Box>
  );
};

export default StickerManagePage; 